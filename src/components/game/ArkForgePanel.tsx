import React from "react";
import Image from "next/image";

type Props = {
  countdown?: string;
  className?: string;
  alt?: string;
};

const ArkForgePanel: React.FC<Props> = ({ countdown = "00:00:00", className = "", alt = "Ark" }) => {
  return (
    <div className={`w-44 sm:w-52 rounded-xl p-3 sm:p-4 bg-black/60 backdrop-blur-md border border-white/20 shadow-[0_0_25px_rgba(0,0,0,0.8)] ${className}`}>
      <div className="flex flex-col items-center gap-3">
        {/* Container for the ship image */}
        <div className="w-full aspect-square relative bg-gradient-to-b from-white/10 to-transparent rounded-lg overflow-hidden border border-white/10">
          <Image
            src="/images/ark/star-forge-ark.png"
            alt={alt}
            fill
            className="object-contain p-2 drop-shadow-[0_0_15px_rgba(255,255,0,0.3)]"
            draggable={false}
            unoptimized
          />
          {/* Subtle scanning effect lines */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[length:100%_4px] animate-[pulse_2s_infinite]" />
        </div>

        <div className="w-full text-center">
          <div className="text-[10px] uppercase tracking-widest text-primary/90 font-headline mb-1">Star-Forge Status</div>
          <div className="font-mono font-bold text-yellow-300 text-base sm:text-lg drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
            {countdown}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArkForgePanel;
