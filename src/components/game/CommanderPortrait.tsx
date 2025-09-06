"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useGame } from '@/contexts/GameContext'; // Import useGame
import { Hexagon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


interface CommanderPortraitProps {
  onTap: () => void;
}

const CommanderPortrait: React.FC<CommanderPortraitProps> = ({ onTap }) => {
  const { playerProfile } = useGame();
  const [isTapped, setIsTapped] = useState(false);
  
  if (!playerProfile) {
    // Render a skeleton while the profile is loading to prevent server errors
    return (
        <div className="relative w-64 h-80 sm:w-72 sm:h-96 flex items-center justify-center">
            <Skeleton className="w-full h-full" />
        </div>
    );
  }
  
  const { commanderSex, currentTierColor, equippedUniformPieces } = playerProfile;

  // --- Simplified and Corrected Logic ---
  const getCommanderImage = () => {
    let imageInfo = { src: "", hint: "" };
    
    // This logic directly and simply checks the 'commanderSex' from the profile.
    if (commanderSex === 'male') {
        imageInfo = { src: "https://i.imgur.com/iuRJVBZ.png", hint: "fullbody male commander" };
    } else { // 'female'
        imageInfo = { src: "https://i.imgur.com/BQHeVWp.png", hint: "fullbody female commander" };
    }
    return imageInfo;
  };

  const { src: imageUrl, hint: dataAiHint } = getCommanderImage();
  const altText = commanderSex === 'male' ? "Male Commander" : "Female Commander";

  const handleInteraction = () => {
    onTap();
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 200);
  };

  const hexagonClipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

  const dynamicStyles = {
    '--dynamic-commander-glow': currentTierColor || '45 100% 50%'
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
        className="w-full h-full relative group"
      >
        <Image
          src={imageUrl}
          alt={altText}
          data-ai-hint={dataAiHint}
          width={288}
          height={384}
          className={cn(
            "object-contain w-full h-full transition-all duration-200",
            isTapped ? "animate-tapped-aura" : "animate-pulse-neon-dynamic active:scale-95"
          )}
          priority
          key={imageUrl} // Add key to force re-render on image change
        />
        
        <div className={cn(
          "absolute flex items-center justify-center",
          "w-[34px] h-[38px]",
          "left-1/2 -translate-x-1/2 -translate-y-1/2",
          commanderSex === 'male' ? 'top-[31%]' : 'top-[32%]',
          "bg-[hsl(var(--dynamic-commander-glow))] text-primary-foreground",
          "font-headline font-bold text-sm tracking-wider",
           "pointer-events-none"
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
