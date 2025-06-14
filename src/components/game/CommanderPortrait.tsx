
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Hexagon } from 'lucide-react';

interface CommanderPortraitProps {
  commanderSex: 'male' | 'female';
  onTap: () => void;
}

const CommanderPortrait: React.FC<CommanderPortraitProps> = ({ commanderSex, onTap }) => {
  const [isTapped, setIsTapped] = useState(false);
  
  const maleImageUrl = "https://i.imgur.com/iuRJVBZ.png"; 
  const femaleImageUrl = "https://i.imgur.com/BQHeVWp.png";
  
  const imageUrl = commanderSex === 'male' ? maleImageUrl : femaleImageUrl;
  const altText = commanderSex === 'male' ? "Male Commander" : "Female Commander";
  const dataAiHint = commanderSex === 'male' ? "fullbody male commander" : "fullbody female commander";

  const handleInteraction = () => {
    onTap();
    // Placeholder for tap sound effect:
    // const tapSound = new Audio('/sounds/your-tap-sound.mp3'); // Replace with actual sound file path
    // tapSound.play().catch(e => console.error("Error playing tap sound:", e));
    
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 200); // Duration of the tap animation (must match CSS)
  };

  return (
    <button 
      onClick={handleInteraction} 
      onTouchStart={(e) => {
        // Prevent default to avoid potential double interaction on some mobile browsers if onClick also fires.
        // Can also help make the interaction feel more immediate.
        // e.preventDefault(); 
        handleInteraction();
      }}
      className={cn(
        "relative rounded-full focus:outline-none transition-transform duration-100", // Base transition for active:scale
        "w-44 h-44 md:w-48 md:h-48 lg:w-56 lg:h-56", 
        "border-0 shadow-none bg-transparent",
        "animate-pulse-neon-blue flex items-center justify-center", // Continuous ambient pulse
        isTapped ? 'animate-tapped-visual' : 'active:scale-95' // Apply tap animation or standard active scale
      )}
      aria-label="Tap Commander"
    >
      <Image
        src={imageUrl}
        alt={altText}
        data-ai-hint={dataAiHint}
        width={224} 
        height={224} 
        className="rounded-full object-contain w-full h-full" 
        priority
      />
      <Hexagon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[150%] h-8 w-8 md:h-10 md:w-10 text-bright-gold/70 opacity-80 pointer-events-none core-hexagon-glow" />
      
      <style jsx>{`
        @keyframes tapped-visual {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); } /* Pop out slightly */
          100% { transform: scale(1); }
        }
        .animate-tapped-visual {
          animation: tapped-visual 0.2s ease-out;
        }

        @keyframes core-hexagon-glow-subtle { /* For C.O.R.E. icon on chest */
          0%, 100% {
            filter: drop-shadow(0 0 2px hsl(var(--bright-gold)/0.5)) drop-shadow(0 0 4px hsl(var(--bright-gold)/0.3));
          }
          50% {
            filter: drop-shadow(0 0 4px hsl(var(--bright-gold)/0.7)) drop-shadow(0 0 8px hsl(var(--bright-gold)/0.5));
          }
        }
        .core-hexagon-glow {
          animation: core-hexagon-glow-subtle 2s infinite ease-in-out;
        }
      `}</style>
    </button>
  );
};

export default CommanderPortrait;
