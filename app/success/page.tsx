'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-black border-2 border-white/20 rounded-2xl p-8 sm:p-12 shadow-2xl max-w-2xl w-full text-center">
        <div className="mb-6">
          <svg className="w-20 h-20 text-green-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-white text-2xl mb-2">
            Thank you for your subscription.
          </p>
          <p className="text-white text-xl mb-4">
            Your subscription is confirmed.
          </p>
          {sessionId && (
            <p className="text-white/70 text-sm">
              Session ID: {sessionId.substring(0, 20)}...
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          <p className="text-white text-xl">
            No login required. You will receive the newsletter by email.
          </p>
          <div>
            <Link href="/" className="text-yellow-400 hover:text-yellow-300 font-bold text-lg">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-black border-2 border-white/20 rounded-2xl p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
