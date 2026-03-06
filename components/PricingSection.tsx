'use client';

import { useState } from 'react';
import type { User } from '@supabase/supabase-js';

interface PricingSectionProps {
  user: User | null;
  onCheckout: (priceId: string) => Promise<void>;
  checkoutLoading: string | null;
  onLoginRequired?: () => void;
}

export default function PricingSection({ user, onCheckout, checkoutLoading, onLoginRequired }: PricingSectionProps) {
  // Get Stripe Price IDs from environment variables
  const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || '';
  const YEARLY_1DOLLAR_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || '';
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 PricingSection - Environment Variables Check:', {
      MONTHLY_PRICE_ID: MONTHLY_PRICE_ID ? `${MONTHLY_PRICE_ID.substring(0, 10)}...` : 'NOT SET',
      YEARLY_1DOLLAR_PRICE_ID: YEARLY_1DOLLAR_PRICE_ID ? `${YEARLY_1DOLLAR_PRICE_ID.substring(0, 10)}...` : 'NOT SET',
    });
  }
  
  // Validate that price IDs are set
  if (!MONTHLY_PRICE_ID) {
    console.error('❌ NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID is not set in environment variables');
    console.error('💡 Make sure to add NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID to your .env.local file and restart the dev server');
  }
  if (!YEARLY_1DOLLAR_PRICE_ID) {
    console.error('❌ NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID is not set in environment variables');
    console.error('💡 Make sure to add NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID to your .env.local file and restart the dev server');
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
      <div className="text-center mb-10 sm:mb-12 lg:mb-16">
        <div className="inline-block bg-yellow-400/20 border border-yellow-400/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4">
          <span className="text-yellow-400 text-xs sm:text-sm font-semibold">✨ Choose Your Plan</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-2 sm:px-0">
          Pricing
        </h2>
        <p className="text-purple-200 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-4 sm:px-0">
          Subscribe to the "Unstuck" Newsletter and get weekly insights from Dr. Mark Johnson
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="bg-linear-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 border-2 border-purple-500/30 shadow-2xl mb-8">
          {/* Product Description */}
          <div className="text-center mb-8">
            <p className="text-purple-100 text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto mb-6">
              Weekly digital topics and tech information for entrepreneurs and especially seniors age 55+ from <span className="text-yellow-400 font-semibold">Dr. Mark Johnson</span> and his <span className="text-yellow-400 font-semibold">30+ years experience</span> online and earning extra income as a senior, PhD, Author.
            </p>
            <p className="text-purple-200 text-base sm:text-lg italic">
              Pro tips and easy solutions and frameworks for success online - get "Unstuck" weekly!
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 text-purple-200">
              <svg className="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>4 weekly editions per month</span>
            </div>
            <div className="flex items-center gap-3 text-purple-200">
              <svg className="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Expert insights from Dr. Mark Johnson</span>
            </div>
            <div className="flex items-center gap-3 text-purple-200">
              <svg className="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Feature stories and testimonials</span>
            </div>
            <div className="flex items-center gap-3 text-purple-200">
              <svg className="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>30+ years of proven experience</span>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Plan - $1 */}
          <div className="bg-linear-to-br from-green-600/20 via-green-700/10 to-green-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-green-500/40 shadow-2xl">
            <div className="text-center">
              <div className="inline-block bg-green-500/20 border border-green-400/50 rounded-full px-3 py-1 mb-4">
                <span className="text-green-300 text-xs font-semibold">📅 MONTHLY</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-green-300 mb-2">
                Monthly Plan
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                $1<span className="text-lg">/month</span>
              </p>
              <p className="text-purple-300 text-sm mb-4">Recurring monthly subscription</p>
              <p className="text-purple-200 text-sm mb-6">
                Cancel anytime • Full access
              </p>
              <button
                onClick={() => {
                  if (!user) {
                    if (onLoginRequired) {
                      onLoginRequired();
                    }
                    return;
                  }
                  if (MONTHLY_PRICE_ID) {
                    onCheckout(MONTHLY_PRICE_ID);
                  } else {
                    alert('Price ID not configured.\n\nPlease add NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID to your .env.local file and restart the dev server.');
                    console.error('Missing NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID');
                  }
                }}
                disabled={checkoutLoading !== null || (user !== null && !MONTHLY_PRICE_ID)}
                className="w-full bg-linear-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {!user 
                  ? 'Login to Subscribe' 
                  : !MONTHLY_PRICE_ID 
                  ? 'Price ID Not Configured' 
                  : checkoutLoading === MONTHLY_PRICE_ID 
                  ? 'Processing...' 
                  : 'Subscribe Monthly'}
              </button>
            </div>
          </div>

          {/* Yearly Plan - $1 */}
          <div className="bg-linear-to-br from-yellow-400/20 via-yellow-500/10 to-yellow-400/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-yellow-400/40 shadow-2xl">
            <div className="text-center">
              <div className="inline-block bg-yellow-400/20 border border-yellow-400/50 rounded-full px-3 py-1 mb-4">
                <span className="text-yellow-300 text-xs font-semibold">📅 YEARLY</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">
                Yearly Plan
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                $1<span className="text-lg"> dollar</span>
              </p>
              <p className="text-purple-300 text-sm mb-4">Full year access</p>
              <p className="text-purple-200 text-sm mb-6">
                One-time payment • 12 months access
              </p>
              <button
                onClick={() => {
                  if (!user) {
                    if (onLoginRequired) {
                      onLoginRequired();
                    }
                    return;
                  }
                  if (YEARLY_1DOLLAR_PRICE_ID) {
                    onCheckout(YEARLY_1DOLLAR_PRICE_ID);
                  } else {
                    alert('Price ID not configured.\n\nPlease add NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID to your .env.local file and restart the dev server.');
                    console.error('Missing NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID');
                  }
                }}
                disabled={checkoutLoading !== null || (user !== null && !YEARLY_1DOLLAR_PRICE_ID)}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {!user 
                  ? 'Login to Subscribe' 
                  : !YEARLY_1DOLLAR_PRICE_ID 
                  ? 'Price ID Not Configured' 
                  : checkoutLoading === YEARLY_1DOLLAR_PRICE_ID 
                  ? 'Processing...' 
                  : 'Subscribe Yearly'}
              </button>
            </div>
          </div>

          {/* Monthly Plan - $9/month */}
          {/* <div className="bg-linear-to-br from-purple-600/20 via-purple-700/10 to-purple-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-purple-500/40 shadow-2xl">
            <div className="text-center">
              <div className="inline-block bg-purple-500/20 border border-purple-400/50 rounded-full px-3 py-1 mb-4">
                <span className="text-purple-300 text-xs font-semibold">📅 MONTHLY</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-2">
                Monthly Plan
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                $9<span className="text-lg">/month</span>
              </p>
              <p className="text-purple-300 text-sm mb-4">$108 total (12 months)</p>
              <p className="text-purple-200 text-sm mb-6">
                Recurring monthly • Cancel anytime
              </p>
              <button
                onClick={() => {
                  if (!user) {
                    if (onLoginRequired) {
                      onLoginRequired();
                    }
                    return;
                  }
                  if (MONTHLY_PRICE_ID) {
                    onCheckout(MONTHLY_PRICE_ID);
                  } else {
                    alert('Price ID not configured. Please contact support.');
                  }
                }}
                disabled={checkoutLoading !== null || !MONTHLY_PRICE_ID || !user}
                className="w-full bg-linear-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {!user 
                  ? 'Login to Subscribe' 
                  : !MONTHLY_PRICE_ID 
                  ? 'Price ID Not Configured' 
                  : checkoutLoading === MONTHLY_PRICE_ID 
                  ? 'Processing...' 
                  : 'Subscribe $9/month'}
              </button>
            </div>
          </div> */}

          {/* Yearly Plan - $90 */}
          {/* <div className="bg-linear-to-br from-yellow-400/20 via-yellow-500/10 to-yellow-400/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-yellow-400/40 shadow-2xl md:col-span-2">
            <div className="text-center">
              <div className="inline-block bg-green-500/20 border border-green-400/50 rounded-full px-3 py-1 mb-4">
                <span className="text-green-400 text-xs font-semibold">💰 BEST VALUE - Save 15%</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">
                Pay Today
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                $90
              </p>
              <p className="text-purple-300 text-sm mb-4">Get 2 months FREE</p>
              <p className="text-purple-200 text-sm mb-6">
                One-time payment • 12 months access
              </p>
              <button
                onClick={() => {
                  if (!user) {
                    if (onLoginRequired) {
                      onLoginRequired();
                    }
                    return;
                  }
                  if (YEARLY_PRICE_ID) {
                    onCheckout(YEARLY_PRICE_ID);
                  } else {
                    alert('Yearly plan not available. Please contact support.');
                  }
                }}
                disabled={checkoutLoading !== null || !YEARLY_PRICE_ID || !user}
                className="w-full bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {!user 
                  ? 'Login to Subscribe' 
                  : !YEARLY_PRICE_ID 
                  ? 'Yearly Plan Not Available' 
                  : checkoutLoading === YEARLY_PRICE_ID 
                  ? 'Processing...' 
                  : 'Pay $90 Today'}
              </button>
            </div>
          </div> */}
        </div>

        <p className="text-xs text-purple-300/70 text-center mt-6 px-2">
          🔒 Secure payment powered by Stripe • Test with $1 first, then update to final prices
        </p>
      </div>
    </section>
  );
}
