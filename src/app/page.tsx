// FIREBASE STUDIO - COMMAND CENTER REFINED
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


// Image configuration
const IMAGE_PATHS = {
  background: images.global.main_scene
};

// ARK COUNTDOWN
const ArkCountdown = () => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        return `${days}d ${hours}h ${minutes}m`;
      }
      return "00d 00h 00m";
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return timeLeft;
};

export default function HomePage() {
  const { 
    playerProfile, 
    isLoading, 
    isInitialSetupDone, 
    handleTap, 
    toggleCommander, 
  } = useGame();
  const { toast } = useToast();
  const router = useRouter();
  
  const [tapCount, setTapCount] = useState(0);
  const timeLeft = ArkCountdown();
  const commanderCenterRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);


  if (isLoading) return <IntroScreen />;
  if (!isInitialSetupDone || !playerProfile) return <PlayerSetup />;

  const handleTapWithAnimation = (isLogoTap: boolean) => {
    setTapCount(prev => prev + 1);
    handleTap(isLogoTap);
    
    // Trigger animations
    const commanderDiv = commanderCenterRef.current?.querySelector('.commander-img-container');
    const auraDiv = auraRef.current;
    
    if (commanderDiv) {
        commanderDiv.classList.remove('tap-pulse');
        void (commanderDiv as HTMLElement).offsetWidth; 
        commanderDiv.classList.add('tap-pulse');
    }
    if (auraDiv) {
        auraDiv.classList.remove('commander-aura-glow');
        void (auraDiv as HTMLElement).offsetWidth; 
        auraDiv.classList.add('commander-aura-glow');
    }

    setTimeout(() => {
      setTapCount(0);
    }, 500);
  };

  const handleNavClick = (path: string) => {
    router.push(path);
  }

  const handleInviteClick = async () => {
    if (!playerProfile.referralCode) return;
    
    const referralLink = `https://forgeite-frenzy.web.app/?ref=${playerProfile.referralCode}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join Alliance Forge!',
          text: 'Join my alliance in Forgeite Frenzy!',
          url: referralLink,
        });
      } else {
        await navigator.clipboard.writeText(referralLink);
        toast({ title: "Referral Link Copied!", description: "Your invite link has been copied." });
      }
    } catch (err) {
      await navigator.clipboard.writeText(referralLink);
      toast({ title: "Sharing failed, link copied instead." });
    }
  };
  
  const navOptions = [
    { label: 'Missions', path: '/quests'},
    { label: 'Rewards', path: '/battle-pass'},
    { label: 'Community', path: '/community'},
    { label: 'Alliance', path: '/alliance-chat'},
  ]


  return (
    <>
      <AnimatePresence>
        {tapCount > 0 && Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`point-${i}-${tapCount}`}
            initial={{ x: Math.random() * 50 - 25, y: -20, opacity: 1, scale: 0.5 }}
            animate={{ y: -150 - (Math.random() * 50), opacity: 0, scale: 1.2 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 pointer-events-none z-50"
          >
            <div className="flex items-center justify-center text-yellow-300 font-bold text-xl drop-shadow-lg">
              <Zap className="w-5 h-5 text-yellow-400 fill-current mr-1" />
              +{Math.floor(playerProfile.pointsPerTap * (1 + (Math.random() * 0.5)))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="relative h-full w-full overflow-hidden flex flex-col items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: `url('${IMAGE_PATHS.background}')`,
            filter: 'brightness(0.7) contrast(1.2)'
          }}
        />
        
        {/* Floor Platform - The Commander's Deck */}
        <div className="absolute bottom-0 left-0 right-0 h-[20%] z-10">
            {/* The "Rectangle" floor piece */}
            <div className="w-full h-full bg-gradient-to-t from-gray-950 via-gray-900 to-transparent border-t border-white/20 flex flex-col items-center justify-center">
                {/* Deck visual accents */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_15px_rgba(255,215,0,0.3)]" />
                
                {/* Floor Buttons - Styled like the side menus */}
                <div className="flex gap-4 sm:gap-12 mt-4">
                     <HolographicButton label="Change" onClick={toggleCommander} className="w-36 sm:w-44 border-white/40" />
                     <HolographicButton label="Invite" onClick={handleInviteClick} className="w-36 sm:w-44 border-white/40" />
                </div>
            </div>
        </div>

        {/* Central Circular Decor */}
        <div 
            aria-hidden 
            className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full border border-white/10"
            style={{ boxShadow: '0 0 40px rgba(255, 255, 255, 0.05)' }}
        />

        <CommanderCenter
            ref={commanderCenterRef}
            auraRef={auraRef}
            fullBodyUrl={playerProfile.avatarUrl}
            onTap={() => handleTapWithAnimation(false)}
            bottomButtons={[]} 
             leftPanel={<HolographicMenu options={navOptions.map(o => o.label)} onSelect={(label) => handleNavClick(navOptions.find(o => o.label === label)!.path)} side="left" />}
             rightPanel={<ArkForgePanel countdown={timeLeft} />}
             handLeftX={-0.35}
             handRightX={1.4}
             className="mt-[-8vh]"
        />
      </div>
    </>
  );
}
