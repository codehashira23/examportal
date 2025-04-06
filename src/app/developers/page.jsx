"use client";

import React, { useEffect, useRef } from "react";
import Link from 'next/link';
import { GlareCard } from "../../../components/ui/glare-card";
import { CanvasRevealEffect } from "../../../components/ui/canvas-reveal-effect";

const developers = [
    {
      id: 1,
      name: "Divyansh Jaiswal",
      role: " ",
      image: "/images/image01.png", // Replace with actual image paths
    },
    {
      id: 2,
      name: "Dinesh Marmat",
      role: " ",
      image: "/images/image02.png",
    },
    {
      id: 3,
      name: "Rambhadra",
      role: " ",
      image: "/images/image03.png",
    },
    { 
      id: 4,
      name: "Sriya Reddy",
      role: " ",
      image: "/images/image04.png",
    },
  ];
  



const Developer = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Auto-play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full">
      {/* Background effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(1.1) contrast(1.05)" }}
        >
          <source src="/bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay to slightly darken the video while keeping it vibrant */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40 mix-blend-overlay"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
        <div className="flex justify-between items-center mb-8">
          <div className="mb-8 text-center w-full">
            <h1 className="mb-4 text-5xl font-bold text-white">Developers</h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              Meet the talented team behind the ExamPortal platform.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {developers.map((developer) => (
            <div key={developer.id} className="flex justify-center">
              <GlareCard className="overflow-hidden p-0">
                <div className="flex h-full flex-col">
                  {/* Developer Image */}
                  <div className="h-3/4 overflow-hidden">
                    <img
                      src={developer.image}
                      alt={developer.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback for missing images
                        e.target.src = "https://via.placeholder.com/300x350?text=Developer";
                      }}
                    />
                  </div>
                  
                  {/* Developer Info */}
                  <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
                    <h3 className="mb-1 text-xl font-bold text-white">{developer.name}</h3>
                    <p className="text-sm text-blue-300">{developer.role}</p>
                  </div>
                </div>
              </GlareCard>
            </div>
          ))}
        </div>
        
        {/* Back to Home Button */}
        <div className="mt-16 text-center">
          <Link 
            href="/" 
            className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg shadow-md transition-all hover:bg-blue-700 hover:scale-105 inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
    
  )
};

export default Developer;