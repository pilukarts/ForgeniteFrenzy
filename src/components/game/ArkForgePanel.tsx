
"use client";
import React from "react";
import Image from "next/image";
import images from "@/lib/placeholder-images.json";

type Props = {
  countdown?: React.ReactNode;
  className?: string;
};

const ArkForgePanel: React.FC<Props> = ({ countdown = "30d 0h 0m", className = "" }) => {
  return (
    <div className={`w-64 sm:w-85 rounded-2xl p-6 bg-black/75 backdrop-blur-3xl border border-white/25 shadow-[0_0_80px_rgba(0,0,0,0.95)] transition-all duration-500 hover:border-primary/50 ${className}`}>
      <div className="flex flex-col items-center gap-6">
        {/* Hangar de construcción Puro */}
        <div className="w-full aspect-square relative bg-gradient-to-br from-blue-950/50 via-black to-gray-900 rounded-xl overflow-hidden border border-white/15 group min-h-[200px]">
          <Image
            src={images.ark.ark}
            alt="Ark Forge Construction"
            fill
            unoptimized
            priority
            className="object-cover opacity-95 transition-transform duration-1000 group-hover:scale-110"
            draggable={false}
            data-ai-hint="spaceship hangar construction"
          />
          
          {/* Rejilla de hangar Sutil */}
          <div className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          {/* Línea de escaneo láser de construcción Potente */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-primary/95 shadow-[0_0_35px_rgba(255,215,0,1)] animate-[scan_5s_linear_infinite] z-20" />
          
          {/* Marcos Tácticos */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/60" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/60" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/60" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/60" />
        </div>

        <div className="w-full text-center space-y-3">
          <div className="text-[12px] uppercase tracking-[0.4em] text-primary font-headline font-extrabold drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">Star-Forge Status</div>
          <div className="font-mono font-bold text-yellow-300 text-2xl sm:text-3xl drop-shadow-[0_0_15px_rgba(234,179,8,0.7)]">
            {countdown}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scan {
          0% { top: -5%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 105%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ArkForgePanel;
