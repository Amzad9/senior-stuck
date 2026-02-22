'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwsrt_lrJWI1_HhpwIXmROO9c8eHQpeRlbkK6x1rfyEkb2A60Ztthl3KTmDXY_Lj5Gr/exec";

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

  // Auto-hide success message after 2 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

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
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* JPG Image - Top Left Corner */}
    

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-400/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <header className="container mx-auto pt-4 pb-6 relative z-10">
        <div className="flex flex-col items-center gap-4">
          {/* Logo - Centered */}
          <div className="text-center w-full">
          
          </div>
          <div className="text-center w-full">
            <Image
              src="/logo2.png"
              alt="SENIORS STUCK"
              width={300}
              height={120}
              className="mx-auto drop-shadow-lg"
              priority
            />
          </div>
          
          {/* Statement, Welcome, and Author - Below Logo */}
          <div className="flex flex-col items-center text-center gap-2">
            {/* Main Statement - Bright Red, Bold */}
            <p className="text-red-600 font-bold text-sm sm:text-base lg:text-3xl max-w-4xl">
              For the millions who are 'Stuck' as you seek online income and home business work online - We have your solutions here at Seniors Stuck.com
            </p>
            
            {/* Welcome Line */}
            <p className="text-white text-base sm:text-lg lg:text-xl font-semibold">
              Welcome Home
            </p>
            
            {/* Author/Owner Name */}
            <p className="text-white text-sm sm:text-base lg:text-lg">
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
      <div className="inline-block bg-yellow-400/20 border border-yellow-400/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4">
        <span className="text-yellow-400 text-xs sm:text-sm font-semibold">✨ Trusted by 55+ Entrepreneurs</span>
      </div>
      <h1 className="text-3xl sm:text-4xl max-w-3xl mx-auto lg:mx-0 font-bold text-white mb-6 leading-tight">
              <span className="mb-2">Seniors "Stuck", Tech Overwhelm Online? <span className="text-yellow-400">Not Anymore.</span></span>
              <span className="mb-2 text-yellow-400">Your Online Business Starts Here.</span>
              <span className="mb-2">Learn from a <span className="text-orange-400">55+ Entrepreneur, PhD, Author</span></span>
              <span className="text-yellow-400">Get "Unstuck"!</span>
            </h1>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500 mb-8">
              No More Gurus. No More Courses. <span className="text-white">STOP!</span>
            </p>
     
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="col-span-8 lg:col-span-6">
          <p className="text-lg sm:text-xl lg:text-2xl text-purple-200 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0">
            Weekly guidance from <span className="text-yellow-400 font-semibold">Dr. Mark Johnson</span> to build <span className="text-orange-400 font-bold">online income</span>.
          </p>
          
          {/* Mark Johnson Info Card - Enhanced */}
          <div className="bg-linear-to-br from-yellow-400 to-yellow-500 text-black p-4 sm:p-6 rounded-xl shadow-2xl max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8 border-2 border-yellow-300 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-start gap-3">
              <div className="bg-black/10 rounded-full p-2 shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-lg sm:text-xl mb-1">Dr. Mark Johnson</p>
                <p className="text-xs sm:text-sm font-medium opacity-90">Age 66, PhD, Author</p>
                <p className="text-xs sm:text-sm font-medium opacity-90">30 Years Experience</p>
                <p className="text-xs sm:text-sm font-medium opacity-90 mt-1">Online Teaching & Mentoring</p>
              </div>
            </div>
          </div>

          {/* Trust indicators - Enhanced with Colors */}
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
            <div className="flex items-center gap-2 ">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-bold text-xs sm:text-sm">30+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2 ">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-bold text-xs sm:text-sm">Proven Strategies</span>
            </div>
            <div className="flex items-center gap-2 ">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-bold text-xs sm:text-sm">DFY Online Business</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-bold text-xs sm:text-sm">60something Type 2 Diabetes brand</span>
            </div>

          </div>
          {/* CTA Button */}
          <div className="mt-6">
            <button
              onClick={openFormModal}
              className="bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-black font-bold py-3 px-6 sm:px-8 rounded-lg text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started Now
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
      <div className="bg-linear-to-br w-full from-purple-900/90 via-purple-800/80 to-black/90 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl mx-auto lg:mx-0 border-2 border-purple-500/40 relative h-full overflow-hidden backdrop-blur-sm flex flex-col items-center justify-center">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/20 rounded-full -ml-12 -mb-12"></div>
        <div className="relative z-10 text-center">
        <div className="text-center w-full">
        <Image
              src="/image (20).png"
              alt="SENIORS STUCK"
              width={470}
              height={120}
              className="mx-auto drop-shadow-lg"
              priority
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-6 text-white mb-4">
            Get Your FREE Guide
          </h2>
          <p className="text-purple-200 text-base sm:text-lg mb-6">
            Start building your online income today
          </p>
          <button
            onClick={openFormModal}
            className="bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl w-full"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="container mx-auto px-4 relative z-10" id="video-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
           
            <h2 className="text-2xl mt-4 sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 px-2 sm:px-0">
              Watch & Learn from Dr. Mark
            </h2>
            <p className="text-purple-200 text-base sm:text-lg px-2 sm:px-0">See proven strategies in action</p>
          </div>
          <div className='text-center'>
          <button
              onClick={openVideoModal}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-6"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Watch Now
            </button>
            </div>
          {/* <div className="aspect-video bg-black/30 rounded-lg sm:rounded-xl overflow-hidden shadow-2xl border-2 border-purple-500/30 relative">
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none"></div>
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
                  allow="autoplay"
                  title="Dr. Mark Johnson 3-Minute Video"
                />
              )
            )}
          </div> */}
        </div>
      </section>

      {/* Features Section - Why Choose Us */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-block bg-yellow-400/20 border border-yellow-400/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4">
            <span className="text-yellow-400 text-xs sm:text-sm font-semibold">✨ Why We're Different</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-2 sm:px-0">
            Why Choose Us?
          </h2>
          <p className="text-purple-200 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-4 sm:px-0">
            What makes our approach different and why 55+ entrepreneurs trust us
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-linear-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-purple-500/30 hover:border-yellow-400/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400/10 rounded-full -mr-8 -mt-8 sm:-mr-10 sm:-mt-10 group-hover:bg-yellow-400/20 transition-colors"></div>
            <div className="relative z-10">
              <div className="bg-linear-to-br from-yellow-400/30 to-yellow-500/20 rounded-xl sm:rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4 group-hover:text-yellow-300 transition-colors">
                Real-World Examples
              </h3>
              <p className="text-purple-100 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                See real examples from working online businesses—no theory, just what works.
              </p>
              <div className="flex items-center gap-2 text-purple-300 text-xs sm:text-sm">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Proven strategies</span>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-linear-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-purple-500/30 hover:border-yellow-400/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400/10 rounded-full -mr-8 -mt-8 sm:-mr-10 sm:-mt-10 group-hover:bg-yellow-400/20 transition-colors"></div>
            <div className="relative z-10">
              <div className="bg-linear-to-br from-yellow-400/30 to-yellow-500/20 rounded-xl sm:rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4 group-hover:text-yellow-300 transition-colors">
                Step-by-Step Guidance
              </h3>
              <p className="text-purple-100 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Follow simple, step-by-step guidance tailored for 55+ to get unstuck fast.
              </p>
              <div className="flex items-center gap-2 text-purple-300 text-xs sm:text-sm">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Easy to follow</span>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-linear-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-purple-500/30 hover:border-yellow-400/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group relative overflow-hidden sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400/10 rounded-full -mr-8 -mt-8 sm:-mr-10 sm:-mt-10 group-hover:bg-yellow-400/20 transition-colors"></div>
            <div className="relative z-10">
              <div className="bg-linear-to-br from-yellow-400/30 to-yellow-500/20 rounded-xl sm:rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4 group-hover:text-yellow-300 transition-colors">
                30 Years Experience
              </h3>
              <p className="text-purple-100 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                Learn from someone who's been online since AOL dialup days—real expertise you can trust.
              </p>
              <div className="flex items-center gap-2 text-purple-300 text-xs sm:text-sm">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Proven track record</span>
              </div>
            </div>
          </div>

       
        </div>

      </section>

      {/* About Us Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8 relative z-10">
  <div className="container mx-auto">
    <div className="text-center mb-8 sm:mb-10 lg:mb-12">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 px-2 sm:px-0">
        About Us
      </h2>
      <p className="text-purple-200 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-4 sm:px-0">
        Your trusted partner in building online income
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-stretch">
      {/* Left Side - Photo */}
      <div className="lg:col-span-5 h-full">
        <div className="relative h-full">
          <div className="absolute -inset-2 sm:-inset-4 bg-linear-to-br from-yellow-400/20 to-purple-600/20 rounded-xl sm:rounded-2xl blur-xl opacity-50"></div>
          <div className="relative bg-linear-to-br from-purple-900/50 to-black/50 rounded-xl sm:rounded-2xl p-4 sm:p-0 border-2 border-purple-500/30 backdrop-blur-sm h-full flex flex-col">
            <div className="relative grow">
              <Image
                src="/photo2.png"
                alt="Dr. Mark Johnson"
                width={500}
                height={650}
                className="w-full h-full object-cover rounded-lg sm:rounded-xl shadow-2xl"
                priority
              />
            </div>
            <div className="p-4 sm:p-6 text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-1 sm:mb-2">Dr. Mark Johnson</h3>
              <p className="text-purple-200 text-md mb-1">Age 66, PhD, Author</p>
              <p className="text-purple-300 text-md">30 Years Experience Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="lg:col-span-7 h-full">
        <div className="bg-linear-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 border-2 border-purple-500/30 shadow-2xl h-full flex flex-col">
          {/* Main intro */}
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <p className="text-purple-100 text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 leading-relaxed">
              We help <span className="text-yellow-400 font-semibold">55+ entrepreneurs</span> build real online income with clear, step-by-step guidance. 
              Led by <span className="text-yellow-400 font-semibold">Dr. Mark Johnson</span>, we replace tech overwhelm with proven strategies and support.
            </p>
          </div>

          {/* Dr. Mark Johnson Highlight */}
          <div className="bg-linear-to-r from-yellow-400/20 to-yellow-500/10 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-8 sm:mb-12 border border-yellow-400/30">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="bg-yellow-400/30 rounded-full p-2 sm:p-3 shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-2">30 Years Experience</h3>
                <p className="text-purple-100 text-base sm:text-lg mb-2 sm:mb-3">
                  Online since "AOL dialup" years! Mark has been building online businesses since the early days of the internet.
                </p>
                <p className="text-purple-200 text-xs sm:text-sm">
                  PhD, Author, Online Teaching & Mentoring Expert
                </p>
              </div>
            </div>
          </div>

          {/* Expertise Section */}
          <div className="bg-linear-to-r from-purple-600/20 to-purple-800/20 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-500/30 mb-6 sm:mb-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="bg-purple-600/30 rounded-lg p-2 sm:p-3 shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2">Expertise & Experience</h4>
                <p className="text-purple-100 text-base sm:text-lg leading-relaxed">
                  Working with <span className="font-semibold">Fiverr and Upwork admins</span>, VAs, and <span className="font-semibold">40 years as a publisher and editor</span>. 
                  Mark brings decades of real-world experience to help you succeed.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-auto">
            <a
              href="http://www.60somethingthebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-linear-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Visit our website
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
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
          <div className="bg-linear-to-br from-purple-900/95 via-purple-800/95 to-black/95 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl border-2 border-purple-500/40 relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                <p className="text-purple-200 text-sm sm:text-base">Start building your online income today</p>
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
                className="w-full bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-black font-bold py-4 px-6 rounded-lg text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
              className="absolute -top-12 right-0 text-white hover:text-yellow-400 transition-colors text-xl font-bold flex items-center gap-2"
              aria-label="Close video"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-purple-500/50">
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

      {/* Footer */}
      <footer className="bg-linear-to-r from-purple-900 to-black border-t border-purple-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 sm:gap-8 text-center sm:text-left">
         
            <div className="col-span-12 md:col-span-5">
              <h3 className="text-yellow-400 font-bold text-lg sm:text-xl mb-3 sm:mb-4">About Us</h3>
              <p className="text-purple-200 text-base sm:text-lg">
                Seniors "Stuck", Tech Overwhelm Online? Not Anymore. Your Online Business Plans Starts Here. Learn from a 55+ Entreprenuer, PhD, Author, - Get "Unstuck"! No More "Gurus", No More Buying Courses and Upsells and Buying Trainings-STOP!
              </p>
            </div>
            <div className="col-span-12 md:col-span-5">
              <h3 className="text-yellow-400 font-bold text-lg sm:text-xl mb-3 sm:mb-4">Contact</h3>
              <p className="text-purple-200 text-sm sm:text-base wrap-break-word">
                <a href="mailto:mjohnsonsports@aol.com" className="hover:text-yellow-400 transition-colors">
                  mjohnsonsports@aol.com
                </a>
              </p>
              <h3 className="text-yellow-400 font-bold text-lg sm:text-xl mb-3 sm:my-4">Follow Us</h3>
              <div className="flex justify-center sm:justify-start gap-3 sm:gap-4">
                <a href="https://studio.youtube.com/channel/UCJd96cguIaXaDIviWywYTfA" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors" aria-label="YouTube">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61587465736036" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors" aria-label="Facebook">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/seniorsstuck/?hl=en" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors" aria-label="Instagram">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.pinterest.com/SeniorsStuck" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors" aria-label="Pinterest">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.174.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@serniorsstuck" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors" aria-label="TikTok">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                {/* <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors" aria-label="X (Twitter)">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a> */}
              </div>
            </div>
            <div className="col-span-12 md:col-span-2">
     <div className="text-center md:text-right">
            <Image
              src="/logo2.png"
              alt="SENIORS STUCK"
              width={200}
              height={70}
              className="mx-auto lg:mx-0 drop-shadow-lg"
              priority
            />
            </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-purple-800/50 text-center">
            <p className="text-purple-300 text-xs sm:text-sm">
              © {new Date().getFullYear()} SeniorsStuck.com. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
