
"use client";

import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

const IntroScreen: React.FC = () => {

  const textVariants = {
     hidden: { opacity: 0 },
     visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 1.5,
      },
    },
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black text-foreground p-4">
        <motion.div 
            className="flex flex-col items-center justify-center text-center mb-8"
            variants={textVariants}
            initial="hidden"
            animate="visible"
        >
            <h1 className="font-headline text-2xl md:text-3xl text-bright-gold drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
                Alliance Forge™
            </h1>
            <p className="font-body text-lg md:text-xl text-foreground -mt-1 tracking-wider">
              <span className="text-blue-400">Forgeite</span> Frenzy
            </p>
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
    