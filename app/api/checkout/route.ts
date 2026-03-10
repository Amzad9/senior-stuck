import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CheckoutRequest } from '@/lib/types';

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
    const { email, priceId } = body;

    if (process.env.NODE_ENV === 'development') {
      console.log('🛒 Checkout API called');
      console.log('📧 Email:', email);
      console.log('💰 Price ID:', priceId);
    }

    // Validate required fields
    if (!priceId) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Missing required fields:', { priceId: !!priceId });
      }
      return NextResponse.json(
        { error: 'Missing required field: priceId is required' },
        { status: 400 }
      );
    }

    // Email is optional: Stripe Checkout will collect it if not provided.
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error retrieving price:', error);
      }
      return NextResponse.json(
        { error: `Invalid price ID: ${priceId}. ${error.message || 'Price not found'}` },
        { status: 400 }
      );
    }

    // Get origin for success/cancel URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';

	    // Create Stripe checkout session
	    if (process.env.NODE_ENV === 'development') {
	      console.log('📝 Creating Stripe checkout session with metadata:', {
	        email: email,
	      });
	    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      ...(email ? { customer_email: email } : {}),
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#price`,
      metadata: {
        ...(email ? { email } : {}),
        ...(targetPlan ? { plan: targetPlan } : {}),
      },
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Checkout session created:', session.id);
      console.log('🔗 Checkout URL:', session.url);
      console.log('📋 Session metadata:', JSON.stringify(session.metadata, null, 2));
    }

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error: any) {
    // Always log errors, but don't expose stack in production
    console.error('Error creating checkout session:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error);
    }
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create checkout session',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
