'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [checking, setChecking] = useState(false);

  // Check subscription status manually
  const checkSubscriptionStatus = async (retryCount = 0) => {
    if (!sessionId) {
      console.warn('⚠️ No session ID, redirecting to dashboard');
      router.push('/dashboard');
      return;
    }
    
    setChecking(true);
    try {
      console.log(`🔍 Checking subscription status (attempt ${retryCount + 1})...`);
      console.log('Session ID:', sessionId);
      
      // Give webhook a moment to process, then check status
      // The check-session route will also store data if webhook hasn't run yet
      console.log('🔍 Calling check-session API to verify and store subscription data...');
      const response = await fetch(`/api/check-session?session_id=${sessionId}`);
      
      console.log('📡 Check-session response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Check-session response data:', data);
        
        if (data.active) {
          // Subscription is active, redirect to dashboard
          console.log('✅ Subscription active, redirecting to dashboard');
          router.push('/dashboard');
        } else {
          // Wait a bit more and try again (max 5 retries)
          if (retryCount < 5) {
            console.log(`⏳ Subscription not active yet, retrying in 2 seconds... (${retryCount + 1}/5)`);
            setTimeout(() => {
              checkSubscriptionStatus(retryCount + 1);
            }, 2000);
          } else {
            console.warn('⚠️ Subscription not active after 5 retries, redirecting anyway');
            router.push('/dashboard');
          }
        }
      } else {
        // Handle error response
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Check-session API error:', response.status, errorData);
        
        // If it's a 500 error, still redirect after a delay (webhook might process it)
        if (response.status === 500 && retryCount < 3) {
          console.log(`⏳ Server error, retrying in 3 seconds... (${retryCount + 1}/3)`);
          setTimeout(() => {
            checkSubscriptionStatus(retryCount + 1);
          }, 3000);
        } else {
          // After retries, redirect anyway - user can refresh status on dashboard
          console.warn('⚠️ Redirecting to dashboard despite error');
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('❌ Error checking subscription:', error);
      // On network error, redirect after a delay
      if (retryCount < 3) {
        console.log(`⏳ Network error, retrying in 3 seconds... (${retryCount + 1}/3)`);
        setTimeout(() => {
          checkSubscriptionStatus(retryCount + 1);
        }, 3000);
      } else {
        console.warn('⚠️ Max retries reached, redirecting to dashboard');
        router.push('/dashboard');
      }
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      // Check subscription status after a short delay
      const timer = setTimeout(() => {
        checkSubscriptionStatus();
      }, 2000);

      // Fallback: redirect after 10 seconds regardless
      const fallbackTimer = setTimeout(() => {
        router.push('/dashboard');
      }, 10000);

      return () => {
        clearTimeout(timer);
        clearTimeout(fallbackTimer);
      };
    } else {
      // No session ID, redirect immediately
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sessionId, router]);

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
            Your subscription is being activated. This may take a few moments.
          </p>
          {sessionId && (
            <p className="text-white/70 text-sm">
              Session ID: {sessionId.substring(0, 20)}...
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          <p className="text-white text-xl">
            Redirecting to your dashboard...
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6 px-12 rounded-lg text-2xl transition-colors shadow-lg"
          >
            Go to Dashboard Now
          </Link>
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
