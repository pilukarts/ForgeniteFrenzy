
"use client";

import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

const IntroScreen: React.FC = () => {
  const introImageUrl = "https://i.imgur.com/h8XfylD.png"; 
  const loadingGifUrl = "https://i.imgur.com/whIPW0y.gif";

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background text-foreground p-4">
      <motion.div 
        className="relative w-full max-w-sm md:max-w-md mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src={introImageUrl}
          alt="Alliance Forge: Forgeite Frenzy"
          width={1280} 
          height={720} 
          className="object-contain mx-auto"
          layout="responsive" 
          priority
          data-ai-hint="game logo title"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="relative w-16 h-16 md:w-20 md:h-20 mb-4">
          <Image
            src={loadingGifUrl}
            alt="Loading..."
            layout="fill"
            objectFit="contain"
            unoptimized 
          />
        </div>
        <p className="text-lg font-headline text-primary animate-pulse">
          Initializing Systems...
        </p>
      </motion.div>
    </div>
  );
};

export default IntroScreen;

    