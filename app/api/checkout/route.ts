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

    // Verify the price exists and determine plan type
    let price;
    let targetPlan: 'monthly' | 'yearly' | null = null;
    try {
      price = await stripe.prices.retrieve(priceId);
      
      // Check if price is recurring
      if (price.type !== 'recurring') {
        return NextResponse.json(
          { error: `Price ${priceId} is not a recurring subscription price. Please use a recurring price for subscriptions.` },
          { status: 400 }
        );
      }

      // Determine plan type from price interval
      if (price.recurring?.interval === 'month') {
        targetPlan = 'monthly';
      } else if (price.recurring?.interval === 'year') {
        targetPlan = 'yearly';
      }
    } catch (error: any) {
      console.error('Error retrieving price:', error);
      return NextResponse.json(
        { error: `Invalid price ID: ${priceId}. ${error.message || 'Price not found'}` },
        { status: 400 }
      );
    }

    // Check if user already has the SAME plan type active
    console.log('🔍 Checking for existing subscription of the same plan type...');
    const supabase = createServiceClient();
    
    if (targetPlan) {
      // Check subscriptions table for the same plan type
      const { data: existingSubscription, error: subError } = await supabase
        .from('subscriptions')
        .select('id, plan, subscription_status')
        .eq('user_id', userId)
        .eq('plan', targetPlan)
        .eq('subscription_status', 'active')
        .maybeSingle();

      if (subError && subError.code !== 'PGRST116') {
        console.error('❌ Error checking subscriptions table:', subError);
      }

      if (existingSubscription) {
        console.log(`⚠️ User already has an active ${targetPlan} subscription`);
        return NextResponse.json(
          { 
            error: `You already have an active ${targetPlan} subscription. Please manage your existing subscription from the dashboard.`,
            hasActiveSubscription: true,
            planType: targetPlan,
          },
          { status: 400 }
        );
      }
    }

    // Get origin for success/cancel URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';

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
