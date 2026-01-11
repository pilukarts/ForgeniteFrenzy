

// FIREBASE STUDIO - VIBRANT AND DYNAMIC COMPOSITION
// Commander centered + ARK right + Harmonically distributed buttons
// Vibrant environment with holograms that invites to play

"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import PlayerSetup from '@/components/player/PlayerSetup';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { 
  Zap, Share2, Globe, Replace, Music, Music2, Bot, 
  Settings, Users, Star, Crown, Heart, Shield, Target, 
  Trophy, Gamepad2, MessageSquare, ExternalLink, Send, ListChecks, Swords
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import IntroScreen from '@/components/intro/IntroScreen';
import images from '@/lib/placeholder-images.json';
import Link from 'next/link';
import CommanderCenter from '@/components/game/CommanderCenter';
import ArkForgePanel from '@/components/game/ArkForgePanel';
import HolographicMenu from '@/components/game/HolographicMenu';
import { useRouter } from 'next/navigation';


// Image configuration
const IMAGE_PATHS = {
  ark: images.ark.ark,
  background: images.global.main_scene
};

// ARK COUNTDOWN
const ArkCountdown = () => {
  const calculateTimeLeft = () => {
    const launchDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const difference = launchDate.getTime() - now.getTime();
    
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`;
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
    
    // Trigger animations directly
    const commanderDiv = commanderCenterRef.current;
    const auraDiv = auraRef.current;
    if (commanderDiv) {
        commanderDiv.classList.remove('tap-pulse');
        void commanderDiv.offsetWidth; // Trigger reflow
        commanderDiv.classList.add('tap-pulse');
    }
    if (auraDiv) {
        auraDiv.classList.remove('commander-aura-glow');
        void auraDiv.offsetWidth; // Trigger reflow
        auraDiv.classList.add('commander-aura-glow');
    }

    setTimeout(() => {
      if (commanderDiv) commanderDiv.classList.remove('tap-pulse');
      if (auraDiv) auraDiv.classList.remove('commander-aura-glow');
      setTapCount(0);
    }, 500); // Animation duration
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
            initial={{ 
              x: Math.random() * 50 - 25,
              y: Math.random() * 50 - 25,
              opacity: 1, 
              scale: 0.5,
            }}
            animate={{
              y: -100 - (Math.random() * 50),
              opacity: 0,
              scale: 1,
            }}
            transition={{ 
              duration: 1.5, 
              ease: "easeOut"
            }}
            className="absolute top-1/2 left-1/2 pointer-events-none z-50"
          >
            <div className="flex items-center justify-center text-yellow-300 font-bold text-lg drop-shadow-lg">
              <Zap className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              +{Math.floor(playerProfile.pointsPerTap * (1 + (Math.random() * 0.5)))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: `url('${IMAGE_PATHS.background}')`,
            filter: 'brightness(0.8) contrast(1.1)'
          }}
        />
        
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        <div 
            aria-hidden 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border-2 border-white/20"
            style={{
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.1), 0 0 30px rgba(255, 255, 255, 0.05)',
            }}
        />

        {/* Left Connector */}
        <div
            aria-hidden
            className="absolute top-1/2 left-[calc(50%-220px)] -translate-x-full -translate-y-1/2 w-[18vw] max-w-[200px] h-0.5 bg-gradient-to-l from-white/20 via-white/50 to-transparent"
        />

        {/* Right Connector */}
        <div
            aria-hidden
            className="absolute top-1/2 right-[calc(50%-220px)] translate-x-full -translate-y-1/2 w-[18vw] max-w-[200px] h-0.5 bg-gradient-to-r from-white/20 via-white/50 to-transparent"
        />

        <CommanderCenter
            ref={commanderCenterRef}
            auraRef={auraRef}
            fullBodyUrl={playerProfile.avatarUrl}
            onTap={() => handleTapWithAnimation(false)}
            bottomButtons={[
                { id: "change", label: "Change", onClick: toggleCommander },
                { id: "invite", label: "Invite", onClick: handleInviteClick },
            ]}
             leftPanel={<HolographicMenu options={navOptions.map(o => o.label)} onSelect={(label) => handleNavClick(navOptions.find(o => o.label === label)!.path)} side="left" />}
             rightPanel={<ArkForgePanel countdown={timeLeft} />}
             handLeftX={-0.45}
             handRightX={1.45}
        />
        
      </div>
    </>
  );
}
