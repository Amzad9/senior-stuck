'use client';

import { useState } from 'react';
import PricingSection from '@/components/PricingSection';

export default function PricingPage() {
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    setCheckoutLoading(priceId);

    try {
      const checkoutData = {
        priceId: priceId,
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
        setCheckoutLoading(null);
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Failed to create checkout session');
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="w-full border-b border-black/20 mb-4">
        <div className="container mx-auto px-4 py-4">
          <nav className="w-full">
            <ul className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
              <li>
                <a
                  href="/"
                  className="text-black font-bold hover:text-yellow-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/enough-is-enough"
                  className="text-black font-bold hover:text-yellow-400 transition-colors"
                >
                  Enough is Enough
                </a>
              </li>
              <li>
                <a
                  href="/implementation-masters-program"
                  className="text-black font-bold hover:text-yellow-400 transition-colors"
                >
                  Implementation Masters Program
                </a>
              </li>
              <li>
                <a
                  href="/freelancer-detector-kit"
                  className="text-black font-bold hover:text-yellow-400 transition-colors"
                >
                  Freelancer Detector Kit
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <PricingSection 
        onCheckout={handleCheckout}
        checkoutLoading={checkoutLoading}
      />
    </div>
  );
}
