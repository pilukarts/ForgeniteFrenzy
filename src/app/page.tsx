
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

const ArkCountdown = () => {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
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
  return timeLeft;
};

export default function HomePage() {
  const { playerProfile, isLoading, isInitialSetupDone, handleTap, toggleCommander } = useGame();
  const { toast } = useToast();
  const router = useRouter();
  const [tapCount, setTapCount] = useState(0);
  const timeLeft = ArkCountdown();
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
    <>
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

      <div className="relative h-full w-full overflow-hidden flex flex-col items-center bg-gray-950">
        {/* FONDO ESPACIAL - ESCENA DE EVACUACIÓN (SPACE STATION BRIDGE) */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url('${images.global.main_scene}')`, 
            filter: 'brightness(0.7) contrast(1.1)' 
          }}
          data-ai-hint="space station bridge"
        />
        
        {/* PLATAFORMA DE SUELO SÓLIDA RECTANGULAR - ELEVADA Y ESPACIOSA */}
        <div className="absolute bottom-0 left-0 right-0 h-[26%] z-10">
            <div className="w-full h-full bg-gradient-to-t from-black via-gray-950 to-gray-900/60 border-t-2 border-primary/30 flex flex-col items-center pt-8 shadow-[0_-20px_80px_rgba(0,0,0,1)]">
                {/* Línea de energía táctica */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                
                <div className="flex gap-6 sm:gap-12 px-4 w-full justify-center mt-4 max-w-4xl">
                     <HolographicButton label="Change" onClick={toggleCommander} className="w-44 md:w-52 h-12 text-lg" />
                     <HolographicButton label="Invite" onClick={() => toast({title: "Invite Link Copied"})} className="w-44 md:w-52 h-12 text-lg" />
                </div>
            </div>
        </div>

        <CommanderCenter
            ref={commanderCenterRef}
            auraRef={auraRef}
            fullBodyUrl={playerProfile.avatarUrl || images.commanders.male_full}
            onTap={handleTapWithAnimation}
            leftPanel={<HolographicMenu options={navOptions.map(o => o.label)} onSelect={(l) => router.push(navOptions.find(o => o.label === l)!.path)} side="left" />}
            rightPanel={<ArkForgePanel countdown={timeLeft} />}
            /* Alejamos los paneles para evitar que estén muy apretados */
            handLeftX={-1.3} 
            handRightX={2.3}
            handY={0.35}
            className="mt-0"
        />
      </div>
    </>
  );
}
