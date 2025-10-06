
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useGame } from '@/contexts/GameContext';
import { Skeleton } from '@/components/ui/skeleton';

interface CommanderPortraitProps {
  onTap: () => void;
  onLogoTap: () => void;
}

const CommanderPortrait: React.FC<CommanderPortraitProps> = ({ onTap, onLogoTap }) => {
  const { playerProfile } = useGame();
  const [isTapped, setIsTapped] = useState(false);

  const baseImageUrl = playerProfile?.avatarUrl;

  if (!playerProfile || !baseImageUrl) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }
  
  const imageUrl = `${baseImageUrl}?t=${new Date().getTime()}`;
  
  const altText = `Commander ${playerProfile.name}`;
  const dataAiHint = playerProfile.commanderSex === 'male' ? "male commander full body" : "female commander full body";

  const handleInteraction = (isLogoTap: boolean) => {
    if (isLogoTap) {
      onLogoTap();
    } else {
      onTap();
    }
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 200);
  };
  
  const logoHitbox = playerProfile.commanderSex === 'female'
    ? { top: '38%', left: '41%', width: '18%', height: '10%' }
    : { top: '38%', left: '41%', width: '18%', height: '10%' }; 
    
  const dynamicGlowStyle = {
    '--dynamic-commander-glow': playerProfile.currentTierColor,
  } as React.CSSProperties;


  return (
    <div 
      onClick={() => handleInteraction(false)} 
      className={cn(
        "relative focus:outline-none transition-transform duration-100 cursor-pointer w-full h-full pointer-events-auto", // Make commander portrait clickable
        isTapped && "scale-105"
      )}
      aria-label="Tap Commander"
      style={dynamicGlowStyle}
    >
        {/* Dynamic Aura - applies to the Image now */}
        <div
            className="w-full h-full relative group z-10 commander-aura-glow"
        >
            <Image
            src={imageUrl}
            alt={altText}
            data-ai-hint={dataAiHint}
            fill
            className={cn(
              "object-contain object-bottom transition-all duration-200" // Use object-contain and anchor to bottom
            )}
            priority
            key={playerProfile.avatarUrl}
            />
        </div>

        {/* Invisible button for the AF logo hotspot */}
        <button
            onClick={(e) => {
                e.stopPropagation(); 
                handleInteraction(true);
            }}
            onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleInteraction(true);
            }}
            aria-label="Tap AF Logo for Bonus"
            className="absolute z-20 rounded-full"
            style={{
            top: logoHitbox.top,
            left: logoHitbox.left,
            width: logoHitbox.width,
            height: logoHitbox.height,
            }}
        />
    </div>
  );
};

export default CommanderPortrait;
