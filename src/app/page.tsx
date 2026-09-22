// FIREBASE STUDIO - VIBRANT AND DYNAMIC COMPOSITION
// Commander centered + ARK right + Harmonically distributed buttons
// Vibrant environment with holograms that invites to play

"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CommanderPortrait from '@/components/game/CommanderPortrait';
import PlayerSetup from '@/components/player/PlayerSetup';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { 
  Zap, Share2, Globe, Replace, Music, Music2, Bot, 
  Settings, Users, Star, Crown, Heart, Shield, Target, 
  Trophy, Gamepad2, MessageSquare, ExternalLink, Send
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import IntroScreen from '@/components/intro/IntroScreen';
import images from '@/lib/placeholder-images.json';
import { POINTS_PER_TAP } from '@/lib/gameData';

// Image configuration
const IMAGE_PATHS = {
  ark: images.ark.ark,
  background: images.global.main_scene
};

// ULTRA VIBRANT HOLOGRAPHIC BUTTON
const HolographicButton = ({ 
  children, 
  onClick, 
  icon: Icon, 
  color = "blue", 
  className = "",
  size = "default",
  floating = false,
  asChild = false,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: any;
  color?: "blue" | "purple" | "green" | "orange" | "pink" | "gold" | "red" | "teal";
  className?: string;
  size?: "default" | "small" | "large";
  floating?: boolean;
  asChild?: boolean;
  [key: string]: any;
}) => {
  const colors = {
    blue: "from-blue-500/30 via-blue-600/30 to-purple-500/30 border-blue-400/70 hover:border-blue-300 shadow-blue-500/50",
    purple: "from-purple-500/30 via-purple-600/30 to-pink-500/30 border-purple-400/70 hover:border-purple-300 shadow-purple-500/50",
    green: "from-green-500/30 via-green-600/30 to-teal-500/30 border-green-400/70 hover:border-green-300 shadow-green-500/50",
    orange: "from-orange-500/30 via-orange-600/30 to-red-500/30 border-orange-400/70 hover:border-orange-300 shadow-orange-500/50",
    pink: "from-pink-500/30 via-pink-600/30 to-purple-500/30 border-pink-400/70 hover:border-pink-300 shadow-pink-500/50",
    gold: "from-yellow-500/30 via-amber-500/30 to-orange-500/30 border-yellow-400/70 hover:border-yellow-300 shadow-yellow-500/50",
    red: "from-red-500/30 via-red-600/30 to-pink-500/30 border-red-400/70 hover:border-red-300 shadow-red-500/50",
    teal: "from-teal-500/30 via-teal-600/30 to-cyan-500/30 border-teal-400/70 hover:border-teal-300 shadow-teal-500/50"
  };
  
  const sizes = {
    small: "px-3 py-2 text-xs",
    default: "px-4 py-3 text-sm",
    large: "px-6 py-4 text-base"
  };

  const colorClass = colors[color] || colors.blue;
  const sizeClass = sizes[size];
  const Comp = asChild ? motion.div : motion.button;
  
  return (
    <Comp
      onClick={onClick}
      whileHover={{ 
        scale: 1.08,
        y: floating ? -8 : -2,
        rotate: floating ? [0, 2, -2, 0] : 0
      }}
      whileTap={{ scale: 0.92 }}
      animate={{
        y: floating ? [0, -5, 0] : 0,
        rotate: floating ? [0, 1, -1, 0] : 0
      }}
      transition={{
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
      className={`
        relative ${floating ? 'animate-pulse' : ''} ${sizeClass}
        bg-gradient-to-br ${colorClass}
        rounded-2xl backdrop-blur-xl border-2
        shadow-2xl hover:shadow-[0_0_30px_rgba(59,130,246,0.8)]
        transition-all duration-300 text-white font-bold
        overflow-hidden group transform-gpu
        ${floating ? 'shadow-lg shadow-primary/20' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Multiple layers of holographic shine */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 group-hover:from-white/15 transition-all duration-300" />
      
      {/* Floating particles */}
      {floating && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 bg-white/60 rounded-full`}
              style={{
                left: `${20 + i * 30}%`,
                top: `${20 + i * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2 z-10">
        {Icon && <Icon className={`${size === 'large' ? 'h-6 w-6' : size === 'small' ? 'h-3 w-3' : 'h-4 w-4'}`} />}
        <span className={`${size === 'small' ? 'text-xs' : size === 'large' ? 'text-base' : 'text-sm'} font-bold`}>
          {children}
        </span>
      </div>
    </Comp>
  );
};

// ENHANCED ARK COMPONENT
const EnhancedArk = ({ onTap, timeLeft, tapCount }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    className="relative cursor-pointer group"
    onClick={onTap}
    whileHover={{ scale: 1.05, rotate: 2 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className={`
      relative overflow-hidden
      bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 backdrop-blur-xl
      border-2 border-indigo-400/80 hover:border-indigo-300/90
      rounded-3xl shadow-2xl shadow-indigo-500/60 hover:shadow-indigo-500/80
      transition-all duration-300 p-4 text-center group-hover:scale-105
    `}>
      {/* Energy effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-400/20 via-transparent to-purple-600/20 animate-pulse" />
      
      <CardContent className="p-0 flex flex-col items-center space-y-3 relative z-10">
        {/* Ark Image with effects */}
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/40 to-purple-500/40 rounded-full animate-pulse blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-full" />
          <Image 
            src={IMAGE_PATHS.ark}
            alt="Star-Forge Ark" 
            width={80}
            height={80}
            style={{objectFit: 'contain'}} 
            unoptimized
            className="drop-shadow-2xl filter brightness-125 contrast-110 animate-pulse"
          />
        </div>
        
        {/* Text with glow */}
        <div className="text-center">
          <p className="text-sm font-bold text-white mb-1 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]">
            ARK EVACUATION
          </p>
          <p className="text-xs text-indigo-200 font-bold drop-shadow-md">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
          </p>
        </div>
      </CardContent>
      
      {/* Tap indicator */}
      {tapCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-0.5 rounded-full text-xs font-bold shadow-xl"
        >
          +{tapCount * 5} ⚡
        </motion.div>
      )}
    </div>
  </motion.div>
);

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

  return timeLeft;
};

export default function HomePage() {
  const { 
    playerProfile, 
    isLoading, 
    isInitialSetupDone, 
    handleTap, 
    getUpgradeLevel,
    toggleCommander, 
    toggleMusic, 
    isMusicPlaying 
  } = useGame();
  const { toast } = useToast();
  
  // Local states
  const [tapCount, setTapCount] = useState(0);
  const timeLeft = ArkCountdown();

  if (isLoading) return <IntroScreen />;
  if (!isInitialSetupDone || !playerProfile) return <PlayerSetup />;

  // Enhanced tap function
  const handleTapWithAnimation = (isLogoTap: boolean) => {
    setTapCount(prev => prev + 1);
    handleTap(isLogoTap);
    
    setTimeout(() => {
      setTapCount(0);
    }, 2500);
  };


  // Invite function
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
      toast({ title: "Referral Link Copied!", description: "Sharing failed, link copied instead." });
    }
  };

  return (
    <>
      {/* Enhanced animated points */}
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
              +{POINTS_PER_TAP + getUpgradeLevel('tapPower')}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="relative h-screen w-full overflow-hidden">
        {/* Enhanced background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: `url('${IMAGE_PATHS.background}')`,
            filter: 'brightness(0.8) contrast(1.1)'
          }}
        />
        
        {/* Background particle effects */}
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

        {/* MAIN CONTENT WITH DYNAMIC COMPOSITION */}
        <div className="relative h-full flex flex-col items-center justify-center">

          {/* MAIN AREA - HARMONIC COMPOSITION */}
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* CENTERED COMMANDER - MAIN ELEMENT */}
            <motion.div
              className="absolute"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="relative cursor-pointer group"
                   onClick={() => handleTapWithAnimation(false)}>
                
                {/* Commander main aura */}
                <motion.div
                  className="absolute -inset-4 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 40px hsla(var(--dynamic-commander-glow), 0.4)',
                      '0 0 70px hsla(var(--dynamic-commander-glow), 0.7)',
                      '0 0 40px hsla(var(--dynamic-commander-glow), 0.4)'
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-56 h-56 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/20 to-pink-500/10 blur-2xl" />
                </motion.div>

                {/* Main circle - larger */}
                <motion.div
                  className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/80 shadow-2xl"
                  animate={tapCount > 0 ? { 
                    scale: [1, 1.05, 1],
                    rotate: [0, 1, -1, 0]
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <CommanderPortrait onTap={() => handleTapWithAnimation(false)} onLogoTap={() => handleTapWithAnimation(true)}/>
                </motion.div>
                
                {/* Commander change button */}
                <motion.button
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-primary/90 to-purple-500/80 backdrop-blur-xl rounded-full border border-primary/60 shadow-2xl text-sm font-bold text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCommander();
                  }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Change
                </motion.button>
              </div>
            </motion.div>

            {/* ARK - RIGHT UPPER */}
            <motion.div
              className="absolute top-20 right-8 hidden lg:block"
              initial={{ opacity: 0, x: 100, rotate: 15 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <EnhancedArk 
                onTap={() => handleTapWithAnimation(true)}
                timeLeft={timeLeft}
                tapCount={tapCount}
              />
            </motion.div>

            {/* HARMONICALLY DISTRIBUTED BUTTONS */}
            
            {/* Upper left area - Main actions */}
            <motion.div
              className="absolute top-12 left-8 space-y-4"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <HolographicButton 
                onClick={toggleMusic} 
                icon={isMusicPlaying ? Music : Music2}
                color="purple"
                floating
              >
                Sound
              </HolographicButton>
              
              <HolographicButton 
                onClick={handleInviteClick} 
                icon={Share2}
                color="blue"
                floating
              >
                Alliance
              </HolographicButton>
            </motion.div>

            {/* Lower left area - Game actions */}
            <motion.div
              className="absolute bottom-16 left-8 space-y-4"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <HolographicButton 
                icon={Gamepad2}
                color="green"
                floating
              >
                Missions
              </HolographicButton>
              
              <HolographicButton 
                icon={Trophy}
                color="gold"
                floating
              >
                Rewards
              </HolographicButton>
            </motion.div>

            {/* Lower right area - Social */}
            <motion.div
              className="absolute bottom-16 right-8 space-y-4"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              <a href="https://t.me/AllianceForgeHQ" target="_blank" rel="noopener noreferrer">
                <HolographicButton 
                  icon={Send}
                  color="teal"
                  floating
                  asChild
                >
                  Community
                </HolographicButton>
              </a>
              
              <HolographicButton 
                icon={MessageSquare}
                color="red"
                floating
              >
                Chat
              </HolographicButton>
            </motion.div>

            {/* Central upper area - Navigation */}
            <motion.div
              className="absolute top-8 left-1/2 transform -translate-x-1/2 flex gap-4"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <a href="https://allianceforge.online" target="_blank" rel="noopener noreferrer">
                <HolographicButton 
                  icon={Globe}
                  color="orange"
                  size="default"
                  floating
                  asChild
                >
                  Web Portal
                </HolographicButton>
              </a>
              
              <a href="https://t.me/ForgeiteFrenzyGame_bot" target="_blank" rel="noopener noreferrer">
                <HolographicButton 
                  icon={Bot}
                  color="pink"
                  size="default"
                  floating
                  asChild
                >
                  Mini App
                </HolographicButton>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
