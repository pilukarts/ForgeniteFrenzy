
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

  // The portraitUrl is now used for the main game view tap area.
  const imageUrl = playerProfile?.portraitUrl;

  if (!playerProfile || !imageUrl) {
    return (
      <div className="relative w-64 h-80 sm:w-72 sm:h-96 flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }
  
  const altText = `Commander ${playerProfile.name}`;
  const dataAiHint = playerProfile.commanderSex === 'male' ? "male commander portrait" : "female commander portrait";

  const handleInteraction = (isLogoTap: boolean) => {
    if (isLogoTap) {
      onLogoTap();
    } else {
      onTap();
    }
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 200);
  };
  
  // These values are percentages of the parent container's width and height.
  // They define the position and size of the invisible logo tap area.
  const logoHitbox = playerProfile.commanderSex === 'female'
    ? { top: '38%', left: '41%', width: '18%', height: '10%' }
    : { top: '37%', left: '42.5%', width: '15%', height: '9%' };


  return (
    <div 
      className={cn(
        "relative focus:outline-none transition-transform duration-100",
        "w-64 h-80 sm:w-72 sm:h-96", // Default size for the portrait area
        "flex items-center justify-center",
        isTapped && (playerProfile.commanderSex === 'female' ? "scale-105" : "scale-105") // Simplified tap effect
      )}
      aria-label="Tap Commander"
    >
      {/* Main button for the whole commander */}
      <button 
        onClick={() => handleInteraction(false)} 
        onTouchStart={(e) => {
          e.preventDefault();
          handleInteraction(false);
        }}
        className="w-full h-full relative group"
      >
        <Image
          src={imageUrl}
          alt={altText}
          data-ai-hint={dataAiHint}
          fill
          className={cn(
            "object-contain transition-all duration-200 pointer-events-none" // pointer-events-none so it doesn't block the logo button
          )}
          priority
          key={imageUrl} // Add key to force re-render on image URL change
        />
      </button>

      {/* Invisible button for the AF logo hotspot - LOGIC REMAINS BUT IS INEFFECTIVE WITHOUT LOGO IMAGES */}
      <button
        onClick={(e) => {
            e.stopPropagation(); // Prevents the main button click from firing
            handleInteraction(true);
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleInteraction(true);
        }}
        aria-label="Tap AF Logo for Bonus"
        className="absolute z-10 rounded-full"
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
