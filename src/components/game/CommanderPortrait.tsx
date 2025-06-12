
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
  
  const imageUrl = commanderSex === 'male' 
    ? "https://i.imgur.com/zBtG9vy.png" 
    : "https://i.imgur.com/dXHw4zJ.png";
  
  const altText = commanderSex === 'male' ? "Male Commander" : "Female Commander";
  const dataAiHint = commanderSex === 'male' ? "fullbody male commander" : "fullbody female commander"; // Updated hint

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
        "w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64" // Responsive size
        // Removed: "border-4 border-primary/50 shadow-lg"
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
      {isTapped && (
        <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping-once" style={{ animationDuration: '150ms' }}></div>
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
      `}</style>
    </button>
  );
};

export default CommanderPortrait;
