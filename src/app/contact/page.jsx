"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from '../../../components/ui/canvas-reveal-effect';

export default function ContactPage() {
  const [hovered, setHovered] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setFormSubmitted(true);
      setLoading(false);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

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
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Contact Us</h1>
          
          {formSubmitted ? (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Thank You for Reaching Out!</h2>
              <p className="text-white/80 mb-6">
                We've received your message and will get back to you as soon as possible.
              </p>
              <button 
                onClick={() => setFormSubmitted(false)} 
                className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg shadow-md transition-all hover:bg-white/20 hover:scale-105"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-1">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">Email Us</h3>
                      <p className="text-white/70">support@examportal.com</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-1">
                      <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">Call Us</h3>
                      <p className="text-white/70">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-1 text-sm">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-1 text-sm">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 mb-1 text-sm">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-1 text-sm">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                      loading 
                        ? "bg-blue-400/50 cursor-not-allowed" 
                        : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.01]"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center text-white/50 text-sm mt-8 pb-4">
          &copy; {new Date().getFullYear()} Exam Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
} 