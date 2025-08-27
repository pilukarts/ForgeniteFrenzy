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
    // Play tap sound effect - placeholder sound
    const tapSound = new Audio('/sounds/your-tap-sound.mp3'); 
    tapSound.play().catch(e => console.error("Error playing tap sound:", e));
    
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 200); // Duration of the tap animation
  };

  const hexagonClipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

  return (
    <div 
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
          className={cn(
            "absolute inset-0 animate-pulse-neon-dynamic",
            "bg-transparent"
          )}
          style={{ 
            clipPath: hexagonClipPath,
            '--dynamic-commander-glow': currentTierColor 
          } as React.CSSProperties}
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
    