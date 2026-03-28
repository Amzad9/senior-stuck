'use client';

import PricingSection from '@/components/PricingSection';
import MainNav from '@/components/MainNav';

export default function ProductPage() {
  const handleCheckout = async (_priceId: string) => {
    void _priceId;
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="relative z-50">
        <MainNav />
      </header>

      <main className="py-6 sm:py-10">
        <PricingSection onCheckout={handleCheckout} checkoutLoading={null} />
      </main>
    </div>
  );
}
