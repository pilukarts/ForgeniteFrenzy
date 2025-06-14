
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
// Removed Hexagon from lucide-react as we are using an inline SVG

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
    setTimeout(() => setIsTapped(false), 200); // Duration of the tap animation
  };

  const hexagonClipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

  return (
    <button 
      onClick={handleInteraction} 
      onTouchStart={(e) => {
        handleInteraction();
      }}
      className={cn(
        "relative focus:outline-none transition-transform duration-100",
        "w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96", // Increased size
        "bg-transparent core-hexagon-glow", 
        "flex items-center justify-center",
        isTapped ? 'animate-tapped-visual' : 'active:scale-95'
      )}
      style={{ clipPath: hexagonClipPath }}
      aria-label="Tap Commander"
    >
      <Image
        src={imageUrl}
        alt={altText}
        data-ai-hint={dataAiHint}
        width={384} // Corresponds to lg:w-96 (96*4)
        height={384} // Corresponds to lg:h-96 (96*4)
        className="object-contain w-full h-full" 
        priority
        style={{ clipPath: hexagonClipPath }} 
      />
      
      {/* AF Hexagon SVG */}
      <svg
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[150%] h-8 w-8 md:h-10 md:h-10 text-bright-gold/70 opacity-80 pointer-events-none core-hexagon-glow"
      >
        <path
          d="M16 3 L29.856 10 L29.856 24 L16 31 L2.144 24 L2.144 10 Z"
          fill="currentColor"
        />
        <text
          x="50%"
          y="51%" // Slight adjustment for better visual centering
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="10" 
          fontWeight="bold"
          fill="hsl(var(--primary-foreground))" 
          className="pointer-events-none"
        >
          AF
        </text>
      </svg>
      
      <style jsx>{`
        @keyframes tapped-visual {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); } /* Slightly increased pop for larger size */
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

