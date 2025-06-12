
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
  
  const imageUrl = commanderSex === 'male' 
    ? "https://i.imgur.com/zBtG9vy.png" 
    : "https://i.imgur.com/BQHeVWp.png"; 
  
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
        "w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64", // Responsive size
        "border-0 shadow-none" // Make the circle invisible
      )}
      aria-label="Tap Commander"
    >
      <Image
        src={imageUrl}
        alt={altText}
        data-ai-hint={dataAiHint}
        width={256}
        height={256}
        className="rounded-full object-cover"
        priority
      />
      {/* C.O.R.E. icon on chest */}
      <Hexagon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[25%] h-10 w-10 text-bright-gold/70 opacity-80 pointer-events-none core-hexagon-glow" />
      
      {isTapped && (
        <div className="absolute inset-0 rounded-full bg-bright-gold/40 animate-ping-once" style={{ animationDuration: '150ms' }}></div>
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

