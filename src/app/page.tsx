
"use client";
import React, { useState, useEffect, useRef } from 'react';
import PlayerSetup from '@/components/player/PlayerSetup';
import { useGame } from '@/contexts/GameContext';
import { Zap } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import IntroScreen from '@/components/intro/IntroScreen';
import images from '@/lib/placeholder-images.json';
import CommanderCenter from '@/components/game/CommanderCenter';
import ArkForgePanel from '@/components/game/ArkForgePanel';
import HolographicMenu from '@/components/game/HolographicMenu';
import HolographicButton from '@/components/game/HolographicButton';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ArkCountdown = () => {
  const [timeLeft, setTimeLeft] = useState("30d 0h 0m");
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date();
      launchDate.setDate(launchDate.getDate() + 30);
      const difference = launchDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        return `${days}d ${hours}h ${minutes}m`;
      }
      return "00d 00h 00m";
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);
    return () => clearInterval(timer);
  }, []);

  return <span>{timeLeft}</span>;
};

export default function HomePage() {
  const { playerProfile, isLoading, isInitialSetupDone, handleTap, toggleCommander } = useGame();
  const { toast } = useToast();
  const router = useRouter();
  const [tapCount, setTapCount] = useState(0);
  const commanderCenterRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  if (isLoading) return <IntroScreen />;
  if (!isInitialSetupDone || !playerProfile) return <PlayerSetup />;

  const handleTapWithAnimation = () => {
    setTapCount(prev => prev + 1);
    handleTap(false);
    
    const cmdr = commanderCenterRef.current?.querySelector('.commander-img-container');
    const aura = auraRef.current;
    
    if (cmdr) {
        cmdr.classList.remove('tap-pulse');
        void (cmdr as HTMLElement).offsetWidth; 
        cmdr.classList.add('tap-pulse');
    }
    
    if (aura) {
        aura.classList.remove('commander-aura-glow');
        void (aura as HTMLElement).offsetWidth; 
        aura.classList.add('commander-aura-glow');
    }
    
    setTimeout(() => setTapCount(0), 500);
  };

  const navOptions = [
    { label: 'Missions', path: '/quests'},
    { label: 'Rewards', path: '/battle-pass'},
    { label: 'Community', path: '/community'},
    { label: 'Alliance', path: '/alliance-chat'},
  ];

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col items-center bg-slate-950">
      <AnimatePresence>
        {tapCount > 0 && Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`pt-${i}-${tapCount}`}
            initial={{ x: Math.random() * 60 - 30, y: -20, opacity: 1, scale: 0.6 }}
            animate={{ y: -200, opacity: 0, scale: 1.3 }}
            className="absolute top-1/2 left-1/2 pointer-events-none z-50"
          >
            <div className="flex items-center text-yellow-300 font-bold text-2xl drop-shadow-[0_0_12px_rgba(255,215,0,0.9)]">
              <Zap className="w-6 h-6 fill-current mr-1" />
              +{Math.floor(playerProfile.pointsPerTap || 1)}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* FONDO ESPACIAL - NEBULOSA Y PLANETAS (FAVORITO DEL JEFE) */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={images.global.main_scene}
          alt="Deep Space Nebula"
          fill
          priority
          unoptimized
          className="object-cover transition-opacity duration-1000 opacity-90"
          data-ai-hint="nebula planets"
        />
        {/* Overlay para profundidad sin oscurecer demasiado */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
      </div>
      
      {/* PLATAFORMA DE SUELO SÓLIDA RECTANGULAR - ELEVADA Y ESPACIOSA */}
      <div className="absolute bottom-0 left-0 right-0 h-[28%] z-10">
          <div className="w-full h-full bg-gradient-to-t from-black via-gray-900 to-gray-800/80 border-t-4 border-primary/40 flex flex-col items-center pt-8 shadow-[0_-30px_100px_rgba(0,0,0,1)]">
              {/* Línea de energía táctica central */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
              
              <div className="flex gap-8 sm:gap-16 px-4 w-full justify-center mt-6 max-w-5xl">
                   <HolographicButton label="Change" onClick={toggleCommander} className="w-48 md:w-56 h-14 text-xl shadow-primary/20" />
                   <HolographicButton label="Invite" onClick={() => toast({title: "Invite Link Copied"})} className="w-48 md:w-56 h-14 text-xl shadow-primary/20" />
              </div>
          </div>
      </div>

      <CommanderCenter
          ref={commanderCenterRef}
          auraRef={auraRef}
          fullBodyUrl={playerProfile.avatarUrl || images.commanders.male_full}
          onTap={handleTapWithAnimation}
          leftPanel={<HolographicMenu options={navOptions.map(o => o.label)} onSelect={(l) => router.push(navOptions.find(o => o.label === l)!.path)} side="left" />}
          rightPanel={<ArkForgePanel countdown={<ArkCountdown />} />}
          /* SEPARACIÓN TÁCTICA MÁXIMA PARA EVITAR "TIGHTNESS" */
          handLeftX={-2.2} 
          handRightX={3.2}
          handY={0.35}
          className="mt-0"
      />
    </div>
  );
}
