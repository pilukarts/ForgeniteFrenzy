
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
        handleInteraction();
      }}
      className={cn(
        "relative focus:outline-none transition-transform duration-100",
        "w-52 h-52 md:w-60 md:h-60 lg:w-[272px] lg:h-[272px]", 
        "bg-transparent core-hexagon-glow", // Use core-hexagon-glow for a hexagonal pulse
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
        width={272} 
        height={272} 
        className="object-contain w-full h-full" 
        priority
        style={{ clipPath: hexagonClipPath }} // Clip the image itself too
      />
      {/* C.O.R.E. Icon (the small hexagon) */}
      <Hexagon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[150%] h-6 w-6 md:h-8 md:h-8 text-bright-gold/70 opacity-80 pointer-events-none core-hexagon-glow" />
      
      <style jsx>{`
        @keyframes tapped-visual {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .animate-tapped-visual {
          animation: tapped-visual 0.2s ease-out;
        }
        
        /* core-hexagon-glow is defined in globals.css and should work well with filter: drop-shadow for hexagons */
      `}</style>
    </button>
  );
};

export default CommanderPortrait;
