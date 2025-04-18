"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from '../../components/ui/canvas-reveal-effect';

export default function Home() {
  const [hovered, setHovered] = useState(false);

  return (
    <main 
      className="flex min-h-screen items-center justify-center relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background with Canvas Effect */}
      <div className="absolute inset-0 bg-black">
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full absolute inset-0"
            >
              <CanvasRevealEffect
                animationSpeed={5}
                containerClassName="bg-transparent"
                colors={[
                  [59, 130, 246],
                  [139, 92, 246],
                ]}
                opacities={[0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1]}
                dotSize={2}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Radial gradient for better text visibility */}
        <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] sm:[mask-image:radial-gradient(600px_at_center,white,transparent)] bg-black/50" />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Side: Welcome Text */}
        <div className="flex-1 text-center lg:text-left">
          {/* Logo for mobile view - centered */}
          <div className='block md:hidden w-full flex justify-center mb-4'>
            <Image src="/logo.png" alt="logo" width={40} height={40} />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-6 leading-tight">
            Welcome to the
            <span className='flex items-center justify-center lg:justify-start gap-2 mt-1'>
              Exam Portal
              {/* Logo for larger screens - inline with text */}
              <Image className='hidden md:block' src="/logo.png" alt="logo" width={30} height={30} />
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 mx-auto lg:mx-0 max-w-xl">
            A comprehensive platform for conducting online examinations with advanced monitoring and result analysis
          </p>
          
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
            <Link 
              href="/auth" 
              className="px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold bg-blue-600 text-white rounded-lg shadow-md transition-all hover:bg-blue-700 hover:scale-105"
            >
              Admin Login
            </Link>
            <Link 
              href="/auth" 
              className="px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold bg-green-600 text-white rounded-lg shadow-md transition-all hover:bg-green-700 hover:scale-105"
            >
              Student Login
            </Link>
            <Link 
              href="/auth" 
              className="px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg shadow-md transition-all hover:bg-white/20 hover:scale-105"
            >
              Register
            </Link>
            <Link 
              href="/about" 
              className="px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold bg-purple-600 text-white rounded-lg shadow-md transition-all hover:bg-purple-700 hover:scale-105"
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold bg-indigo-600 text-white rounded-lg shadow-md transition-all hover:bg-indigo-700 hover:scale-105"
            >
              Contact Us
            </Link>
            <Link 
              href="/developers" 
              className="px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg shadow-md transition-all hover:bg-white/20 hover:scale-105"
            >
              Developers
            </Link>
          </div>
        </div>
        
        {/* Right Side: Feature Cards */}
        <div className="flex-1 w-full mt-8 lg:mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="backdrop-blur-md bg-white/10 p-4 sm:p-6 rounded-lg border border-white/10 shadow-xl transition-all hover:bg-white/20">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Exam Management</h3>
              </div>
              <p className="text-white/70 text-xs sm:text-sm">Create, schedule, and manage exams with ease</p>
            </div>
            
            <div className="backdrop-blur-md bg-white/10 p-4 sm:p-6 rounded-lg border border-white/10 shadow-xl transition-all hover:bg-white/20">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Student Monitoring</h3>
              </div>
              <p className="text-white/70 text-xs sm:text-sm">Advanced proctoring to ensure exam integrity</p>
            </div>
            
            <div className="backdrop-blur-md bg-white/10 p-4 sm:p-6 rounded-lg border border-white/10 shadow-xl transition-all hover:bg-white/20">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Performance Analytics</h3>
              </div>
              <p className="text-white/70 text-xs sm:text-sm">Detailed performance reports and analytics</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 text-center text-white/50 text-xs sm:text-sm py-2">
        &copy; {new Date().getFullYear()} Exam Portal. All rights reserved.
      </div>
    </main>
  );
}
