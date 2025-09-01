"use client";

import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

const IntroScreen: React.FC = () => {
  // Use a transparent GIF or a static image for the loading indicator part
  const hexGifUrl = "https://i.imgur.com/8D3wW8E.png"; 

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };
  
  const textVariants = {
     hidden: { opacity: 0 },
     visible: {
      opacity: 1,
      transition: {
        delay: 1, // Delay until after hexagons are likely visible
        duration: 1.5,
      },
    },
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black text-foreground p-4">
      <motion.div 
        className="relative w-48 h-48 md:w-56 md:h-56 mb-8 flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
           <Image
              src="https://i.imgur.com/Knd2EaC.png"
              alt="Alliance Forge Hexagons"
              width={200} 
              height={200} 
              className="object-contain"
              priority
              data-ai-hint="hexagon logo"
            />
        </motion.div>

        <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            variants={textVariants}
        >
            <h1 className="font-headline text-2xl md:text-3xl text-bright-gold drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
                Alliance Forge™
            </h1>
            <p className="font-body text-lg md:text-xl text-foreground -mt-1 tracking-wider">
                <span className="text-blue-400">Forgeite</span> Frenzy
            </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <p className="text-lg font-headline text-primary animate-pulse">
          Initializing Systems...
        </p>
      </motion.div>
    </div>
  );
};

export default IntroScreen;
    