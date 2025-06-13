
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
  
  const maleImageUrl = "https://i.imgur.com/zBtG9vy.png";
  const femaleImageUrl = "https://i.imgur.com/BQHeVWp.png";
  
  const imageUrl = commanderSex === 'male' ? maleImageUrl : femaleImageUrl;
  const altText = commanderSex === 'male' ? "Male Commander" : "Female Commander";
  const dataAiHint = commanderSex === 'male' ? "fullbody male commander" : "fullbody female commander";

  const handleInteraction = () => {
    onTap();
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 150); // Duration of the pulse animation
  };

  return (
    <button 
      onClick={handleInteraction} 
      onTouchStart={handleInteraction} // For mobile tap feel
      className={cn(
        "relative rounded-full focus:outline-none transition-transform duration-100 active:scale-95",
        "w-52 h-52 md:w-60 md:h-60 lg:w-[272px] lg:h-[272px]", // Adjusted size, lg explicit px for image
        "border-0 shadow-none bg-transparent",
        "animate-pulse-neon-blue flex items-center justify-center" // Added flex centering
      )}
      aria-label="Tap Commander"
    >
      <Image
        src={imageUrl}
        alt={altText}
        data-ai-hint={dataAiHint}
        width={272} 
        height={272} 
        className="rounded-full object-contain w-full h-full" 
        priority
      />
      {/* C.O.R.E. icon on chest - Adjusted vertical position */}
      <Hexagon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[150%] h-10 w-10 text-bright-gold/70 opacity-80 pointer-events-none core-hexagon-glow" />
      
      {isTapped && (
        <div className="absolute inset-0 rounded-full bg-bright-gold/30 animate-ping-once" style={{ animationDuration: '150ms' }}></div>
      )}
      <style jsx>{`
        @keyframes ping-once {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 0.3; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-ping-once {
          animation: ping-once;
        }

        @keyframes core-hexagon-glow-subtle {
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
