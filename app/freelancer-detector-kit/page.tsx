'use client';

import { useState } from 'react';

const FREELANCER_DETECTOR_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_PRODUCT_FREELANCER_DETECTOR_KIT ||
  'MISSING_PRICE_ID';

export default function FreelancerDetectorKitPage() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    if (!FREELANCER_DETECTOR_PRICE_ID) {
      alert('Checkout is not configured yet. Please try again later.');
      return;
    }

    setCheckoutLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: FREELANCER_DETECTOR_PRICE_ID,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
        setCheckoutLoading(false);
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Failed to create checkout session');
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <main>
        {/* Top navigation (temporarily disabled)
        <header className="w-full border-b border-gray-200 mb-4">
          <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col items-center gap-3">
            <a
              href="/"
              className="text-lg font-semibold tracking-wide text-gray-900 hover:text-red-700 transition-colors"
            >
              SeniorsStuck.com
            </a>
            <nav className="w-full">
              <ul className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
                <li>
                  <a
                    href="/"
                    className="text-gray-800 hover:text-red-700 transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/enough-is-enough"
                    className="text-gray-800 hover:text-red-700 transition-colors"
                  >
                    Enough is Enough
                  </a>
                </li>
                <li>
                  <a
                    href="/implementation-masters-program"
                    className="text-gray-800 hover:text-red-700 transition-colors"
                  >
                    Implementation Masters Program
                  </a>
                </li>
                <li>
                  <a
                    href="/freelancer-detector-kit"
                    className="text-gray-900 font-semibold hover:text-red-700 transition-colors"
                  >
                    Freelancer Detector Kit
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        */}

        <div className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            The Freelancer Detector Kit™
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-red-700 mb-4">
            Never Get &quot;Ripped Off&quot; Again
          </h2>
          <p className="text-lg md:text-xl text-center mb-8">
            A simple, battle-tested system to spot fake freelancers, protect your money,
            and only hire people who actually deliver.
          </p>

          <div className="bg-gray-100 border border-gray-300 rounded-xl p-6 md:p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-center">$17 Upsell Offer</h3>
            <ul className="list-disc list-inside space-y-3 text-base md:text-lg">
              <li>
                Quick-reference checklists you can use before you ever send a single
                dollar to a freelancer.
              </li>
              <li>
                Red-flag detector questions that instantly reveal who&apos;s real and
                who&apos;s just talking a good game.
              </li>
              <li>
                Simple email/DM scripts you can copy-paste to qualify freelancers without
                feeling awkward.
              </li>
              <li>
                Works on Upwork, Fiverr, and any other platform where you&apos;re hiring
                help.
              </li>
            </ul>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="inline-block bg-red-700 hover:bg-red-800 text-white font-bold py-4 px-10 rounded-lg text-xl shadow-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checkoutLoading
                ? 'Processing...'
                : 'Add The Freelancer Detector Kit™ - $17'}
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Digital PDF product. You&apos;ll receive instant access after checkout.
          </p>
        </div>
      </main>
    </div>
  );
}

