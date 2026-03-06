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
    // Always log webhook verification errors
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
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🔔 Processing checkout.session.completed event');
          console.log('Session ID:', session.id);
          console.log('Session metadata:', JSON.stringify(session.metadata, null, 2));
        }
        
        // Get userId from metadata
        const userId = session.metadata?.userId || session.metadata?.firebaseUID; // Support both for backward compatibility
        const email = session.metadata?.email || session.customer_email;

        if (!userId) {
          console.error('❌ No userId in checkout session metadata');
          if (process.env.NODE_ENV === 'development') {
            console.error('Available metadata keys:', Object.keys(session.metadata || {}));
          }
          return NextResponse.json(
            { error: 'Missing userId in metadata' },
            { status: 400 }
          );
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('✅ User ID found:', userId);
          console.log('✅ Email:', email);
        }

        // Get subscription details
        const subscriptionId = session.subscription as string;
        if (!subscriptionId) {
          console.error('❌ No subscription ID in checkout session');
          if (process.env.NODE_ENV === 'development') {
            console.error('Session object keys:', Object.keys(session));
          }
          return NextResponse.json(
            { error: 'No subscription ID found' },
            { status: 400 }
          );
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Subscription ID:', subscriptionId);
        }

        try {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;
          const customerId = subscription.customer as string;
          const priceId = subscription.items.data[0]?.price.id;
          
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Customer ID:', customerId);
            console.log('✅ Price ID:', priceId);
          }
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
            if (process.env.NODE_ENV === 'development') {
              console.warn('⚠️ Could not retrieve price details, using fallback logic');
            }
            // Fallback: check price ID string
            plan = priceId.includes('monthly') || priceId.includes('month')
              ? 'monthly'
              : priceId.includes('yearly') || priceId.includes('year')
              ? 'yearly'
              : 'monthly'; // Default to monthly if can't determine
          }

          // Get current period end (Unix timestamp in seconds, convert to milliseconds)
          const currentPeriodEnd = (subscription as any).current_period_end * 1000;

          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Plan:', plan);
            console.log('✅ Current period end:', new Date(currentPeriodEnd).toISOString());
          }

          // Update Supabase user document and create subscription record using service role key (bypasses RLS)
          try {
            console.log('📝 Updating Supabase for user:', userId);
            console.log('📝 Email:', email);
            
            // Verify service client can be created
            let supabase;
            try {
              supabase = createServiceClient();
              console.log('✅ Service client created successfully');
            } catch (clientError: any) {
              console.error('❌ Failed to create service client:', clientError.message);
              return NextResponse.json(
                { 
                  error: 'Service client error',
                  message: clientError.message,
                },
                { status: 500 }
              );
            }
            
            // First, check if user exists
            const { data: existingUser, error: checkError } = await supabase
              .from('users')
              .select('id, email')
              .eq('id', userId)
              .single();

            if (process.env.NODE_ENV === 'development') {
              console.log('🔍 Existing user check:', { existingUser, checkError });
            }

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

            // Always log the data being upserted for debugging
            console.log('📤 Upserting user data:', JSON.stringify(upsertData, null, 2));
            console.log('📤 User ID:', userId);
            console.log('📤 Email:', email);
            console.log('📤 Plan:', plan);
            console.log('📤 Customer ID:', customerId);
            console.log('📤 Period End:', currentPeriodEnd);

            // Try upsert first
            let upsertedData;
            let upsertError;
            
            const { data: upsertResult, error: upsertErr } = await supabase
              .from('users')
              .upsert(upsertData, {
                onConflict: 'id',
              })
              .select();

            upsertedData = upsertResult;
            upsertError = upsertErr;

            // If upsert fails, try insert then update as fallback
            if (upsertError) {
              console.error('❌ Upsert failed, trying insert/update fallback...');
              console.error('Upsert error:', upsertError.message);
              
              // Try insert first (in case user doesn't exist)
              const { data: insertData, error: insertError } = await supabase
                .from('users')
                .insert(upsertData)
                .select();
              
              if (insertError) {
                // If insert fails (user exists), try update
                if (insertError.code === '23505') { // Unique violation = user exists
                  console.log('🔄 User exists, trying update instead...');
                  const { data: updateData, error: updateError } = await supabase
                    .from('users')
                    .update({
                      email: upsertData.email,
                      subscription_status: upsertData.subscription_status,
                      plan: upsertData.plan,
                      stripe_customer_id: upsertData.stripe_customer_id,
                      current_period_end: upsertData.current_period_end,
                      updated_at: upsertData.updated_at,
                    })
                    .eq('id', userId)
                    .select();
                  
                  if (updateError) {
                    console.error('❌ Update also failed:', updateError);
                    upsertError = updateError;
                  } else {
                    console.log('✅ Update succeeded as fallback');
                    upsertedData = updateData;
                    upsertError = null;
                  }
                } else {
                  console.error('❌ Insert failed:', insertError);
                  upsertError = insertError;
                }
              } else {
                console.log('✅ Insert succeeded as fallback');
                upsertedData = insertData;
                upsertError = null;
              }
            }

            if (upsertError) {
              console.error('❌ All database operations failed:', {
                code: upsertError.code,
                message: upsertError.message,
                details: upsertError.details,
                hint: upsertError.hint,
                userId: userId,
                email: email,
              });
              // Return error response instead of throwing to prevent webhook retry loop
              return NextResponse.json(
                { 
                  error: 'Failed to update user record',
                  details: upsertError.message,
                  userId: userId,
                  code: upsertError.code,
                },
                { status: 500 }
              );
            }

            // Always log success (even in production) for debugging
            console.log(`✅✅✅ Subscription activated for user ${userId}`);
            console.log(`✅✅✅ Upserted data:`, JSON.stringify(upsertedData, null, 2));
            
            // Verify the data was actually stored - wait a moment for DB to commit
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const { data: verifyData, error: verifyError } = await supabase
              .from('users')
              .select('id, email, subscription_status, plan, stripe_customer_id, current_period_end, created_at, updated_at')
              .eq('id', userId)
              .single();
            
            if (verifyError) {
              console.error('❌ Verification failed - data may not have been stored:', verifyError);
              console.error('❌ Verification error details:', {
                code: verifyError.code,
                message: verifyError.message,
                hint: verifyError.hint,
              });
            } else {
              console.log('✅ Verification successful - data confirmed in database:', verifyData);
              console.log(`✅✅✅ User data stored in users table successfully`);
            }
            
            return NextResponse.json({ 
              received: true,
              message: 'Subscription data stored successfully',
              userId: userId,
              verified: !verifyError,
              storedData: verifyData || null,
              upsertedData: upsertedData,
            });
          } catch (supabaseError: any) {
            console.error('❌❌❌ Error updating Supabase:', supabaseError);
            console.error('Error code:', supabaseError.code);
            console.error('Error message:', supabaseError.message);
            console.error('Error details:', supabaseError.details);
            console.error('Error hint:', supabaseError.hint);
            console.error('Error stack:', supabaseError.stack);
            console.error('User ID:', userId);
            console.error('Email:', email);
            // Return error response so we can see it in Stripe webhook logs
            return NextResponse.json(
              { 
                error: 'Failed to store subscription data',
                message: supabaseError.message,
                userId: userId,
              },
              { status: 500 }
            );
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
          // Update user document subscription status to inactive
          const { error: updateError } = await supabase
            .from('users')
            .update({
              subscription_status: 'inactive',
              updated_at: new Date().toISOString(),
            })
            .eq('id', userData.id);

          if (updateError) {
            console.error('❌ Error updating user subscription status:', updateError);
          } else {
            console.log(`✅ User subscription status updated to inactive for user ${userData.id}`);
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

          // Update user document in users table
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
