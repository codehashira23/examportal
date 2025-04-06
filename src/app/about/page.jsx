"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from '../../../components/ui/canvas-reveal-effect';

export default function AboutPage() {
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
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">About Exam Portal</h1>
          
          <div className="space-y-6 text-white/80">
            <p>
              Exam Portal is a comprehensive online platform designed to revolutionize the way educational institutions conduct and manage examinations. Built with modern technology and user experience in mind, our portal provides a seamless environment for both administrators and students.
            </p>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-white mt-8 mb-4">Our Mission</h2>
            <p>
              We aim to simplify the examination process while maintaining integrity, security, and accessibility. Our mission is to provide a reliable platform that reduces administrative burden and enhances the learning assessment experience.
            </p>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-white mt-8 mb-4">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h3 className="text-lg font-medium text-white mb-2">For Administrators</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Easy exam creation and management</li>
                  <li>Secure exam scheduling and monitoring</li>
                  <li>Comprehensive student management</li>
                  <li>Detailed performance analytics</li>
                  <li>Customizable exam settings</li>
                </ul>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h3 className="text-lg font-medium text-white mb-2">For Students</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>User-friendly exam interface</li>
                  <li>Real-time exam access</li>
                  <li>Immediate feedback and results</li>
                  <li>Personal performance tracking</li>
                  <li>Secure login and exam environment</li>
                </ul>
              </div>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-white mt-8 mb-4">Technology</h2>
            <p>
              Our platform is built using cutting-edge technologies including Next.js, React, and MongoDB, ensuring a fast, responsive, and reliable experience across all devices. We employ advanced security measures to protect data and maintain exam integrity.
            </p>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-white mt-8 mb-4">Get Started</h2>
            <p>
              Whether you're an educational institution looking to streamline your examination process or a student preparing for upcoming assessments, Exam Portal offers the tools and features you need for success.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <Link 
                href="/auth" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md transition-all hover:bg-blue-700 hover:scale-105"
              >
                Sign In
              </Link>
              <Link 
                href="/auth" 
                className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg shadow-md transition-all hover:bg-white/20 hover:scale-105"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-white/50 text-sm mt-8 pb-4">
          &copy; {new Date().getFullYear()} Exam Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
} 