
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
    // Render a skeleton while the profile is loading to prevent errors.
    return (
      <div className="relative w-64 h-80 sm:w-72 sm:h-96 flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  // --- LÓGICA CORREGIDA Y DEFINITIVA ---
  // La selección se basa únicamente en 'commanderSex' del perfil.
  // Las URLs apuntan a las imágenes de cuerpo completo con el logo "AF".
  const imageUrl = playerProfile.commanderSex === 'female' 
    ? "https://i.imgur.com/BQHeVWp.png" // Comandante femenina con logo AF
    : "https://i.imgur.com/iuRJVBZ.png"; // Comandante masculino con logo AF

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
          key={imageUrl} // key prop para forzar la recarga de la imagen si cambia
        />
      </button>
    </div>
  );
};

export default CommanderPortrait;
