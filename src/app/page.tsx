

"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CommanderPortrait from '@/components/game/CommanderPortrait';
import PlayerSetup from '@/components/player/PlayerSetup';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Zap, AlertTriangle, Trophy, Ship, Share2, Send, Users, Globe, Coffee, Gamepad2, Replace, RefreshCw, Music, Music2 } from 'lucide-react';
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
  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
      return <PlayerSetup />;
  }

  if (!playerProfile) {
    return <IntroScreen />; // Should not happen if isInitialSetupDone is true, but as a fallback.
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
      <div className="relative flex flex-col h-full overflow-hidden flex-grow">
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
                className="w-full text-center my-2 md:my-4"
              >
                <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary font-headline">
                  Taps: {playerProfile.currentTaps} / {playerProfile.maxTaps}
                </p>
                {isOutOfTaps && timeLeftForTapRegen !== null && (
                  <p className="text-sm sm:text-base md:text-lg text-orange-400 animate-pulse">
                    Regeneration in: {formatTimeLeft(timeLeftForTapRegen)}
                  </p>
                )}
              </motion.div>

              <div className="flex flex-grow w-full items-center justify-center p-2 sm:p-4">
                  <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 50 }}
                    className="flex-grow flex flex-col items-center justify-center"
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
    </>
  );
}
