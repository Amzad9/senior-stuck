'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import PricingSection from '@/components/PricingSection';

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxr46ZnQ667qO5lrbGfZMh11xlpR7NUjIyMbmRxOORAQYaGsvzXP16yMGGi5UO35G65/exec ";

interface FormData {
  name: string;
  email: string;
  message: string;
  date: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  submit?: string;
}

export default function Home() {
  const leadMagnetUrl = '/_Lead%20magner%20pdf%20.pdf';
  const videoUrl: string = '/Cracking%20the%20Code%20for%20Online%20Income_%20A%20Guide%20for%20Seniors.mp4';
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    date: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [showMessageModal, setShowMessageModal] = useState<boolean>(false);
  const [messageModalContent, setMessageModalContent] = useState<{ title: string; message: string } | null>(null);
  const router = useRouter();

  // Auto-hide success message after 2 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // Supabase Auth state listener
  useEffect(() => {
    const supabase = createClient();
    
    if (!supabase) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Supabase is not available. Please configure Supabase in .env.local');
      }
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        fetchUserDocument(session.user.id);
        fetchSubscriptions(session.user.id);
      } else {
        setUserDoc(null);
        setSubscriptions([]);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      setUser(session?.user || null);
      
      if (session?.user) {
        fetchUserDocument(session.user.id);
        fetchSubscriptions(session.user.id);
      } else {
        setUserDoc(null);
        setSubscriptions([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserDocument = async (uid: string) => {
    try {
      const response = await fetch(`/api/user?uid=${uid}`);
      if (response.ok) {
        const data = await response.json();
        setUserDoc(data);
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
    }
  };

  const fetchSubscriptions = async (uid: string) => {
    // Since we're only using users table, create subscription object from userDoc
    if (userDoc && userDoc.subscriptionStatus === 'active') {
      setSubscriptions([{
        id: userDoc.uid,
        plan: userDoc.plan || 'monthly',
        subscription_status: userDoc.subscriptionStatus,
      }]);
    } else {
      setSubscriptions([]);
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const openFormModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFormModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError('');
    setAuthEmail('');
    setAuthPassword('');
    document.body.style.overflow = 'unset';
  };

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    
    const supabase = createClient();
    
    if (!supabase) {
      setAuthError('Supabase is not configured. Please check your .env.local file and restart the dev server.');
      return;
    }

    if (!authEmail || !authPassword) {
      setAuthError('Please enter both email and password');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });

        if (error) throw error;

        closeAuthModal();
        router.push('/dashboard');
      } else {
        // Sign up mode
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });

        if (error) throw error;

        // After successful signup, switch to login mode without closing modal or refreshing
        setAuthMode('login');
        setAuthPassword(''); // Clear password but keep email
        // Show success message prompting user to login
        setAuthError('Account created successfully! Please login with your email and password.');
        // Note: If email confirmation is required, user will need to check email first
        // The auth state listener will handle login automatically if email confirmation is disabled
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));
      
      // Provide user-friendly error messages based on Supabase error codes
      let errorMessage = 'Authentication failed';
      
      // Check for specific Supabase error codes first
      if (error.code === 'over_email_send_rate_limit' || error.message?.includes('email rate limit') || error.message?.includes('rate limit exceeded')) {
        errorMessage = 'Too many sign-up attempts. Please wait 10-15 minutes before trying again, or try using Google sign-in instead.';
      } else if (error.code === 'signup_disabled') {
        errorMessage = 'Sign up is currently disabled. Please contact support.';
      } else if (error.code === 'email_not_confirmed') {
        errorMessage = 'Please check your email to confirm your account before logging in.';
      } else if (error.code === 'user_already_registered' || error.message?.includes('already registered') || error.message?.includes('already exists') || error.message?.includes('User already registered')) {
        errorMessage = 'This email is already registered. Please use the "Login" option instead.';
      } else if (error.code === 'invalid_credentials' || error.message?.includes('Invalid login credentials') || error.message?.includes('Invalid password')) {
        if (authMode === 'login') {
          errorMessage = 'Incorrect email or password. Please verify your credentials.';
        } else {
          errorMessage = 'Invalid credentials. Please check your email and password.';
        }
      } else if (error.code === 'weak_password' || error.message?.includes('Password') && error.message?.includes('weak')) {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (error.code === 'invalid_email' || (error.message?.includes('email') && error.message?.includes('invalid'))) {
        errorMessage = `Invalid email address format. Please check and try again. (Error: ${error.message})`;
      } else if (error.message) {
        // Show the actual error message for debugging
        errorMessage = error.message;
      }
      
      setAuthError(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    
    if (!supabase) {
      setAuthError('Supabase is not configured. Please check your .env.local file and restart the dev server.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) throw error;

      // OAuth redirects, so we don't need to close modal or navigate here
      // The redirect will happen automatically
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      let errorMessage = 'Google sign-in failed';
      
      if (error.message?.includes('popup')) {
        errorMessage = 'Sign-in popup was closed or blocked. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setAuthError(errorMessage);
      setAuthLoading(false);
    }
  };

  const handleCheckout = async (priceId: string) => {
    if (!user) {
      alert('Please log in to subscribe');
      openAuthModal();
      return;
    }

    console.log('🛒 Starting checkout process');
    console.log('👤 User ID:', user.id);
    console.log('📧 User Email:', user.email || user.user_metadata?.email);
    console.log('💰 Price ID:', priceId);

    setCheckoutLoading(priceId);

    try {
      const checkoutData = {
        userId: user.id,
        email: user.email || user.user_metadata?.email || '',
        priceId: priceId,
      };

      console.log('📤 Sending checkout request:', checkoutData);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Refresh subscriptions before redirecting (in case user comes back)
        if (user) {
          fetchSubscriptions(user.id);
        }
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        // Show modal instead of alert
        setMessageModalContent({
          title: 'Subscription Notice',
          message: data.error || 'Failed to create checkout session',
        });
        setShowMessageModal(true);
        setCheckoutLoading(null);
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      setMessageModalContent({
        title: 'Error',
        message: 'Failed to create checkout session. Please try again.',
      });
      setShowMessageModal(true);
      setCheckoutLoading(null);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
      setShowUserMenu(false);
      setUser(null);
      setUserDoc(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = leadMagnetUrl;
    link.download = '_Lead magner pdf .pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSuccess(false);
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const jsonData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        date: new Date().toISOString(),
      };

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      setFormData({
        name: '',
        email: '',
        message: '',
        date: '',
      });
      setIsSuccess(true);
      setTimeout(() => {
        downloadPDF();
      }, 500);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('CORS')) {
        setFormData({
          name: '',
          email: '',
          message: '',
          date: '',
        });
        setIsSuccess(true);
        setTimeout(() => {
          downloadPDF();
        }, 500);
      } else {
        setErrors({
          submit: `Failed to submit form: ${errorMessage}. Please check your connection and try again.`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      <header className="container mx-auto pt-4 pb-6 relative z-10">
        {/* Auth Buttons - Top Right */}
        <div className="flex justify-end gap-3 mb-4 relative">
          {user ? (
            <div className="relative">
              {/* User Profile Button */}
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">{(user.email || user.user_metadata?.email || '').split('@')[0]}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-black border-2 border-white/20 rounded-xl shadow-2xl p-4 z-50">
                  <div className="mb-4 pb-4 border-b border-white/20">
                    <div className="flex items-center gap-3">
                      {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                        <Image
                          src={user.user_metadata?.avatar_url || user.user_metadata?.picture || ''}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="rounded-full border-2 border-yellow-400/50"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center border-2 border-yellow-400/50">
                          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">
                          {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-white/70 text-xs truncate">{user.email || user.user_metadata?.email || ''}</p>
                        {userDoc && (
                          <div className="mt-1">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                              userDoc.subscriptionStatus === 'active'
                                ? 'bg-green-500/20 text-green-400 border border-green-400/50'
                                : userDoc.subscriptionStatus === 'cancelled'
                                ? 'bg-red-500/20 text-red-400 border border-red-400/50'
                                : 'bg-gray-500/20 text-gray-400 border border-gray-400/50'
                            }`}>
                              {userDoc.subscriptionStatus === 'active' ? '✓ Active' : userDoc.subscriptionStatus || 'Inactive'}
                            </span>
                            {userDoc.plan && userDoc.subscriptionStatus === 'active' && (
                              <span className="ml-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-400/20 text-yellow-400 border border-yellow-400/50 capitalize">
                                {userDoc.plan}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        router.push('/dashboard');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg text-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </button>

                    {/* Show Download PDF for active subscribers */}
                    {userDoc && userDoc.subscriptionStatus === 'active' && (
                      <a
                        href={`/api/download-pdf?uid=${user.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg text-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Newsletter PDF
                      </a>
                    )}

                    {/* Show Manage Billing for active subscribers */}
                    {userDoc && userDoc.subscriptionStatus === 'active' && (
                      <button
                        onClick={async () => {
                          setShowUserMenu(false);
                          try {
                            const response = await fetch('/api/customer-portal', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                userId: user.id,
                              }),
                            });

                            const data = await response.json();

                            if (response.ok && data.url) {
                              window.location.href = data.url;
                            } else {
                              alert(data.error || 'Failed to open billing portal');
                            }
                          } catch (error) {
                            console.error('Error opening billing portal:', error);
                            alert('Failed to open billing portal');
                          }
                        }}
                        className="w-full flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg text-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Manage Billing
                      </button>
                    )}

                    {/* Show Subscribe button for inactive users */}
                    {(!userDoc || userDoc.subscriptionStatus !== 'active') && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          if (window.location.pathname === '/') {
                            // If already on home page, scroll to pricing section
                            const element = document.getElementById('price');
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          } else {
                            // If on another page, navigate to home with hash
                            window.location.href = '/#price';
                          }
                        }}
                        className="w-full flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg text-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {userDoc?.subscriptionStatus === 'cancelled' ? 'Resubscribe' : 'Subscribe Now'}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg text-lg transition-colors"
            >
              Login / Sign Up
            </button>
          )}
        </div>

        {/* Close dropdown when clicking outside */}
        {showUserMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowUserMenu(false)}
          />
        )}

        <div className="flex flex-col items-center gap-4">
          {/* Logo - Centered */}
          <div className="text-center w-full">
          
          </div>
          <div className="text-center w-full">
            <Image
              src="/logo2.png"
              alt="SENIORS STUCK"
              width={400}
              height={80}
              className="mx-auto"
              priority
            />
          </div>
          
          {/* Statement, Welcome, and Author - Below Logo */}
          <div className="flex flex-col items-center text-center gap-2">
            {/* Main Statement */}
            <p className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl max-w-4xl mb-4">
            For the millions who are "Stuck" as you seek online and home business work online - We have your solutions here at SeniorsStuck.com
            </p>
            
            {/* Welcome Line */}
            <p className="text-white text-xl sm:text-2xl lg:text-3xl font-semibold mb-2">
              Welcome Home
            </p>
            
            {/* Author/Owner Name */}
            <p className="text-white text-lg sm:text-xl lg:text-2xl">
              Mark Johnson, PhD, Mentor, CEO
            </p>
          </div>
        </div>
      </header>

      {/* Hero Section - Clean and Professional */}
      <section className=" px-4 sm:px-6 lg:px-8 pb-8 relative z-10">
        <div className="container mx-auto">
       

  <div className="grid grid-cols-1 lg:grid-cols-12 space-y-8 lg:space-y-0 items-stretch">
    <div className="text-center lg:text-left col-12 lg:col-span-8">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl max-w-3xl mx-auto lg:mx-0 font-bold text-white mb-8 leading-tight">
        Get Unstuck. Build Your Online Income.
            </h1>
      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8">
        Learn from a 55+ Entrepreneur, PhD, Author
            </p>
     
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="col-span-12">
          <p className="text-xl sm:text-2xl lg:text-3xl text-white mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0">
            Weekly guidance from <span className="text-yellow-400 font-bold">Dr. Mark Johnson</span> to build <span className="text-yellow-400 font-bold">online income</span>.
          </p>
          
          {/* Mark Johnson Info Card */}
          {/* <div className="bg-yellow-400 text-black p-6 rounded-xl max-w-lg mx-auto lg:mx-0 mb-8">
            <div className="text-center">
              <p className="font-bold text-2xl mb-2">Dr. Mark Johnson</p>
              <p className="text-lg font-medium">Age 66, PhD, Author</p>
              <p className="text-lg font-medium">30 Years Experience</p>
              <p className="text-lg font-medium mt-2">Online Teaching & Mentoring</p>
              </div>
          </div> */}

          {/* CTA Button */}
          <div className="mt-8 flex w-full gap-4">
            <button
              onClick={openFormModal}
              className="bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-black font-bold py-6 px-12 rounded-lg text-2xl sm:text-3xl transition-colors shadow-lg"
            >
              Get Started Now
            </button>
              <button
            onClick={openVideoModal}
            className="bg-red-700 cursor-pointer hover:bg-yellow-500 text-black font-bold text-2xl sm:text-3xl py-6 px-12 rounded-lg transition-colors shadow-lg"
          >
            Watch Now
            </button>
          </div>
        </div>
        {/* <div className='col-12 md:col-span-4'>
            <img src="/logo.png" alt="logo" />
        </div> */}
      </div>
    </div>

    {/* Right Side - CTA Card */}
    <div className="col-12 lg:col-span-4 h-full">
      <div className="bg-black w-full border-2 border-white/20 rounded-2xl p-8 shadow-2xl mx-auto lg:mx-0 h-full flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Get Your FREE Guide
          </h2>
        <p className="text-xl sm:text-2xl text-white mb-8">
            Start building your online income today
          </p>
          <button
            onClick={openFormModal}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6 px-12 rounded-lg text-2xl sm:text-3xl transition-colors shadow-lg w-full"
          >
            Get Started Now
          </button>
      </div>
    </div>
  </div>
        </div>
      </section>


      {/* Video Section */}
  

      {/* Features Section - Why Choose Us */}
      <section className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Why Choose Us?
          </h2>
          <p className="text-2xl sm:text-3xl text-white max-w-2xl mx-auto">
            What makes our approach different
          </p>
        </div>
        
        <div className="">
          <img src="/banner.png" alt="Why Choose Us" className="w-full h-full object-cover" />
              </div>
      </section>


      {/* Pricing Section - Unstuck Newsletter */}
      <div id="price">
        <PricingSection 
          user={user} 
          subscriptions={subscriptions}
          onCheckout={handleCheckout}
          checkoutLoading={checkoutLoading}
          onLoginRequired={openAuthModal}
        />
      </div>

      {/* About Us Section */}
      <section className="px-6 pb-12">
  <div className="container mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
        About Us
      </h2>
      <p className="text-2xl sm:text-3xl text-white max-w-2xl mx-auto">
        Your trusted partner in building online income
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Side - Photo */}
      <div className="lg:col-span-5">
        <div className="bg-black border-2 border-white/20 rounded-xl p-4 h-full flex flex-col">
            <div className="relative grow">
              <Image
                src="/photo2.png"
                alt="Dr. Mark Johnson"
                width={500}
                height={650}
              className="w-full h-full object-cover rounded-lg shadow-2xl"
                priority
              />
            </div>
          <div className="p-4 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-yellow-400 mb-2">Dr. Mark Johnson</h3>
            <p className="text-white text-lg mb-1">Age 66, PhD, Author</p>
            <p className="text-white text-lg">30 Years Experience Online</p>
          </div>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="lg:col-span-7">
        <div className="bg-black border-2 border-white/20 rounded-xl p-8 h-full flex flex-col">
          <p className="text-2xl sm:text-3xl text-white mb-8 leading-relaxed">
            We help <span className="text-yellow-400 font-bold">55+ entrepreneurs</span> build real online income with clear, step-by-step guidance. 
            Led by <span className="text-yellow-400 font-bold">Dr. Mark Johnson</span>, we replace tech overwhelm with proven strategies and support.
          </p>
          
          <div className=" text-white rounded-xl mb-8">
            <h3 className="text-3xl font-bold mb-4">30 Years Experience</h3>
            <p className="text-xl mb-2">
                  Online since "AOL dialup" years! Mark has been building online businesses since the early days of the internet.
                </p>
            <p className="text-lg">
                  PhD, Author, Online Teaching & Mentoring Expert
                </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-auto">
            <a
              href="http://www.60somethingthebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-xl transition-colors"
            >
              Type 2 Diabetes – 60something website
            </a>
            <a
              href="https://www.60somethingteam.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-xl transition-colors"
            >
              Get Legacy 2.0 DFY Website BluePrint
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
      </section>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-black border-2 border-white/20 rounded-2xl p-8 shadow-2xl relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeFormModal}
              className="absolute top-4 right-4 text-white hover:text-yellow-400 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <form
              className="space-y-6"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Get Your FREE Guide
                </h2>
                <p className="text-white text-xl">Start building your online income today</p>
              </div>

              {/* Thank You Message */}
              {isSuccess && (
                <div className="bg-green-500/20 border-2 border-green-400/50 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-12 h-12 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-2xl font-bold text-green-300 mb-2">Thank You!</h3>
                      <p className="text-green-300 text-base">Your information has been saved successfully.</p>
                      <p className="text-green-300 text-base mt-2">Your FREE Guide is downloading now!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="bg-red-500/20 border-2 border-red-400/50 rounded-lg p-4 text-red-300 text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.submit}</span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="modal-name" className="block text-purple-100 font-semibold mb-2 text-sm sm:text-base">
                  Full Name <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  id="modal-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-black/40 border-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-white placeholder:text-purple-300/50 text-sm sm:text-base ${
                    errors.name ? 'border-red-400/50' : 'border-purple-500/50'
                  }`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-1 text-red-400 text-xs sm:text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="modal-email" className="block text-purple-100 font-semibold mb-2 text-sm sm:text-base">
                  Email Address <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="email"
                  id="modal-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-black/40 border-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-white placeholder:text-purple-300/50 text-sm sm:text-base ${
                    errors.email ? 'border-red-400/50' : 'border-purple-500/50'
                  }`}
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-red-400 text-xs sm:text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="modal-message" className="block text-purple-100 font-semibold mb-2 text-sm sm:text-base">
                  Message <span className="text-yellow-400">*</span>
                </label>
                <textarea
                  id="modal-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 bg-black/40 border-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-white placeholder:text-purple-300/50 text-sm sm:text-base resize-none ${
                    errors.message ? 'border-red-400/50' : 'border-purple-500/50'
                  }`}
                  placeholder="What have you been stuck on? What have you been wanting to do online?"
                  disabled={isLoading}
                />
                {errors.message && (
                  <p className="mt-1 text-red-400 text-xs sm:text-sm">{errors.message}</p>
                )}
                <p className="mt-2 text-purple-300/70 text-xs sm:text-sm italic">
                  Mark reads all messages and will be back to you asap
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6 px-8 rounded-lg text-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit & Get FREE Guide'
                )}
              </button>

              <p className="text-xs text-purple-300/70 text-center px-2">
                🔒 We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={closeVideoModal}
        >
          <div 
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoModal}
              className="absolute -top-16 right-0 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-xl py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              aria-label="Close video"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-white/20">
              {videoUrl && videoUrl.length > 0 && (
                /\.(mp4|webm|ogg|mov)$/i.test(videoUrl) ? (
                  <video
                    src={videoUrl}
                    className="w-full h-full"
                    controls
                    autoPlay
                    title="Dr. Mark Johnson 3-Minute Video"
                  />
                ) : (
                  <iframe
                    src={videoUrl}
                    className="w-full h-full"
                    allow="autoplay; fullscreen"
                    title="Dr. Mark Johnson 3-Minute Video"
                  />
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-black border-2 border-white/20 rounded-2xl p-8 shadow-2xl relative max-w-md w-full">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-white hover:text-yellow-400 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </h2>
              <p className="text-white text-xl">
                {authMode === 'login' 
                  ? 'Login to access your account' 
                  : 'Create an account to get started'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authError && (
                <div className={`border-2 rounded-lg p-4 text-sm ${
                  authError.includes('successfully') || authError.includes('created') || authError.includes('Account created')
                    ? 'bg-green-500/20 border-green-400/50 text-green-300'
                    : 'bg-red-500/20 border-red-400/50 text-red-300'
                }`}>
                  {authError}
                </div>
              )}

              <div>
                <label htmlFor="auth-email" className="block text-purple-100 font-semibold mb-2 text-sm sm:text-base">
                  Email Address <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="email"
                  id="auth-email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border-2 border-purple-500/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-white placeholder:text-purple-300/50 text-sm sm:text-base"
                  placeholder="your@email.com"
                  required
                  disabled={authLoading}
                />
              </div>

              <div>
                <label htmlFor="auth-password" className="block text-purple-100 font-semibold mb-2 text-sm sm:text-base">
                  Password <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="password"
                  id="auth-password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border-2 border-purple-500/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-white placeholder:text-purple-300/50 text-sm sm:text-base"
                  placeholder="Enter your password"
                  required
                  disabled={authLoading}
                  minLength={6}
                />
                {authMode === 'signup' && (
                  <p className="mt-1 text-purple-300/70 text-xs">Password must be at least 6 characters</p>
                )}
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6 px-8 rounded-lg text-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                    {authMode === 'login' ? 'Logging in...' : 'Signing up...'}
                  </span>
                ) : (
                  authMode === 'login' ? 'Login' : 'Sign Up'
                )}
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-500/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-purple-900/95 text-purple-300">OR</span>
                </div>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="w-full bg-white hover:bg-gray-100 text-gray-700 font-bold py-4 px-6 rounded-lg text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                {authLoading ? 'Signing in...' : 'Continue with Google'}
              </button>

              <div className="space-y-3">
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode(authMode === 'login' ? 'signup' : 'login');
                      setAuthError('');
                      setAuthEmail('');
                      setAuthPassword('');
                    }}
                    className="text-purple-300 hover:text-yellow-400 text-sm transition-colors"
                  >
                    {authMode === 'login' 
                      ? "Don't have an account? Sign up" 
                      : 'Already have an account? Login'}
                  </button>
              </div>
                
                {authMode === 'login' && (
                  <div className="text-center">
                    <p className="text-purple-300/70 text-xs mb-2">
                      Having trouble logging in?
                    </p>
                    <p className="text-purple-300/70 text-xs">
                      Make sure you're using the same email and password you used to sign up.
                    </p>
            </div>
                )}
            </div>
            </form>
            </div>
          </div>
      )}

      {/* Message Modal */}
      {showMessageModal && messageModalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-black border-2 border-white/20 rounded-2xl p-8 shadow-2xl relative max-w-md w-full">
            <button
              onClick={() => {
                setShowMessageModal(false);
                setMessageModalContent(null);
              }}
              className="absolute top-4 right-4 text-white hover:text-yellow-400 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {messageModalContent.title}
              </h2>
              <p className="text-white text-lg leading-relaxed">
                {messageModalContent.message}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageModalContent(null);
                }}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg text-lg transition-colors"
              >
                OK
              </button>
              {messageModalContent.message.includes('dashboard') && (
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageModalContent(null);
                    router.push('/dashboard');
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
            </div>
          </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/20 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white text-lg">
              © {new Date().getFullYear()} SeniorsStuck.com. All rights reserved.
            </p>
          <p className="text-white text-lg mt-4">
            <a href="mailto:mjohnsonsports@aol.com" className="text-yellow-400 hover:text-yellow-500 transition-colors">
              mjohnsonsports@aol.com
            </a>
            </p>
        </div>
      </footer>
    </div>
  );
}
