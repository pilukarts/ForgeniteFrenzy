
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

  const hexagonClipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

  return (
    <button 
      onClick={handleInteraction} 
      onTouchStart={(e) => {
        // Allow tap via touch as well
        handleInteraction();
      }}
      className={cn(
        "relative focus:outline-none transition-transform duration-100",
        "w-60 h-60 md:w-72 md:h-72 lg:w-80 lg:h-80", // Increased size
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
        width={320} // Corresponds to lg:w-80
        height={320} // Corresponds to lg:h-80
        className="object-contain w-full h-full" 
        priority
        style={{ clipPath: hexagonClipPath }} 
      />
      <Hexagon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[150%] h-8 w-8 md:h-10 md:h-10 text-bright-gold/70 opacity-80 pointer-events-none core-hexagon-glow" />
      
      <style jsx>{`
        @keyframes tapped-visual {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
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
