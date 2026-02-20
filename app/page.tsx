'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const leadMagnetUrl = '/_Lead%20magner%20pdf%20.pdf';

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-950 via-black to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-800/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-4 lg:py-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
          {/* Logo */}
          {/* <div className="text-center">
        <Image
              src="/logo.png"
              alt="SENIORS GROES.COM"
          width={200}
              height={70} // remove this  
              className="mx-auto lg:mx-0 drop-shadow-lg"
          priority
        />
                </div>
           */}
          {/* Navigation CTA Button */}

        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-3 pb-8 relative z-10">
  <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
    {/* Left Side - Content */}
    <div className="text-left col-12 lg:col-span-8">
      <div className="inline-block bg-yellow-400/20 border border-yellow-400/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4">
        <span className="text-yellow-400 text-xs sm:text-sm font-semibold">✨ Trusted by 55+ Entrepreneurs</span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white w-full md:max-w-3xl mb-4 sm:mb-6 leading-tight px-2 sm:px-0">
        Proven online business strategies for{' '}
        <span className="text-yellow-400 relative">
          55+
          <span className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow-400/50 transform -skew-x-12"></span>
        </span>
      </h1>
     
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="col-span-6">
          <p className="text-lg sm:text-xl lg:text-2xl text-purple-200 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0">
            Weekly guidance from <span className="text-yellow-400 font-semibold">Dr. Mark Johnson</span> to build online income.
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

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start text-purple-200 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>30+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Proven Strategies</span>
            </div>

            <div className="flex items-center gap-2 w-auto md:w-full">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>DFY online business Legacy 2.0</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>60something Type 2 Diabetes brand</span>
            </div>
         
          </div>
          <div className="flex items-center gap-4 mt-4">
            <a
              href={leadMagnetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-black font-bold py-3 px-6 lg:px-4 rounded-lg text-sm lg:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap inline-flex items-center"
            >
              Get FREE Guide
              <svg className="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href={leadMagnetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-linear-to-r from-white via-white to-white hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-black font-bold py-3 px-3 lg:px-4 rounded-lg text-sm lg:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap inline-flex items-center"
            >
              Etsy Store
              <svg className="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href={leadMagnetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-linear-to-r from-black via-black to-black hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-white border-1 border-gray-700 font-bold py-3 px-3 lg:px-4 rounded-lg text-sm lg:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap inline-flex items-center"
            >
              Shopify Store
              <svg className="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
     
        <div className="text-center col-span-6 flex justify-center mt-3">
          <Image
            src="/logo.png"
            alt="SENIORS GROES.COM"
            width={430}
            height={80}
            className="mx-auto block lg:mx-0 drop-shadow-lg rounded-lg"
            priority
          />
        </div>
      </div>
    </div>

    {/* Right Side - Lead Capture Form - Full Height */}
    <div className="col-12 lg:col-span-4 h-full">
      <div className="bg-linear-to-br from-purple-900/90 via-purple-800/80 to-black/90 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl w-full max-w-md mx-auto lg:mx-0 border-2 border-purple-500/40 relative h-full overflow-hidden backdrop-blur-sm flex flex-col">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/20 rounded-full -ml-12 -mb-12"></div>
        <div className="relative z-10 flex flex-col h-full">
          <form
            className="space-y-4 sm:space-y-6 flex flex-col h-full"
            action={leadMagnetUrl}
            method="get"
            target="_blank"
          >
            <div className="text-center mb-4 sm:mb-6">
              <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-2 sm:mb-3 shadow-lg">
                🎁 FREE Download
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Get Your FREE Guide
              </h2>
              <p className="text-purple-200 text-xs sm:text-sm">Start building your online income today</p>
            </div>
            
            <div className="flex-grow space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-purple-100 font-semibold mb-2 text-sm sm:text-base">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border-2 border-purple-500/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-white placeholder:text-purple-300/50 text-sm sm:text-base"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-purple-100 font-semibold mb-2 text-sm sm:text-base">
                  Email <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/40 border-2 border-purple-500/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-white placeholder:text-purple-300/50 text-sm sm:text-base"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            
            <div className="mt-auto">
              <button
                type="submit"
                className="w-full bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-black font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                Download FREE PDF
              </button>
              <p className="text-xs text-purple-300/70 text-center px-2 mt-4">
                🔒 We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Video Section */}
      <section className="container mx-auto px-4  relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <a  href={leadMagnetUrl}
              target="_blank" rel="noopener noreferrer" className="inline-block bg-yellow-400/20 border border-yellow-400/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4">
              <span className="text-yellow-400 text-xs sm:text-sm font-semibold">📹 Watch Now</span>
            </a>
            <h2 className="text-2xl mt-4 sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 px-2 sm:px-0">
              Watch & Learn from Dr. Mark
            </h2>
            <p className="text-purple-200 text-base sm:text-lg px-2 sm:px-0">See proven strategies in action</p>
          </div>
          <div className="aspect-video bg-black/30 rounded-lg sm:rounded-xl overflow-hidden shadow-2xl border-2 border-purple-500/30 relative">
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none"></div>
            <iframe
              src="https://drive.google.com/file/d/17MT7wurB8-FixVTRQYzx7vEYs9jtmKiY/preview"
              className="w-full h-full"
              allow="autoplay"
              title="Dr. Mark Johnson Video"
            />
          </div>
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
      <div className="inline-block bg-yellow-400/20 border border-yellow-400/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4">
        <span className="text-yellow-400 text-xs sm:text-sm font-semibold">Meet Your Guide</span>
      </div>
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
            <div className="relative flex-grow">
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

      {/* Footer */}
      <footer className="bg-linear-to-r from-purple-900 to-black border-t border-purple-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center sm:text-left">
            <div>
              <h3 className="text-yellow-400 font-bold text-lg sm:text-xl mb-3 sm:mb-4">About Us</h3>
              <p className="text-purple-200 text-lg">
                Helping 55+ entrepreneurs build real online income with proven strategies.
              </p>
            </div>
            <div>
              <h3 className="text-yellow-400 font-bold text-lg sm:text-xl mb-3 sm:mb-4">Contact</h3>
              <p className="text-purple-200 text-sm sm:text-base break-words">
                <a href="mailto:mjohnsonsports@aol.com" className="hover:text-yellow-400 transition-colors">
                  mjohnsonsports@aol.com
                </a>
              </p>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <h3 className="text-yellow-400 font-bold text-lg sm:text-xl mb-3 sm:mb-4">Follow Us</h3>
              <div className="flex justify-center sm:justify-start gap-3 sm:gap-4">
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors" aria-label="YouTube">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors" aria-label="Facebook">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors" aria-label="Instagram">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors" aria-label="Pinterest">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.174.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                  </svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors" aria-label="TikTok">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors" aria-label="X (Twitter)">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
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
