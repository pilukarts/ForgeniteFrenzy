
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
    <button 
      onClick={handleInteraction} 
      onTouchStart={(e) => {
        e.preventDefault();
        handleInteraction();
      }}
      className={cn(
        "relative focus:outline-none transition-transform duration-100",
        "w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[440px] lg:h-[440px]", // Consistent large size
        "bg-transparent core-hexagon-glow", // Apply the glow animation class
        "flex items-center justify-center",
        isTapped ? 'animate-tapped-visual' : 'active:scale-95'
      )}
      style={{ 
        clipPath: hexagonClipPath,
        '--dynamic-commander-glow': currentTierColor 
      } as React.CSSProperties}
      aria-label="Tap Commander"
    >
      <Image
        src={imageUrl}
        alt={altText}
        data-ai-hint={dataAiHint}
        width={440} 
        height={440}
        className="object-contain w-full h-full" 
        priority
        style={{ clipPath: hexagonClipPath }} 
      />

       {/* Visual Core with AF on Chest */}
      <div 
        className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ '--dynamic-commander-glow': currentTierColor } as React.CSSProperties}
      >
        <div 
          className="relative w-10 h-10 sm:w-12 sm:h-12 group animate-pulse-neon-dynamic"
          style={{ clipPath: hexagonClipPath }}
        >
            <Hexagon className="absolute inset-0 w-full h-full text-[hsl(var(--dynamic-commander-glow))] fill-[hsla(var(--dynamic-commander-glow)/0.2)]" />
            <span className="absolute inset-0 flex items-center justify-center font-headline text-sm sm:text-base text-[hsl(var(--dynamic-commander-glow))] font-bold">
                AF
            </span>
        </div>
      </div>
      
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
    </button>
  );
};

export default CommanderPortrait;
    
