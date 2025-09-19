
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CommanderPortrait from '@/components/game/CommanderPortrait';
import PlayerSetup from '@/components/player/PlayerSetup';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Zap, AlertTriangle, Trophy, Ship, Share2, Send, Users, Globe, Coffee, Gamepad2, Replace, RefreshCw, Music, Music2, Bot } from 'lucide-react';
import PreIntroScreen from '@/components/intro/PreIntroScreen';
import { useToast } from "@/hooks/use-toast";
import { AURON_COST_FOR_TAP_REFILL, ALL_AVATARS, getLeagueIconAndColor } from '@/lib/gameData';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import IntroScreen from '@/components/intro/IntroScreen';

const formatTimeLeft = (milliseconds: number): string => {
  if (milliseconds <= 0) return "00:00:00";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const ArkCountdown = () => {
    const calculateTimeLeft = () => {
        const launchDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000); // Set 30 days from now
        const now = new Date();
        const difference = launchDate.getTime() - now.getTime();
        
        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
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

    return (
        <Card className="bg-background/70 backdrop-blur-sm p-1.5 w-full text-center">
            <CardContent className="p-1">
                 <div className="relative w-full h-24 mb-2">
                    <Image src="https://i.imgur.com/fs3NHC9.png" alt="Star-Forge Ark" layout="fill" objectFit="contain" className="rounded-md commander-aura-glow" data-ai-hint="colony spaceship" />
                 </div>
                <p className="text-xs text-muted-foreground">ARK LAUNCH IN:</p>
                <div className="text-sm font-bold text-primary tabular-nums">
                    <span>{String(timeLeft.days).padStart(2, '0')}d </span>
                    <span>{String(timeLeft.hours).padStart(2, '0')}h </span>
                    <span>{String(timeLeft.minutes).padStart(2, '0')}m </span>
                    <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
            </CardContent>
        </Card>
    );
};


export default function HomePage() {
  const { playerProfile, isLoading, isInitialSetupDone, handleTap, refillTaps, currentSeason, toggleCommander, toggleMusic, isMusicPlaying, resetGame } = useGame();
  const { toast } = useToast();
  const [timeLeftForTapRegen, setTimeLeftForTapRegen] = useState<number | null>(null);
  
  const spaceImageUrl = "https://i.imgur.com/foWm9FG.jpeg";
  
  useEffect(() => {
    if (!playerProfile) return;
  
    const calculateInitialTime = () => {
        const remaining = (playerProfile.tapsAvailableAt || 0) - Date.now();
        setTimeLeftForTapRegen(Math.max(0, remaining));
    };

    calculateInitialTime();

    const timerId = setInterval(() => {
        setTimeLeftForTapRegen(prevTime => {
            if (prevTime === null) return null;
            if (prevTime <= 1000) {
                if(playerProfile.currentTaps < playerProfile.maxTaps) {
                    const remaining = (playerProfile.tapsAvailableAt || 0) - Date.now();
                    return Math.max(0, remaining);
                }
                return 0;
            }
            return prevTime - 1000;
        });
    }, 1000);

    return () => clearInterval(timerId);
  }, [playerProfile]);

  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone || !playerProfile) {
      return <PlayerSetup />;
  }

  const handleInviteClick = async () => {
    if (!playerProfile.referralCode) return;
    
    const referralLink = `https://forgeitedrenzy.online/?ref=${playerProfile.referralCode}`; 
    const shareData = {
      title: 'Join Alliance Forge!',
      text: `Join my alliance in Forgeite Frenzy and help humanity's escape! Use my link to get a head start.`,
      url: referralLink,
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(referralLink);
            toast({ title: "Referral Link Copied!", description: "Your invite link has been copied." });
        }
    } catch (err) {
        console.error('Share/Copy failed:', err);
        await navigator.clipboard.writeText(referralLink);
        toast({ title: "Referral Link Copied!", description: "Sharing failed, link copied instead." });
    }
  };

  const isOutOfTaps = playerProfile.currentTaps <= 0 && timeLeftForTapRegen !== null && timeLeftForTapRegen > 0;
  
  const seasonProgress = playerProfile.seasonProgress?.[currentSeason.id] ?? 0;
  const { Icon: LeagueIcon, colorClass: leagueColorClass } = getLeagueIconAndColor(playerProfile.league);
  const SeasonIcon = currentSeason.objectiveResourceIcon || Ship;

  return (
    <>
      <div className="relative flex flex-col h-full overflow-hidden flex-grow">
          
          {/* Layer 2: Shooting Stars Container */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              <div className="shooting-star"></div>
              <div className="shooting-star"></div>
              <div className="shooting-star"></div>
          </div>
          
          {/* UI and Game Content */}
          <div className="relative z-10 w-full flex flex-col flex-grow">
             

              <div className="flex-grow flex items-stretch justify-center p-2 gap-2">
                {/* Left Action Bar */}
                <motion.div 
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 50 }}
                    className="hidden md:flex flex-col gap-1.5 w-[180px] flex-shrink-0"
                >
                      <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-background/70 backdrop-blur-sm justify-start gap-1.5 w-full">
                                <Replace className="h-4 w-4" /> Switch Commander
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Switch Commander</DialogTitle>
                            <DialogDescription>Select your active commander. This is a cosmetic change.</DialogDescription>
                          </DialogHeader>
                           <div className="flex justify-around py-4">
                                {ALL_AVATARS.map(avatar => (
                                    <Image 
                                        key={avatar.url} 
                                        src={avatar.url} 
                                        alt={avatar.sex}
                                        width={100} height={100} 
                                        className={cn("rounded-full border-4 cursor-pointer", playerProfile.avatarUrl === avatar.url ? "border-primary" : "border-transparent opacity-70 hover:opacity-100")}
                                        onClick={toggleCommander}
                                        data-ai-hint={`${avatar.sex} commander portrait`}
                                    />
                                ))}
                            </div>
                        </DialogContent>
                      </Dialog>

                      <Button onClick={toggleMusic} variant="outline" size="sm" className="bg-background/70 backdrop-blur-sm justify-start gap-1.5 w-full">
                        {isMusicPlaying ? <Music className="h-4 w-4" /> : <Music2 className="h-4 w-4" />} Music {isMusicPlaying ? "On" : "Off"}
                      </Button>
                      
                      <Card className="bg-background/70 backdrop-blur-sm p-1.5 w-full text-left">
                        <CardContent className="p-0">
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><SeasonIcon className="h-3 w-3" /> {currentSeason.objectiveResourceName}</p>
                            <p className="text-sm font-bold text-primary">{seasonProgress.toLocaleString()}</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-background/70 backdrop-blur-sm p-1.5 w-full text-left">
                        <CardContent className="p-0">
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><Trophy className={cn("h-3 w-3", leagueColorClass)} /> League</p>
                            <p className={cn("text-sm font-bold", leagueColorClass)}>{playerProfile.league}</p>
                        </CardContent>
                      </Card>
                      
                      <Button asChild variant="outline" size="sm" className="bg-background/70 backdrop-blur-sm justify-start gap-1.5 w-full link-glow">
                        <a href="https://allianceforge.online" target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" /> Website
                        </a>
                      </Button>
                      
                      <Button onClick={handleInviteClick} variant="outline" size="sm" className="bg-background/70 backdrop-blur-sm justify-start gap-1.5 w-full link-glow">
                        <Share2 className="h-4 w-4" /> Invite
                      </Button>

                       <Button asChild variant="outline" size="sm" className="bg-background/70 backdrop-blur-sm justify-start gap-1.5 w-full link-glow">
                        <a href="https://t.me/AllianceForgeHQ" target="_blank" rel="noopener noreferrer">
                           <Send className="h-4 w-4" /> Comunidad
                        </a>
                      </Button>
                      
                      <Button asChild variant="outline" size="sm" className="bg-background/70 backdrop-blur-sm justify-start gap-1.5 w-full link-glow">
                        <a href="https://t.me/ForgeiteFrenzyGame_bot" target="_blank" rel="noopener noreferrer">
                           <Bot className="h-4 w-4" /> TG Mini App
                        </a>
                      </Button>

                       <Button asChild variant="outline" size="sm" className="bg-background/70 backdrop-blur-sm justify-start gap-1.5 w-full link-glow">
                        <a href="https://x.com/AllianceForgeHQ" target="_blank" rel="noopener noreferrer">
                          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current mr-1.5"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                          X (Twitter)
                        </a>
                      </Button>
                       <Button asChild variant="outline" size="sm" className="bg-background/70 backdrop-blur-sm justify-start gap-1.5 w-full link-glow">
                        <a href="https://discord.gg/xnWDwGBC" target="_blank" rel="noopener noreferrer">
                          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current mr-1.5"><title>Discord</title><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.446.825-.667 1.284-1.39-1.29-3.91-1.516-3.91-1.516l-.044-.02-3.91 1.516c-.22-.46-.456-.909-.667-1.284a.074.074 0 0 0-.078-.037A19.791 19.791 0 0 0 3.682 4.37a.069.069 0 0 0-.032.023C.543 9.046-.32 13.58.1 18.058a.08.08 0 0 0 .041.058c1.837.775 3.652 1.165 5.447 1.165a12.602 12.602 0 0 0 2.378-.221.074.074 0 0 0 .063-.056c.208-1.01.43-2.06.435-2.22a.074.074_0_0_0-.045-.083c-.933-.424-1.782-1.026-2.52-1.844a.074.074 0 0 1 .018-.11c0-.009.012-.018.036-.027a10.872 10.872 0 0 1 2.982-1.108.074.074 0 0 1 .084.026c.462.632 1.053 1.253 1.725 1.799a.074.074 0 0 0 .084.026c1.13-.39 2.1-1.107 2.982-1.107.012 0 .024.009.036.027a.074.074 0 0 1 .018.11c-.738.818-1.587 1.42-2.52 1.844a.074.074_0_0_0-.045-.083c.005.16.227 1.21.435 2.22a.074.074 0 0 0 .063.056c.792.264 1.582.424 2.378.221 1.795 0 3.61-.39 5.447-1.165a.08.08 0 0 0 .041-.058c.418-4.478-1.242-9.012-4.015-13.664a.069.069 0 0 0-.032-.023zM8.02 15.33c-.94 0-1.7-.76-1.7-1.7s.76-1.7 1.7-1.7 1.7.76 1.7 1.7-.76 1.7-1.7 1.7zm7.96 0c-.94 0-1.7-.76-1.7-1.7s.76-1.7 1.7-1.7 1.7.76 1.7 1.7-.76 1.7-1.7 1.7z" /></svg>
                           Discord
                        </a>
                      </Button>
                </motion.div>

                {/* Main Viewport */}
                <div className="flex-grow flex flex-col items-center justify-center rounded-lg overflow-hidden relative border-2 border-border/20 bg-black">
                     <div 
                        className="absolute inset-0 bg-cover bg-center animate-pan-background"
                        style={{ backgroundImage: `url('${spaceImageUrl}')` }}
                        data-ai-hint="futuristic space background"
                    />
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 50 }}
                        className="w-full text-center my-2 md:my-3"
                    >
                        <p className="text-xl sm:text-2xl font-semibold text-primary font-headline">
                        Taps: {playerProfile.currentTaps.toLocaleString()} / {playerProfile.maxTaps.toLocaleString()}
                        </p>
                        {isOutOfTaps && timeLeftForTapRegen !== null && (
                        <p className="text-sm sm:text-base text-orange-400 animate-pulse">
                            Regeneration in: {formatTimeLeft(timeLeftForTapRegen)}
                        </p>
                        )}
                    </motion.div>
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="flex-grow flex flex-col items-center justify-center z-10"
                    >
                        <CommanderPortrait 
                            onTap={() => handleTap(false)}
                            onLogoTap={() => handleTap(true)}
                        />

                        {isOutOfTaps && (
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-full max-w-[280px] sm:max-w-xs bg-destructive/20 border border-destructive/50 text-destructive-foreground p-2 sm:p-3 rounded-lg shadow-lg space-y-1.5 text-center mt-2 sm:mt-4 z-40"
                            >
                                <div className="flex items-center justify-center gap-1.5">
                                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
                                    <p className="font-bold text-sm sm:text-base">Tap Energy Depleted!</p>
                                </div>
                                <p className="text-xs sm:text-sm">Wait for regeneration or refill your taps with Auron.</p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Right Action Bar */}
                 <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 50 }}
                    className="hidden md:flex flex-col gap-1.5 w-[180px] flex-shrink-0"
                >
                    <ArkCountdown />
                </motion.div>
              </div>
          </div>

          <style jsx>{`
              @keyframes pan-background {
                  0% { background-position: 0% 50%; transform: scale(1.1); }
                  50% { background-position: 5% 55%; transform: scale(1.15); }
                  100% { background-position: 0% 50%; transform: scale(1.1); }
              }
              .animate-pan-background {
                  animation: pan-background 120s linear infinite;
              }
              .shooting-star {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  width: 3px;
                  height: 3px;
                  background: #fff;
                  border-radius: 50%;
                  box-shadow: 0 0 0 4px rgba(255,255,255,0.1), 0 0 0 8px rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255,1);
                  animation: animate-star 3s linear infinite;
              }
              .shooting-star::before {
                  content: '';
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  width: 300px;
                  height: 1px;
                  background: linear-gradient(90deg, #fff, transparent);
              }
              
              .shooting-star:nth-child(1) {
                  top: 0;
                  right: 0;
                  left: initial;
                  animation-delay: 0s;
                  animation-duration: 5s;
              }
              .shooting-star:nth-child(2) {
                  top: 10%;
                  right: 400px;
                  left: initial;
                  animation-delay: 1.4s;
                  animation-duration: 4.5s;
              }
              .shooting-star:nth-child(3) {
                  top: 80px;
                  right: 0;
                  left: initial;
                  animation-delay: 2.8s;
                  animation-duration: 6s;
              }

              @keyframes animate-star {
                  0% {
                      transform: rotate(315deg) translateX(0);
                      opacity: 1;
                  }
                  70% {
                      opacity: 1;
                  }
                  100% {
                      transform: rotate(315deg) translateX(-1500px);
                      opacity: 0;
                  }
              }
          `}</style>
        </div>
    </>
  );
}

    

    