
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AppLayout from '@/components/layout/AppLayout';
import CommanderPortrait from '@/components/game/CommanderPortrait';
import PlayerSetup from '@/components/player/PlayerSetup';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Zap, AlertTriangle, Trophy, Ship, Share2, Send, Users } from 'lucide-react';
import IntroScreen from '@/components/intro/IntroScreen';
import PreIntroScreen from '@/components/intro/PreIntroScreen';
import { useToast } from "@/hooks/use-toast";
import { AURON_COST_FOR_TAP_REFILL } from '@/lib/gameData';
import Link from 'next/link';
import { motion } from 'framer-motion';

type NewUserIntroPhase = 'pre' | 'setup';

const formatTimeLeft = (milliseconds: number): string => {
  if (milliseconds <= 0) return "00:00";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function HomePage() {
  const { playerProfile, isLoading, isInitialSetupDone, handleTap, refillTaps, currentSeason } = useGame();
  const { toast } = useToast();
  const [newUserIntroPhase, setNewUserIntroPhase] = useState<NewUserIntroPhase>('pre');
  const [timeLeftForTapRegen, setTimeLeftForTapRegen] = useState<number>(0);
  
  const spaceImageUrl = "https://i.imgur.com/foWm9FG.jpeg";
  
  useEffect(() => {
    if (!playerProfile || !isInitialSetupDone) return;

    const timerId = setInterval(() => {
      if (playerProfile.currentTaps <= 0) {
        const remaining = playerProfile.tapsAvailableAt - Date.now();
        setTimeLeftForTapRegen(Math.max(0, remaining));
        if (remaining <= 0) {
           // The tap refill logic is handled in the GameContext now
        }
      } else {
        setTimeLeftForTapRegen(0);
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [playerProfile, isInitialSetupDone]);

  // --- Render logic based on setup/loading state ---
  if (isLoading) {
    return <IntroScreen />;
  }
  
  if (!isInitialSetupDone) {
    if (newUserIntroPhase === 'pre') {
      return <PreIntroScreen onCompletion={() => setNewUserIntroPhase('setup')} />;
    }
    if (newUserIntroPhase === 'setup') {
      return <PlayerSetup />;
    }
    // Fallback loading screen
    return <IntroScreen />;
  }

  // From here, we know the player setup is done and profile should exist
  if (!playerProfile) {
    // This case should ideally not be hit if logic is correct, but it's a safe fallback.
    return <IntroScreen />; 
  }
  
  const handleInviteClick = async () => {
    if (!playerProfile.referralCode) return;
    
    // This URL should be the actual game URL for production
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
            // Fallback for browsers that don't support navigator.share
            await navigator.clipboard.writeText(referralLink);
            toast({
                title: "Referral Link Copied!",
                description: "Your invite link has been copied to the clipboard.",
            });
        }
    } catch (err) {
        console.error('Failed to share or copy referral link: ', err);
        // Fallback if sharing fails
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


  const isOutOfTaps = playerProfile.currentTaps <= 0 && timeLeftForTapRegen > 0;
  
  return (
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
              {isOutOfTaps && (
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
                    className="flex flex-col gap-2 w-auto max-w-[120px] sm:max-w-[150px] items-start self-center"
                >
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
                    <Button onClick={handleInviteClick} variant="outline" size="sm" className="w-full justify-start">
                        <Share2 className="mr-2 h-4 w-4"/> Invite
                    </Button>
                    <Button asChild variant="outline" size="sm" className="w-full justify-start">
                        <Link href="https://t.me/allianceforge" target="_blank" rel="noopener noreferrer">
                            <Send className="mr-2 h-4 w-4"/> Telegram
                        </Link>
                    </Button>
                     <Button asChild variant="outline" size="sm" className="w-full justify-start">
                        <Link href="https://x.com/AllianceForgeHQ" target="_blank" rel="noopener noreferrer">
                            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-3 w-3 fill-current">
                            <title>X</title>
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                            </svg>
                            X
                        </Link>
                    </Button>
                     <Button asChild variant="outline" size="sm" className="w-full justify-start">
                        <Link href="https://discord.gg/xnWDwGBC" target="_blank" rel="noopener noreferrer">
                            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 fill-current"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8245-.6667 1.284-.0001.0001-3.9102-1.5162-3.9102-1.5162l-.0448-.0204-3.9102 1.5162c-.2203-.4595-.4557-.9087-.6667-1.284a.0741.0741 0 00-.0785-.0371 19.7913 19.7913 0 00-4.8851 1.5152.069.069 0 00-.0321.0234C.5434 9.0458-.319 13.5799.0992 18.0578a.08.08 0 00.0414.0582c1.837.7749 3.6521 1.1648 5.4468 1.1648a12.6022 12.6022 0 002.3787-.2214.0741.0741 0 00.0623-.0562 12.2227 12.2227 0 00.435-2.2204.0741.0741 0 00-.0449-.0832c-.933-.424-1.782-1.026-2.52-1.844a.0741.0741 0 01.0181-.11.6318.6318 0 01.0362-.0277 10.8718 10.8718 0 012.9817-1.1075.0741.0741 0 01.084.0258c.4618.633 1.053 1.254 1.725 1.799a.0741.a0741 0 00.084.0258 10.8718 10.8718 0 012.9817 1.1075.6318.6318 0 01.0362.0277.0741.0741 0 01.0181.11c-.738.818-1.587 1.42-2.52 1.844a.0741.0741 0 00-.0449.0832 12.2227 12.2227 0 00.435 2.2204.0741.0741 0 00.0623.0562 12.6022 12.6022 0 002.3787.2214c1.7947 0 3.6098-.3899 5.4468-1.1648a.08.08 0 00.0414-.0582c.4182-4.4779-1.242-9.012-4.015-13.6646a.069.069 0 00-.032-.0234z"/></svg>
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
  );
}

    