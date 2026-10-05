
"use client";

import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import { assetPath } from '@/lib/assetPath';
import images from '@/lib/images';

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
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#02030b] p-4 text-white">
        <div className="absolute inset-0 scale-105 bg-cover bg-center opacity-70" style={{ backgroundImage: `url('${images.global.main_scene}')` }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,116,144,.08),rgba(2,3,11,.92)_75%)]" />
        <motion.div className="absolute h-48 w-[34rem] max-w-[88vw]" initial={{ x: '-90vw', opacity: 0, scale: .7 }} animate={{ x: 0, opacity: 1, scale: 1 }} transition={{ duration: 1.6, ease: 'easeOut' }}>
          <span className="absolute left-0 top-1/2 h-6 w-40 -translate-y-1/2 bg-gradient-to-l from-cyan-200/70 to-transparent blur-lg" />
          <Image src={assetPath('/images/global/ark-carrier.png')} alt="ARK carrier approaching" fill unoptimized className="object-contain drop-shadow-[0_0_28px_rgba(34,211,238,.75)]" />
        </motion.div>
        <motion.div className="absolute inset-x-0 top-0 h-px bg-cyan-200/70 shadow-[0_0_18px_rgba(34,211,238,.9)]" animate={{ y: ['10vh','90vh','10vh'] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} />
        <motion.div 
            className="relative mt-64 flex flex-col items-center justify-center rounded-3xl border border-cyan-300/30 bg-slate-950/70 px-10 py-6 text-center shadow-[0_0_50px_rgba(34,211,238,.18)] backdrop-blur-xl"
            variants={textVariants}
            initial="hidden"
            animate="visible"
        >
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[.45em] text-cyan-300">Humanity awaits its commander</p>
            <h1 className="font-headline text-3xl text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,.55)] md:text-5xl">
                Alliance Forge™
            </h1>
            <p className="mt-1 font-body text-xl tracking-[.18em] text-white md:text-2xl">
              <span className="text-cyan-300">Forgeite</span> Frenzy
            </p>
        </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="relative mt-5 flex flex-col items-center"
      >
        <p className="animate-pulse font-headline text-sm uppercase tracking-[.32em] text-cyan-200">
          Initializing ARK systems...
        </p>
      </motion.div>
    </div>
  );
};

export default IntroScreen;
    
