import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CheckoutRequest } from '@/lib/types';
import { createServiceClient } from '@/utils/supabase/service';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

if (process.env.STRIPE_SECRET_KEY.startsWith('pk_')) {
  throw new Error('STRIPE_SECRET_KEY must be a secret key (starts with sk_test_ or sk_live_), not a publishable key (pk_).');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { userId, email, priceId } = body;

    console.log('🛒 Checkout API called');
    console.log('👤 User ID:', userId);
    console.log('📧 Email:', email);
    console.log('💰 Price ID:', priceId);

    // Validate required fields
    if (!userId || !email || !priceId) {
      console.error('❌ Missing required fields:', { userId: !!userId, email: !!email, priceId: !!priceId });
      return NextResponse.json(
        { error: 'Missing required fields: userId, email, and priceId are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Method 1: Quick check in database first (for efficiency)
    console.log('🔍 Checking for existing subscription in database...');
    const supabase = createServiceClient();
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('id, subscription_status, stripe_customer_id')
      .eq('id', userId)
      .maybeSingle();

    if (dbError && dbError.code !== 'PGRST116') {
      console.error('❌ Error checking database:', dbError);
      // Continue anyway - we'll check Stripe directly
    }

    // Check if user has active subscription in database
    if (userData?.subscription_status === 'active') {
      console.log('⚠️ User has active subscription in database');
      
      // Method 2: Double-check with Stripe directly (more reliable)
      if (userData.stripe_customer_id) {
        try {
          console.log('🔍 Verifying with Stripe for customer:', userData.stripe_customer_id);
          const subscriptions = await stripe.subscriptions.list({
            customer: userData.stripe_customer_id,
            status: 'active',
            limit: 1,
          });

          if (subscriptions.data.length > 0) {
            const activeSubscription = subscriptions.data[0];
            console.log('❌ Active subscription found in Stripe:', activeSubscription.id);
            return NextResponse.json(
              { 
                error: 'You already have an active subscription. Please manage your existing subscription from the dashboard.',
                hasActiveSubscription: true,
                subscriptionId: activeSubscription.id,
              },
              { status: 400 }
            );
          } else {
            console.log('⚠️ Database shows active but Stripe shows none - database may be out of sync');
            // Database says active but Stripe doesn't - allow checkout but log warning
          }
        } catch (stripeError: any) {
          console.error('❌ Error checking Stripe subscriptions:', stripeError);
          // If we can't check Stripe, trust the database
          return NextResponse.json(
            { 
              error: 'You already have an active subscription. Please manage your existing subscription from the dashboard.',
              hasActiveSubscription: true,
            },
            { status: 400 }
          );
        }
      } else {
        // Database says active but no Stripe customer ID - this shouldn't happen, but allow checkout
        console.warn('⚠️ Database shows active subscription but no Stripe customer ID - allowing checkout');
      }
    }

    // Get origin for success/cancel URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Verify the price exists and is a recurring price
    let price;
    try {
      price = await stripe.prices.retrieve(priceId);
      
      // Check if price is recurring
      if (price.type !== 'recurring') {
        return NextResponse.json(
          { error: `Price ${priceId} is not a recurring subscription price. Please use a recurring price for subscriptions.` },
          { status: 400 }
        );
      }
    } catch (error: any) {
      console.error('Error retrieving price:', error);
      return NextResponse.json(
        { error: `Invalid price ID: ${priceId}. ${error.message || 'Price not found'}` },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    console.log('📝 Creating Stripe checkout session with metadata:', {
      userId: userId,
      email: email,
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        userId: userId,
        email: email,
      },
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
    });

    console.log('✅ Checkout session created:', session.id);
    console.log('🔗 Checkout URL:', session.url);
    console.log('📋 Session metadata:', JSON.stringify(session.metadata, null, 2));

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create checkout session',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
