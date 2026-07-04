
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
    <div className={`w-48 sm:w-60 rounded-xl p-4 bg-black/60 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.8)] ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full aspect-square relative bg-gradient-to-b from-white/5 to-transparent rounded-lg overflow-hidden border border-white/10 group">
          <Image
            src={images.ark.ark}
            alt="Ark Forge Ship"
            fill
            className="object-contain p-2 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-transform duration-500 group-hover:scale-110"
            draggable={false}
            unoptimized
            data-ai-hint="massive spaceship"
          />
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[length:100%_10px] animate-pulse" />
        </div>

        <div className="w-full text-center space-y-1">
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary/90 font-headline font-bold">Star-Forge Status</div>
          <div className="font-mono font-bold text-yellow-300 text-lg sm:text-xl drop-shadow-[0_0_8px_rgba(234,179,8,0.7)]">
            {countdown}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArkForgePanel;
