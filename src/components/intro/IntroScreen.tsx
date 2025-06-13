
"use client";

import Image from 'next/image';
import React from 'react';

const IntroScreen: React.FC = () => {
  const introImageUrl = "https://i.imgur.com/qD89qQX.jpeg"; 
  const loadingGifUrl = "https://i.imgur.com/whIPW0y.gif";

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="relative w-full max-w-lg md:max-w-xl mb-8 animate-fade-in-slow">
        <Image
          src={introImageUrl}
          alt="Alliance Forge: Forgeite Frenzy"
          width={1280} 
          height={720} 
          className="object-contain" // Ensure image scales down if too big for container
          layout="responsive" // Keeps aspect ratio
          priority
          data-ai-hint="game logo title"
        />
      </div>
      <div className="relative w-28 h-28 md:w-32 md:h-32 mb-6">
        <Image
          src={loadingGifUrl}
          alt="Loading..."
          layout="fill"
          objectFit="contain"
          unoptimized 
        />
      </div>
      <p className="text-xl font-headline text-primary animate-pulse">
        Initializing Systems...
      </p>
      <style jsx global>{`
        @keyframes fade-in-slow {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-slow {
          animation: fade-in-slow 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default IntroScreen;
