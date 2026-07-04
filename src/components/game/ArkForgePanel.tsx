
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
    <div className={`w-52 sm:w-64 rounded-xl p-4 bg-black/60 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.9)] ${className}`}>
      <div className="flex flex-col items-center gap-4">
        {/* Contenedor de la nave con efecto de escaneo */}
        <div className="w-full aspect-square relative bg-gradient-to-b from-white/10 to-transparent rounded-lg overflow-hidden border border-white/10 group">
          <Image
            src={images.ark.ark}
            alt="Ark Forge Ship"
            fill
            className="object-contain p-2 drop-shadow-[0_0_20px_rgba(255,215,0,0.6)] transition-transform duration-700 group-hover:scale-110"
            draggable={false}
            unoptimized
            data-ai-hint="massive spaceship"
          />
          {/* Línea de escaneo láser */}
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] bg-[length:100%_15px] animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/40 animate-[scan_3s_linear_infinite]" />
        </div>

        <div className="w-full text-center space-y-1">
          <div className="text-[10px] uppercase tracking-[0.25em] text-primary font-headline font-bold">Star-Forge Status</div>
          <div className="font-mono font-bold text-yellow-300 text-lg sm:text-xl drop-shadow-[0_0_8px_rgba(234,179,8,0.7)]">
            {countdown}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ArkForgePanel;
