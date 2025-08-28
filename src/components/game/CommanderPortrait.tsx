
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useGame } from '@/contexts/GameContext'; // Import useGame
import { Hexagon } from 'lucide-react';

interface CommanderPortraitProps {
  onTap: () => void;
}

const CommanderPortrait: React.FC<CommanderPortraitProps> = ({ onTap }) => {
  const { playerProfile } = useGame(); // Get playerProfile from context
  const [isTapped, setIsTapped] = useState(false);
  
  // Determine commander sex and tier color from playerProfile
  const commanderSex = playerProfile?.commanderSex || 'female'; // Default if profile not loaded
  const currentTierColor = playerProfile?.currentTierColor || '210 15% 75%'; // Default to Silver HSL

  const maleImageUrl = "https://i.imgur.com/iuRJVBZ.png"; 
  const femaleImageUrl = "https://i.imgur.com/BQHeVWp.png";
  
  const imageUrl = commanderSex === 'male' ? maleImageUrl : femaleImageUrl;
  const altText = commanderSex === 'male' ? "Male Commander" : "Female Commander";
  const dataAiHint = commanderSex === 'male' ? "fullbody male commander" : "fullbody female commander";

  const handleInteraction = () => {
    onTap();
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 200); // Duration of the tap animation
  };

  const hexagonClipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

  const dynamicStyles = {
    '--dynamic-commander-glow': currentTierColor
  } as React.CSSProperties;

  return (
    <div 
      style={dynamicStyles}
      className={cn(
        "relative focus:outline-none transition-transform duration-100",
        "w-64 h-80 sm:w-72 sm:h-96", // Adjusted aspect ratio to be taller
        "flex items-center justify-center",
        isTapped ? 'animate-tapped-visual' : 'active:scale-95'
      )}
      aria-label="Tap Commander"
    >
      <button 
        onClick={handleInteraction} 
        onTouchStart={(e) => {
          e.preventDefault();
          handleInteraction();
        }}
        className="w-full h-full relative"
      >
        {/* The Aura Div */}
        <div
          className="absolute inset-0 animate-pulse-neon-dynamic bg-transparent"
          style={{ clipPath: hexagonClipPath }}
        />
        {/* The Commander Image */}
        <Image
          src={imageUrl}
          alt={altText}
          data-ai-hint={dataAiHint}
          width={288} // Base size for sm:
          height={384} // sm:h-96
          className="object-contain w-full h-full"
          priority
        />
        
        {/* Chest Logo */}
        <div className={cn(
          "absolute flex items-center justify-center",
          "w-[34px] h-[38px]", // Hexagon dimensions
          "top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2",
          "bg-primary/70 text-primary-foreground",
          "font-headline font-bold text-sm tracking-wider"
        )}
        style={{ clipPath: hexagonClipPath }}
        >
            AF
        </div>

        {/* Dynamic Belt Color */}
        <div className={cn(
          "absolute w-[70px] h-[12px] rounded-sm",
          "left-1/2 -translate-x-1/2",
          commanderSex === 'male' ? "top-[54.5%]" : "top-[52%]",
          "bg-[hsl(var(--dynamic-commander-glow))]",
          "shadow-[0_0_5px_hsl(var(--dynamic-commander-glow))]"
        )}
        />
      </button>

      <style jsx>{`
        @keyframes tapped-visual {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); } 
          100% { transform: scale(1); }
        }
        .animate-tapped-visual {
          animation: tapped-visual 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CommanderPortrait;
    
