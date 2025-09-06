

"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AppLayout from '@/components/layout/AppLayout';
import CommanderPortrait from '@/components/game/CommanderPortrait';
import PlayerSetup from '@/components/player/PlayerSetup';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Zap, AlertTriangle, Trophy, Ship, Share2, Send, Users, Globe, Coffee, Gamepad2, Replace } from 'lucide-react';
import PreIntroScreen from '@/components/intro/PreIntroScreen';
import { useToast } from "@/hooks/use-toast";
import { AURON_COST_FOR_TAP_REFILL, ALL_AVATARS } from '@/lib/gameData';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import IntroScreen from '@/components/intro/IntroScreen';


const formatTimeLeft = (milliseconds: number): string => {
  if (milliseconds <= 0) return "00:00";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function HomePage() {
  const { playerProfile, isLoading, isInitialSetupDone, handleTap, refillTaps, currentSeason, toggleCommander } = useGame();
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
                // When the timer hits zero, check the profile again to see if taps were refilled.
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


  // --- Render logic based on setup/loading state ---
  if (!isInitialSetupDone) {
      return <PlayerSetup />;
  }

  if (!playerProfile) {
    return null; // AppLayout will handle the IntroScreen
  }
  
  const handleInviteClick = async () => {
    if (!playerProfile.referralCode) return;
    
    const referralLink = `https://alliance-forge.game/?ref=${playerProfile.referralCode}`; 
    const shareData = {
      title: 'Join Alliance Forge!',
      text: `Join my alliance in Forgeite Frenzy and help humanity's escape! Use my link to get a head start.`,
      url: referralLink,
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            toast({
                title: "Invitation Sent!",
                description: "Your recruitment message is on its way, Commander.",
            });
        } else {
            await navigator.clipboard.writeText(referralLink);
            toast({
                title: "Referral Link Copied!",
                description: "Your invite link has been copied to the clipboard.",
            });
        }
    } catch (err) {
        console.error('Failed to share or copy referral link: ', err);
        try {
            await navigator.clipboard.writeText(referralLink);
            toast({
                title: "Referral Link Copied!",
                description: "Sharing was canceled, so the link was copied instead.",
            });
        } catch (copyErr) {
            console.error('Fallback copy failed: ', copyErr);
            toast({
                title: "Action Failed",
                description: "Could not share or copy the referral link. Please try again.",
                variant: "destructive",
            });
        }
    }
  };


  const isOutOfTaps = playerProfile.currentTaps <= 0 && timeLeftForTapRegen !== null && timeLeftForTapRegen > 0;
  
  return (
    <>
      <AppLayout>
        <div className="relative flex flex-col h-full overflow-hidden">
          {/* Background Layers */}
          <div 
              className="absolute inset-0 bg-black bg-cover bg-center animate-pan-background z-0"
              style={{ backgroundImage: `url('${spaceImageUrl}')` }}
              data-ai-hint="futuristic space background"
          />
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              <div className="shooting-star"></div>
              <div className="shooting-star"></div>
              <div className="shooting-star"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-20" />
          
          {/* UI and Game Content */}
          <div className="relative z-30 w-full flex flex-col flex-grow">
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 50 }}
                className="w-full text-center my-2"
              >
                <p className="text-xl sm:text-2xl font-semibold text-primary font-headline">
                  Taps: {playerProfile.currentTaps} / {playerProfile.maxTaps}
                </p>
                {isOutOfTaps && timeLeftForTapRegen !== null && (
                  <p className="text-sm sm:text-base text-orange-400 animate-pulse">
                    Regeneration in: {formatTimeLeft(timeLeftForTapRegen)}
                  </p>
                )}
              </motion.div>

              <div className="flex flex-grow w-full items-center p-2 sm:p-4">
                  {/* Left Column Buttons */}
                  <motion.div 
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5, type: 'spring', stiffness: 50 }}
                      className="flex flex-col gap-2 w-auto max-w-[150px] sm:max-w-[180px] items-start self-center"
                  >
                      <Button onClick={toggleCommander} variant="outline" size="sm" className="w-full justify-start">
                        <Replace className="mr-2 h-4 w-4" />
                        Switch Commander
                      </Button>
                      <div className="flex items-center gap-2 p-2 rounded-md border border-input bg-background">
                          <Ship className="h-5 w-5 text-primary shrink-0" />
                          <div>
                              <p className="text-xs font-bold text-muted-foreground">{currentSeason.objectiveResourceName}</p>
                              <p className="text-sm text-foreground font-mono">{(playerProfile.seasonProgress[currentSeason.id] || 0).toLocaleString()}</p>
                          </div>
                      </div>
                       <div className="flex items-center gap-2 p-2 rounded-md border border-input bg-background">
                          <Trophy className="h-5 w-5 text-primary shrink-0" />
                          <div className="text-left">
                              <p className="text-xs font-bold text-muted-foreground">League</p>
                              <p className="text-sm text-foreground font-mono">{playerProfile.league}</p>
                          </div>
                      </div>
                      {isOutOfTaps && (
                          <Button onClick={refillTaps} variant="destructive" size="sm" className="w-full justify-start" disabled={playerProfile.auron < AURON_COST_FOR_TAP_REFILL}>
                              <Zap className="mr-2 h-4 w-4"/>
                              Refill ({AURON_COST_FOR_TAP_REFILL})
                          </Button>
                      )}
                      <Button asChild variant="outline" size="sm" className="w-full justify-start">
                          <a href="https://allianceforge.online" target="_blank" rel="noopener noreferrer">
                              <Globe className="mr-2 h-4 w-4"/> Website
                          </a>
                      </Button>
                      <Button onClick={handleInviteClick} variant="outline" size="sm" className="w-full justify-start">
                          <Share2 className="mr-2 h-4 w-4"/> Invite
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full justify-start">
                          <Link href="https://t.me/AllianceForge_esp" target="_blank" rel="noopener noreferrer">
                              <Send className="mr-2 h-4 w-4"/> Comunidad
                          </Link>
                      </Button>
                       <Button asChild variant="outline" size="sm" className="w-full justify-start">
                          <Link href="https://t.me/ForgeiteFrenzyGame_bot" target="_blank" rel="noopener noreferrer">
                              <Gamepad2 className="mr-2 h-4 w-4"/> TG Mini Game
                          </Link>
                      </Button>
                       <Button asChild variant="outline" size="sm" className="w-full justify-start">
                          <Link href="https://x.com/AllianceForgeHQ" target="_blank" rel="noopener noreferrer">
                              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-3 w-3 fill-current">
                              <title>X</title>
                              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                              </svg>
                              X (Twitter)
                          </Link>
                      </Button>
                       <Button asChild variant="outline" size="sm" className="w-full justify-start">
                          <Link href="https://discord.gg/xnWDwGBC" target="_blank" rel="noopener noreferrer">
                              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 fill-current"><title>Discord</title><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.446.825-.667 1.284-1.39-1.29-3.91-1.516-3.91-1.516l-.044-.02-3.91 1.516c-.22-.46-.456-.909-.667-1.284a.074.074 0 0 0-.078-.037A19.791 19.791 0 0 0 3.682 4.37a.069.069 0 0 0-.032.023C.543 9.046-.32 13.58.1 18.058a.08.08 0 0 0 .041.058c1.837.775 3.652 1.165 5.447 1.165a12.602 12.602 0 0 0 2.378-.221.074.074 0 0 0 .063-.056c.208-1.01.43-2.06.435-2.22a.074.074 0 0 0-.045-.083c-.933-.424-1.782-1.026-2.52-1.844a.074.074 0 0 1 .018-.11c0-.009.012-.018.036-.027a10.872 10.872 0 0 1 2.982-1.108.074.074 0 0 1 .084.026c.462.632 1.053 1.253 1.725 1.799a.074.074 0 0 0 .084.026c1.13-.39 2.1-1.107 2.982-1.107.012 0 .024.009.036.027a.074.074 0 0 1 .018.11c-.738.818-1.587 1.42-2.52 1.844a.074.074 0 0 0-.045.083c.005.16.227 1.21.435 2.22a.074.074 0 0 0 .063.056c.792.264 1.582.424 2.378.221 1.795 0 3.61-.39 5.447-1.165a.08.08 0 0 0 .041-.058c.418-4.478-1.242-9.012-4.015-13.664a.069.069 0 0 0-.032-.023zM8.02 15.33c-.94 0-1.7-.76-1.7-1.7s.76-1.7 1.7-1.7 1.7.76 1.7 1.7-.76 1.7-1.7 1.7zm7.96 0c-.94 0-1.7-.76-1.7-1.7s.76-1.7 1.7-1.7 1.7.76 1.7 1.7-.76 1.7-1.7 1.7z" /></svg>
                                  Discord
                          </Link>
                      </Button>
                  </motion.div>

                  {/* Right Column: Commander */}
                  <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 50 }}
                    className="flex-grow flex flex-col items-center justify-center"
                  >
                      <CommanderPortrait onTap={handleTap} />

                      {isOutOfTaps && (
                          <motion.div
                              initial={{ y: 50, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="w-full max-w-[280px] bg-destructive/20 border border-destructive/50 text-destructive-foreground p-2 rounded-lg shadow-lg space-y-1.5 text-center mt-2 z-40"
                          >
                              <div className="flex items-center justify-center gap-1.5">
                                  <AlertTriangle className="h-4 w-4 animate-pulse" />
                                  <p className="font-bold text-sm sm:text-base">Tap Energy Depleted!</p>
                              </div>
                              <p className="text-xs">Wait for regeneration or refill your taps with Auron.</p>
                          </motion.div>
                      )}
                  </motion.div>
              </div>
          </div>

          <style jsx>{`
              @keyframes pan-background {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 5% 50%; }
                  100% { background-position: 0% 50%; }
              }
              .animate-pan-background {
                  animation: pan-background 90s linear infinite;
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
      </AppLayout>
    </>
  );
}
