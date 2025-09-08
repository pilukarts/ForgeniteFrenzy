
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useGame } from '@/contexts/GameContext';
import { Skeleton } from '@/components/ui/skeleton';

interface CommanderPortraitProps {
  onTap: () => void;
}

const CommanderPortrait: React.FC<CommanderPortraitProps> = ({ onTap }) => {
  const { playerProfile } = useGame();
  const [isTapped, setIsTapped] = useState(false);

  if (!playerProfile) {
    return (
      <div className="relative w-64 h-80 sm:w-72 sm:h-96 flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  // --- CORRECTED LOGIC ---
  // Use the correct images with the AF logo. This logic is now definitive.
  const imageUrl = playerProfile.commanderSex === 'female' 
    ? "https://i.imgur.com/BQHeVWp.png" // Female commander with AF logo
    : "https://i.imgur.com/iuRJVBZ.png"; // Male commander with AF logo

  const altText = `Commander ${playerProfile.name}`;
  const dataAiHint = playerProfile.commanderSex === 'male' ? "male commander full body" : "female commander full body";

  const handleInteraction = () => {
    onTap();
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 200);
  };

  const dynamicStyles = {
    '--dynamic-commander-glow': playerProfile.currentTierColor || '45 100% 50%'
  } as React.CSSProperties;

  return (
    <div 
      style={dynamicStyles}
      className={cn(
        "relative focus:outline-none transition-transform duration-100",
        "w-64 h-80 sm:w-72 sm:h-96", // Default size for the portrait area
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
        className="w-full h-full relative group"
      >
        <Image
          src={imageUrl}
          alt={altText}
          data-ai-hint={dataAiHint}
          fill
          className={cn(
            "object-contain transition-all duration-200", // Use object-contain to fit the image within the button area
            isTapped ? "animate-tapped-aura" : "animate-pulse-neon-dynamic active:scale-95"
          )}
          priority
          key={imageUrl} // Add key to force re-render on image URL change
        />
      </button>
    </div>
  );
};

export default CommanderPortrait;

    