"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from '../../../components/ui/canvas-reveal-effect';

export default function AuthPage() {
  const [signIn, setSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const router = useRouter();

  // Check WebGL support on component mount
  useEffect(() => {
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

  async function handleLogin(e) {
    e.preventDefault();
    
    setLoading(true);

    try {
      console.log("Attempting login...");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();  
      console.log("Login response:", data);

      if (!res.ok) {
        alert(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // Store token and role
      document.cookie = `token=${data.token}; path=/; max-age=3600; Secure; SameSite=Strict`;
      document.cookie = `role=${data.role}; path=/; max-age=3600; Secure; SameSite=Strict`;

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      console.log("Redirecting to:", data.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
      
      router.push(data.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      alert("Registration successful! You can now log in.");
      setSignIn(true);
      setLoading(false);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-black p-2 sm:p-4 relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Canvas Background */}
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
      
      {/* Auth Container */}
      <div className={`backdrop-blur-lg bg-white/10 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-4xl overflow-hidden relative min-h-[500px] sm:min-h-[550px] md:min-h-[600px] z-10 border border-white/20`}>
        
        {/* Sign Up Container */}
        <div className={`w-full md:w-1/2 transition-all duration-700 ease-in-out transform ${signIn ? 'opacity-0 translate-x-full md:translate-x-0 pointer-events-none' : 'opacity-100 translate-x-0 pointer-events-auto'} md:static absolute inset-0 flex items-center justify-center`}>
          <div className="p-4 sm:p-6 md:p-8 w-full max-w-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8 text-white">Create Account</h2>
            <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-white/20 rounded-lg bg-white/5 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/60 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={!signIn ? email : ''}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-white/20 rounded-lg bg-white/5 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/60 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={!signIn ? password : ''}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-white/20 rounded-lg bg-white/5 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/60 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-white/10 rounded-lg bg-white/ text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black-500 text-sm sm:text-base"
                  required
                  style={{ backgroundColor: '#494354', color: 'white' }}
                >
                  <option value="student" style={{ backgroundColor: '#494354', color: 'white' }}>Student</option>
                  <option value="admin" style={{ backgroundColor: '#494354', color: 'white' }}>Admin</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? "bg-blue-400/50" : "bg-blue-600 hover:bg-blue-700"} text-white font-bold my-10 py-2 sm:py-3 rounded-lg transition-colors duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 text-sm sm:text-base`}
              >
                {loading ? "Processing..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
        
        {/* Sign In Container */}
        <div className={`w-full md:w-1/2 transition-all duration-700 ease-in-out transform ${!signIn ? 'opacity-0 translate-x-full md:translate-x-0 pointer-events-none' : 'opacity-100 translate-x-0 pointer-events-auto'} md:static absolute inset-0 flex items-center justify-center`}>
          <div className="p-4 sm:p-6 md:p-8 w-full max-w-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8 text-white">Sign In</h2>
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={signIn ? email : ''}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-white/20 rounded-lg bg-white/5 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/60 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={signIn ? password : ''}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-white/20 rounded-lg bg-white/5 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/60 text-sm sm:text-base"
                  required
                />
              </div>
              <div className="flex justify-end">
                <a href="#" className="text-xs sm:text-sm text-blue-300 hover:text-blue-200 hover:underline">Forgot your password?</a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? "bg-blue-400/50" : "bg-blue-600 hover:bg-blue-700"} text-white font-bold py-2 sm:py-3 rounded-lg transition-colors duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 text-sm sm:text-base`}
              >
                {loading ? "Processing..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
        
        {/* Overlay Container */}
        <div className={`hidden md:block absolute top-0 left-0 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-100 ${!signIn ? 'translate-x-full' : ''}`}>
          {/* Overlay */}
          <div className={`bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-md text-white relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out ${!signIn ? 'translate-x-1/2' : 'translate-x-0'}`}>
            
            {/* Left Overlay Panel */}
            <div className={`absolute top-0 flex flex-col items-center justify-center w-1/2 h-full px-4 lg:px-10 text-center transform transition-transform duration-700 ease-in-out ${!signIn ? 'translate-x-0' : '-translate-x-[20%]'}`}>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-4">Welcome Back!</h2>
              <p className="mb-6 lg:mb-10 text-sm lg:text-base">
                To keep connected with us, please login with your personal credentials
              </p>
              <button 
                onClick={() => setSignIn(true)}
                className="border border-white text-white bg-transparent rounded-full px-6 lg:px-8 py-1.5 lg:py-2 text-sm lg:text-base font-bold transition-all hover:bg-white hover:bg-opacity-10 hover:scale-105 focus:outline-none"
              >
                Sign In
              </button>
              <div className="mt-8 lg:mt-12">
                <Image src="/logo.png" alt="Exam Portal Logo" width={40} height={40} className="mx-auto opacity-80 lg:w-[60px] lg:h-[60px]" />
              </div>
            </div>
            
            {/* Right Overlay Panel */}
            <div className={`absolute top-0 right-0 flex flex-col items-center justify-center w-1/2 h-full px-4 lg:px-10 text-center transform transition-transform duration-700 ease-in-out ${!signIn ? 'translate-x-[20%]' : 'translate-x-0'}`}>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-4">Hello, Friend!</h2>
              <p className="mb-6 lg:mb-10 text-sm lg:text-base">
                Enter your personal details and start your journey with us
              </p>
              <button 
                onClick={() => setSignIn(false)}
                className="border border-white text-white bg-transparent rounded-full px-6 lg:px-8 py-1.5 lg:py-2 text-sm lg:text-base font-bold transition-all hover:bg-white hover:bg-opacity-10 hover:scale-105 focus:outline-none"
              >
                Sign Up
              </button>
              <div className="mt-8 lg:mt-12">
                <Image src="/logo.png" alt="Exam Portal Logo" width={40} height={40} className="mx-auto opacity-80 lg:w-[60px] lg:h-[60px]" />
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Mobile Toggle - Only visible on small screens */}
        <div className="md:hidden w-full text-center py-3 sm:py-4 px-4 sm:px-8 bg-white/5 backdrop-blur-md border-t border-white/10">
          <p className="text-white/80 text-xs sm:text-sm">
            {signIn ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setSignIn(!signIn)}
              className="ml-2 text-blue-300 font-medium hover:underline focus:outline-none"
            >
              {signIn ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
        
      </div>
    </div>
  );
} 