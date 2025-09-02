
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
  const currentTierColor = playerProfile?.currentTierColor || '45 100% 50%'; // Default to Gold HSL

  const maleImageUrl = "https://i.imgur.com/iuRJVBZ.png"; 
  const femaleImageUrl = "https://i.imgur.com/BQHeVWp.png";
  
  const imageUrl = commanderSex === 'male' ? maleImageUrl : femaleImageUrl;
  const altText = commanderSex === 'male' ? "Male Commander" : "Female Commander";
  const dataAiHint = commanderSex === 'male' ? "fullbody male commander" : "female commander";

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
        "w-64 h-80 sm:w-72 sm:h-96",
        "flex items-center justify-center"
      )}
      aria-label="Tap Commander"
    >
      <button 
        onClick={handleInteraction} 
        onTouchStart={(e) => {
          e.preventDefault();
          handleInteraction();
        }}
        className="w-full h-full relative group" // Added group for potential future use
      >
        {/* The Commander Image with dynamic aura */}
        <Image
          src={imageUrl}
          alt={altText}
          data-ai-hint={dataAiHint}
          width={288} // Base size for sm:
          height={384} // sm:h-96
          className={cn(
            "object-contain w-full h-full transition-all duration-200",
            isTapped ? "animate-tapped-aura" : "animate-pulse-neon-dynamic active:scale-95"
          )}
          priority
        />
        
        {/* Chest Logo */}
        <div className={cn(
          "absolute flex items-center justify-center",
          "w-[34px] h-[38px]", // Hexagon dimensions
          "left-1/2 -translate-x-1/2 -translate-y-1/2",
          commanderSex === 'male' ? 'top-[31%]' : 'top-[32%]', // Conditional positioning
          "bg-[hsl(var(--dynamic-commander-glow))] text-primary-foreground", // Use dynamic color
          "font-headline font-bold text-sm tracking-wider",
           "pointer-events-none" // Make sure it doesn't interfere with taps
        )}
        style={{ clipPath: hexagonClipPath }}
        >
            AF
        </div>
      </button>
    </div>
  );
};

export default CommanderPortrait;
    