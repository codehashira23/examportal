"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from '../../../components/ui/canvas-reveal-effect';

export default function ContactPage() {
  const [hovered, setHovered] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  
  // Check WebGL support on component mount
  React.useEffect(() => {
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const supports = !!(
          window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
        return supports;
      } catch (e) {
        return false;
      }
    };

    // Check if mobile device or has limited WebGL support
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Disable WebGL effects on mobile to prevent errors
    if (isMobile || !checkWebGLSupport()) {
      setWebGLSupported(false);
    }
  }, []);

  return (
    <div 
      className="min-h-screen bg-black p-4 sm:p-8 relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background with Canvas Effect */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {hovered && webGLSupported && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full absolute inset-0"
            >
              <CanvasRevealEffect
                animationSpeed={3}
                containerClassName="bg-transparent"
                colors={[
                  [59, 130, 246], // Blue
                  [139, 92, 246]  // Purple
                ]}
                opacities={[0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.2, 0.2, 0.2, 0.3]}
                dotSize={1.5}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Fallback gradient background when WebGL is not supported */}
        {!webGLSupported && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30" />
        )}
        
        {/* Radial gradient for better visibility */}
        <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] sm:[mask-image:radial-gradient(600px_at_center,white,transparent)] bg-black/30" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Exam Portal Logo" width={40} height={40} className="opacity-80" />
            <span className="text-white font-bold text-xl">Exam Portal</span>
          </Link>
          
          <Link 
            href="/" 
            className="px-4 py-2 text-sm font-semibold bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg shadow-md transition-all hover:bg-white/20 hover:scale-105"
          >
            Back to Home
          </Link>
        </div>
        
        {/* Main Content */}
        <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 sm:p-8 border border-white/20 shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">Contact Us</h1>
          
          <div className="space-y-8">
            <p className="text-white/80 text-center max-w-2xl mx-auto text-lg">
              Have questions about our services? Bussiness??
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-10">
              <div className="bg-white/5 p-6 rounded-lg border border-white/10 transition-all hover:bg-white/10 hover:scale-[1.02]">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 mt-1">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">Email Us</h3>
                    <p className="text-white/70 mt-3 mb-1">For support:</p>
                    <p className="text-blue-300 font-medium">support@examportal.com</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-lg border border-white/10 transition-all hover:bg-white/10 hover:scale-[1.02]">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4 mt-1">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">Call Us</h3>
                    <p className="text-white/70 mb-1">Customer Support:</p>
                    <p className="text-purple-300 font-medium">+91 9876543210</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-lg border border-white/10 md:col-span-2 transition-all hover:bg-white/10 hover:scale-[1.02]">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-4 mt-1">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">Visit Us</h3>
                    <p className="text-white/70 mb-1">Headquarters:</p>
                    <p className="text-green-300 font-medium">Exam Portal Headquarters</p>
                    <p className="text-white/90">Near Hostal Gate A, IIITV-IVD </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-white/50 text-sm mt-8 pb-4">
          <div className="flex justify-center mb-6">
            <Link 
              href="/" 
              className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg shadow-md transition-all hover:bg-blue-700 hover:scale-105"
            >
              Back to Home
            </Link>
          </div>
          &copy; {new Date().getFullYear()} Exam Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
} 