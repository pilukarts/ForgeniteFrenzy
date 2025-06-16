
"use client";

import Image from 'next/image';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface PreIntroScreenProps {
  onCompletion: () => void;
}

const PreIntroScreen: React.FC<PreIntroScreenProps> = ({ onCompletion }) => {
  const femaleCommanderImg = "https://i.imgur.com/BQHeVWp.png";
  const maleCommanderImg = "https://i.imgur.com/iuRJVBZ.png";

  useEffect(() => {
    const timer = setTimeout(() => {
      onCompletion();
    }, 3500); // Show for 3.5 seconds

    return () => clearTimeout(timer);
  }, [onCompletion]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-background text-foreground p-4"
    >
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl md:text-4xl font-headline text-primary mb-10 text-center"
      >
        Commanders of the Alliance
      </motion.h2>
      <div className="flex flex-col md:flex-row items-center justify-around w-full max-w-2xl lg:max-w-3xl gap-8 md:gap-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5, type: "spring", stiffness: 120 }}
          className="flex flex-col items-center p-4 bg-card/30 rounded-xl shadow-2xl border border-primary/50"
        >
          <Image
            src={femaleCommanderImg}
            alt="Female Commander"
            width={180} 
            height={180}
            className="rounded-lg object-contain"
            data-ai-hint="female soldier portrait"
            priority
          />
          {/* <p className="mt-3 text-lg text-foreground font-medium">Commander Aella</p> */}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5, type: "spring", stiffness: 120 }}
          className="flex flex-col items-center p-4 bg-card/30 rounded-xl shadow-2xl border border-primary/50"
        >
          <Image
            src={maleCommanderImg}
            alt="Male Commander"
            width={180}
            height={180}
            className="rounded-lg object-contain"
            data-ai-hint="male soldier portrait"
            priority
          />
          {/* <p className="mt-3 text-lg text-foreground font-medium">Commander Rex</p> */}
        </motion.div>
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-12 text-muted-foreground text-md"
      >
        Prepare for assignment...
      </motion.p>
    </motion.div>
  );
};

export default PreIntroScreen;
