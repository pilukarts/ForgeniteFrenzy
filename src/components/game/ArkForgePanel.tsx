
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
    <div className={`w-56 sm:w-64 rounded-xl p-4 bg-black/70 backdrop-blur-xl border border-white/30 shadow-[0_0_50px_rgba(0,0,0,1)] ${className}`}>
      <div className="flex flex-col items-center gap-4">
        {/* Contenedor de la nave con efecto de muelle de construcción (Hangar) */}
        <div className="w-full aspect-square relative bg-gradient-to-b from-blue-900/30 to-black rounded-lg overflow-hidden border border-white/20 group min-h-[150px]">
          <Image
            src={images.ark.ark}
            alt="Ark Forge Ship"
            fill
            unoptimized={true}
            className="object-contain p-4 drop-shadow-[0_0_30px_rgba(255,215,0,0.6)] transition-transform duration-700 group-hover:scale-110"
            draggable={false}
            data-ai-hint="massive spaceship construction"
          />
          
          {/* Rejilla de hangar (Subtle construction grid) */}
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
          
          {/* Línea de escaneo láser de construcción */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-primary/80 shadow-[0_0_20px_rgba(255,215,0,1)] animate-[scan_4s_linear_infinite] z-20" />
          
          {/* Destellos en las esquinas */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/70" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/70" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/70" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/70" />
        </div>

        <div className="w-full text-center space-y-1">
          <div className="text-[10px] uppercase tracking-[0.25em] text-primary font-headline font-bold">Ark-Forge Status</div>
          <div className="font-mono font-bold text-yellow-300 text-lg sm:text-xl drop-shadow-[0_0_8px_rgba(234,179,8,0.7)]">
            {countdown}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scan {
          0% { top: -5%; }
          100% { top: 105%; }
        }
      `}</style>
    </div>
  );
};

export default ArkForgePanel;
