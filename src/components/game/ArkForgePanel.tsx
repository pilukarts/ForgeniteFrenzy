
"use client";
import React from "react";
import Image from "next/image";
import images from "@/lib/placeholder-images.json";

type Props = {
  countdown?: string;
  className?: string;
};

const ArkForgePanel: React.FC<Props> = ({ countdown = "30d 0h 0m", className = "" }) => {
  return (
    <div className={`w-64 sm:w-80 rounded-2xl p-5 bg-black/70 backdrop-blur-2xl border border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.9)] transition-all duration-500 hover:border-primary/40 ${className}`}>
      <div className="flex flex-col items-center gap-5">
        {/* Hangar de construcción sin personas */}
        <div className="w-full aspect-square relative bg-gradient-to-br from-blue-950/40 via-black to-gray-900 rounded-xl overflow-hidden border border-white/10 group min-h-[180px]">
          <Image
            src={images.ark.ark}
            alt="Ark Forge Construction"
            fill
            unoptimized={true}
            className="object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
            draggable={false}
            data-ai-hint="spaceship hangar"
          />
          
          {/* Rejilla de hangar (Subtle construction grid) */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:25px_20px]" />
          
          {/* Línea de escaneo láser de construcción */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/90 shadow-[0_0_25px_rgba(255,215,0,1)] animate-[scan_4s_linear_infinite] z-20" />
          
          {/* Destellos en las esquinas */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/50" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/50" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/50" />
        </div>

        <div className="w-full text-center space-y-2">
          <div className="text-[11px] uppercase tracking-[0.3em] text-primary font-headline font-bold">Ark-Forge Status</div>
          <div className="font-mono font-bold text-yellow-300 text-xl sm:text-2xl drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]">
            {countdown}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scan {
          0% { top: -5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 105%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ArkForgePanel;
