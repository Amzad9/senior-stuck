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
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900">
      <PricingSection 
        onCheckout={handleCheckout}
        checkoutLoading={checkoutLoading}
      />
    </div>
  );
}
