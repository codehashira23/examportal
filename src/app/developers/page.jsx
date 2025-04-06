"use client";

import React from "react";
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
  



const developer = () => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <CanvasRevealEffect
          colors={[[0, 100, 255], [100, 0, 255]]}
          animationSpeed={0.3}
          containerClassName="bg-gray-950"
          dotSize={2}
        />
      {/* <img src="/images/bg.gif" alt="background" className="absolute inset-0 w-full h-full object-cover" /> */}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white">Developers</h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-300">
            Meet the talented team behind the ExamPortal platform.
          </p>
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
      </div>
    </div>
    
  )
};

export default developer;