
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
        // e.preventDefault(); // Prevent default touch behavior like scrolling or double-tap zoom if needed
        handleInteraction();
      }}
      className={cn(
        "relative focus:outline-none transition-transform duration-100",
        "w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[440px] lg:h-[440px]", // Consistent large size
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
        width={440} 
        height={440}
        className="object-contain w-full h-full" 
        priority
        style={{ clipPath: hexagonClipPath }} 
      />
      
      <svg
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%] h-10 w-10 md:h-12 md:w-12 text-bright-gold/70 opacity-80 pointer-events-none core-hexagon-glow"
      >
        <path
          d="M16 3 L29.856 10 L29.856 24 L16 31 L2.144 24 L2.144 10 Z"
          fill="currentColor"
        />
        <text
          x="50%"
          y="51%" 
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

