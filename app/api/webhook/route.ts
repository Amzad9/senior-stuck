import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceClient } from '@/utils/supabase/service';

// Only check STRIPE_SECRET_KEY at module load (required for Stripe client)
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
});

// Disable body parsing for webhook route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Check STRIPE_WEBHOOK_SECRET at runtime (not during build)
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET is not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('🔔 Processing checkout.session.completed event');
        console.log('Session ID:', session.id);
        console.log('Session metadata:', JSON.stringify(session.metadata, null, 2));
        
        // Get userId from metadata
        const userId = session.metadata?.userId || session.metadata?.firebaseUID; // Support both for backward compatibility
        const email = session.metadata?.email || session.customer_email;

        if (!userId) {
          console.error('❌ No userId in checkout session metadata');
          console.error('Available metadata keys:', Object.keys(session.metadata || {}));
          return NextResponse.json(
            { error: 'Missing userId in metadata' },
            { status: 400 }
          );
        }

        console.log('✅ User ID found:', userId);
        console.log('✅ Email:', email);

        // Get subscription details
        const subscriptionId = session.subscription as string;
        if (!subscriptionId) {
          console.error('❌ No subscription ID in checkout session');
          console.error('Session object keys:', Object.keys(session));
          return NextResponse.json(
            { error: 'No subscription ID found' },
            { status: 400 }
          );
        }

        console.log('✅ Subscription ID:', subscriptionId);

        try {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;
          const customerId = subscription.customer as string;
          const priceId = subscription.items.data[0]?.price.id;
          
          console.log('✅ Customer ID:', customerId);
          console.log('✅ Price ID:', priceId);
          console.log('✅ Subscription status:', subscription.status);

          if (!priceId) {
            console.error('❌ No price ID in subscription');
            return NextResponse.json(
              { error: 'No price ID found' },
              { status: 400 }
            );
          }

          // Determine plan type from price interval
          let plan: 'monthly' | 'yearly' = 'monthly'; // Default to monthly
          try {
            // Retrieve the price to get its interval
            const price = await stripe.prices.retrieve(priceId);
            if (price.recurring?.interval === 'month') {
              plan = 'monthly';
            } else if (price.recurring?.interval === 'year') {
              plan = 'yearly';
            } else {
              // Fallback: check price ID string as backup
              plan = priceId.includes('monthly') || priceId.includes('month')
                ? 'monthly'
                : priceId.includes('yearly') || priceId.includes('year')
                ? 'yearly'
                : 'monthly'; // Default to monthly if can't determine
            }
          } catch (priceError) {
            console.warn('⚠️ Could not retrieve price details, using fallback logic');
            // Fallback: check price ID string
            plan = priceId.includes('monthly') || priceId.includes('month')
              ? 'monthly'
              : priceId.includes('yearly') || priceId.includes('year')
              ? 'yearly'
              : 'monthly'; // Default to monthly if can't determine
          }

          // Get current period end (Unix timestamp in seconds, convert to milliseconds)
          const currentPeriodEnd = (subscription as any).current_period_end * 1000;

          console.log('✅ Plan:', plan);
          console.log('✅ Current period end:', new Date(currentPeriodEnd).toISOString());

          // Update Supabase user document and create subscription record using service role key (bypasses RLS)
          try {
            console.log('📝 Updating Supabase for user:', userId);
            const supabase = createServiceClient();
            
            // First, check if user exists
            const { data: existingUser, error: checkError } = await supabase
              .from('users')
              .select('id, email')
              .eq('id', userId)
              .single();

            console.log('🔍 Existing user check:', { existingUser, checkError });

            // Update user document (keep for backward compatibility)
            const upsertData = {
              id: userId,
              email: email || '',
              subscription_status: 'active' as const,
              plan: plan as 'monthly' | 'yearly' | null,
              stripe_customer_id: customerId,
              current_period_end: currentPeriodEnd,
              updated_at: new Date().toISOString(),
            };

            // If user doesn't exist, set created_at
            if (!existingUser) {
              (upsertData as any).created_at = new Date().toISOString();
            }

            console.log('📤 Upserting user data:', JSON.stringify(upsertData, null, 2));

            const { data: upsertedData, error: upsertError } = await supabase
              .from('users')
              .upsert(upsertData, {
                onConflict: 'id',
              })
              .select();

            if (upsertError) {
              console.error('❌ Upsert error details:', {
                code: upsertError.code,
                message: upsertError.message,
                details: upsertError.details,
                hint: upsertError.hint,
              });
              throw upsertError;
            }

            console.log('✅ Upserted user data:', upsertedData);

            // Create or update subscription record in subscriptions table
            const subscriptionData = {
              user_id: userId,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: customerId,
              plan: plan as 'monthly' | 'yearly',
              subscription_status: subscription.status === 'active' ? 'active' : 'inactive',
              current_period_end: currentPeriodEnd,
              updated_at: new Date().toISOString(),
            };

            console.log('📤 Upserting subscription data:', JSON.stringify(subscriptionData, null, 2));

            const { data: subscriptionRecord, error: subscriptionError } = await supabase
              .from('subscriptions')
              .upsert(subscriptionData, {
                onConflict: 'stripe_subscription_id',
              })
              .select();

            if (subscriptionError) {
              console.error('❌ Subscription upsert error:', subscriptionError);
              // Don't throw - user record was updated, subscription record is optional
            } else {
              console.log('✅ Subscription record created/updated:', subscriptionRecord);
            }

            console.log(`✅✅✅ Subscription activated for user ${userId}`);
            console.log(`✅✅✅ User document and subscription record updated in Supabase successfully`);
          } catch (supabaseError: any) {
            console.error('❌❌❌ Error updating Supabase:', supabaseError);
            console.error('Error code:', supabaseError.code);
            console.error('Error message:', supabaseError.message);
            console.error('Error details:', supabaseError.details);
            console.error('Error hint:', supabaseError.hint);
            console.error('Error stack:', supabaseError.stack);
            // Don't return error - log it but continue (webhook should return 200)
            // This allows Stripe to know the webhook was received
          }

          break;
        } catch (stripeError: any) {
          console.error('❌ Error retrieving subscription from Stripe:', stripeError);
          console.error('Stripe error message:', stripeError.message);
          return NextResponse.json(
            { error: `Failed to retrieve subscription: ${stripeError.message}` },
            { status: 500 }
          );
        }
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const subscriptionId = subscription.id;

        // Find user by Stripe customer ID using service role key
        const supabase = createServiceClient();
        const { data: userData, error: findError } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userData && !findError) {
          // Update subscription record status to inactive
          const { error: subscriptionUpdateError } = await supabase
            .from('subscriptions')
            .update({
              subscription_status: 'inactive',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId);

          if (subscriptionUpdateError) {
            console.error('❌ Error updating subscription record:', subscriptionUpdateError);
          } else {
            console.log(`✅ Subscription record updated - status set to inactive for subscription ${subscriptionId}`);
          }

          // Check if user has any active subscriptions left
          const { data: activeSubscriptions, error: checkActiveError } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', userData.id)
            .eq('subscription_status', 'active');

          // Update user document subscription status based on remaining active subscriptions
          const { error: updateError } = await supabase
            .from('users')
            .update({
              subscription_status: activeSubscriptions && activeSubscriptions.length > 0 ? 'active' : 'inactive',
              updated_at: new Date().toISOString(),
            })
            .eq('id', userData.id);

          if (updateError) {
            console.error('❌ Error updating user subscription status:', updateError);
          } else {
            console.log(`✅ User subscription status updated - ${activeSubscriptions && activeSubscriptions.length > 0 ? 'active' : 'inactive'} for user ${userData.id}`);
          }
        } else {
          console.error(`❌ User not found for customer ID: ${customerId}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const subscriptionId = subscription.id;

        // Find user by Stripe customer ID using service role key
        const supabase = createServiceClient();
        const { data: userData, error: findError } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userData && !findError) {
          const priceId = subscription.items.data[0]?.price.id;
          
          // Determine plan type from price interval
          let plan: 'monthly' | 'yearly' | null = null;
          if (priceId) {
            try {
              // Retrieve the price to get its interval
              const price = await stripe.prices.retrieve(priceId);
              if (price.recurring?.interval === 'month') {
                plan = 'monthly';
              } else if (price.recurring?.interval === 'year') {
                plan = 'yearly';
              } else {
                // Fallback: check price ID string as backup
                plan = priceId.includes('monthly') || priceId.includes('month')
                  ? 'monthly'
                  : priceId.includes('yearly') || priceId.includes('year')
                  ? 'yearly'
                  : 'monthly'; // Default to monthly if can't determine
              }
            } catch (priceError) {
              console.warn('⚠️ Could not retrieve price details, using fallback logic');
              // Fallback: check price ID string
              plan = priceId.includes('monthly') || priceId.includes('month')
                ? 'monthly'
                : priceId.includes('yearly') || priceId.includes('year')
                ? 'yearly'
                : 'monthly'; // Default to monthly if can't determine
            }
          } else {
            plan = 'monthly'; // Default to monthly if no price ID
          }

          const currentPeriodEnd = (subscription as any).current_period_end * 1000;

          // Update subscription record in subscriptions table
          const { error: subscriptionUpdateError } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userData.id,
              stripe_subscription_id: subscriptionId,
              stripe_customer_id: customerId,
              plan: plan as 'monthly' | 'yearly',
              subscription_status: subscription.status === 'active' ? 'active' : subscription.status === 'canceled' ? 'cancelled' : 'inactive',
              current_period_end: currentPeriodEnd,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'stripe_subscription_id',
            });

          if (subscriptionUpdateError) {
            console.error('❌ Error updating subscription record:', subscriptionUpdateError);
          } else {
            console.log(`✅ Subscription record updated for subscription ${subscriptionId}`);
          }

          // Update user document (for backward compatibility)
          const { error: updateError } = await supabase
            .from('users')
            .update({
              subscription_status: subscription.status === 'active' ? 'active' : 'cancelled',
              plan: plan,
              current_period_end: currentPeriodEnd,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userData.id);

          if (updateError) {
            console.error('Error updating subscription:', updateError);
          } else {
            console.log(`Subscription updated for user ${userData.id}`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
