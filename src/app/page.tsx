
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AppLayout from '@/components/layout/AppLayout';
import CommanderPortrait from '@/components/game/CommanderPortrait';
import PlayerSetup from '@/components/player/PlayerSetup';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { User, UserRound, Zap, AlertTriangle, Trophy, Shirt, Ship, Share2, Send, Users } from 'lucide-react';
import IntroScreen from '@/components/intro/IntroScreen';
import PreIntroScreen from '@/components/intro/PreIntroScreen';
import { useToast } from "@/hooks/use-toast";
import { AURON_COST_FOR_TAP_REFILL, TAP_REGEN_COOLDOWN_MINUTES } from '@/lib/gameData';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type NewUserIntroPhase = 'pre' | 'main' | 'setup';

const IntroScreenWithTransition: React.FC<{ onComplete: () => void; duration: number }> = ({ onComplete, duration }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return <IntroScreen />;
};

const formatTimeLeft = (milliseconds: number): string => {
  if (milliseconds <= 0) return "00:00";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function HomePage() {
  const { playerProfile, isLoading, isInitialSetupDone, handleTap, switchCommanderSex, refillTaps, currentSeason } = useGame();
  const { toast } = useToast();
  const [newUserIntroPhase, setNewUserIntroPhase] = useState<NewUserIntroPhase>('pre');
  const [timeLeftForTapRegen, setTimeLeftForTapRegen] = useState<number>(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (playerProfile && playerProfile.currentTaps <= 0 && playerProfile.tapsAvailableAt > Date.now()) {
      const updateTimer = () => {
        const remaining = playerProfile.tapsAvailableAt - Date.now();
        setTimeLeftForTapRegen(remaining > 0 ? remaining : 0);
        if (remaining <= 0) {
           if(playerProfile.currentTaps <=0) { 
             toast({title: "Taps Recharged!", description: "Your tap energy is ready."});
           }
        }
      };
      updateTimer(); 
      intervalId = setInterval(updateTimer, 1000);
    } else if (playerProfile && playerProfile.currentTaps > 0) {
      setTimeLeftForTapRegen(0); 
    }
    return () => clearInterval(intervalId);
  }, [playerProfile, toast]);

  if (isInitialSetupDone) {
    if (isLoading) {
      return <IntroScreen />;
    }
    if (!playerProfile) {
      return <IntroScreen />; 
    }
  } else {
    if (newUserIntroPhase === 'pre') {
      return <PreIntroScreen onCompletion={() => setNewUserIntroPhase('main')} />;
    }
    if (newUserIntroPhase === 'main') {
      return <IntroScreenWithTransition onComplete={() => setNewUserIntroPhase('setup')} duration={2500} />; 
    }
    if (newUserIntroPhase === 'setup') {
      return <PlayerSetup />;
    }
    return <IntroScreen />;
  }
  

  if (!playerProfile) return <IntroScreen/>; 

  const isOutOfTaps = playerProfile.currentTaps <= 0 && timeLeftForTapRegen > 0;

  return (
    <AppLayout>
      <div
        className="relative flex flex-col items-center justify-start text-center h-full overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
        
        <div className="relative z-10 w-full flex flex-col items-center justify-start flex-grow p-2">
            
            {/* Taps Display (animated from top) */}
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 50 }}
              className="my-2"
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

            <CommanderPortrait onTap={handleTap} />

            {/* Out of Taps Warning Box (animated from bottom) */}
            {isOutOfTaps && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="w-full max-w-xs bg-destructive/20 border border-destructive/50 text-destructive-foreground p-2 sm:p-3 rounded-lg shadow-lg space-y-2 text-center mt-2 z-20"
              >
                  <div className="flex items-center justify-center gap-2">
                    <AlertTriangle className="h-5 w-5 animate-pulse" />
                    <p className="font-bold text-base sm:text-lg">Tap Energy Depleted!</p>
                  </div>
                <p className="text-xs sm:text-sm">Wait for regeneration or refill your taps with Auron to continue your progress.</p>
                <Button onClick={refillTaps} variant="destructive" size="sm" disabled={playerProfile.auron < AURON_COST_FOR_TAP_REFILL}>
                  <Zap className="mr-1 h-3 w-3"/>
                  Refill Taps ({AURON_COST_FOR_TAP_REFILL} Auron)
                </Button>
              </motion.div>
            )}
        </div>

        {/* Action Buttons and Stats on the Sides */}
        <div className="relative bottom-0 left-0 right-0 w-full flex justify-between items-end px-2 sm:px-4 z-10 pointer-events-none mt-auto pb-2">
            {/* Left Side */}
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 50 }}
              className="flex flex-col gap-2 w-1/3 max-w-[120px] pointer-events-auto text-left"
            >
               <Button asChild variant="outline" size="sm" className="bg-background/70 justify-start">
                 <Link href="https://example.com/invite" target="_blank" rel="noopener noreferrer">
                  <Share2 className="mr-2 h-4 w-4"/> Invite
                 </Link>
               </Button>
               <Button asChild variant="outline" size="sm" className="bg-background/70 justify-start">
                 <Link href="https://t.me/allianceforge" target="_blank" rel="noopener noreferrer">
                  <Send className="mr-2 h-4 w-4"/> Telegram
                 </Link>
               </Button>
               <Button onClick={switchCommanderSex} variant="secondary" size="sm" className="bg-background/70 justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Switch
                </Button>
            </motion.div>
            
            {/* Center Area -- Stats */}
             <motion.div 
               initial={{ y: 100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.5, type: 'spring', stiffness: 50 }}
              className="flex flex-col gap-2 w-1/3 max-w-[120px] pointer-events-auto text-left"
            >
                {/* Materials Stat Box */}
               <div className="flex items-center gap-2 p-2 rounded-md bg-background/70 border border-input">
                  <Ship className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">{currentSeason.objectiveResourceName}</p>
                    <p className="text-sm text-foreground font-mono">{(playerProfile.seasonProgress[currentSeason.id] || 0).toLocaleString()}</p>
                  </div>
                </div>
               {/* League Stat Box */}
               <div className="flex items-center gap-2 p-2 rounded-md bg-background/70 border border-input">
                  <Trophy className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">League</p>
                    <p className="text-sm text-foreground font-mono">{playerProfile.league}</p>
                  </div>
                </div>
            </motion.div>


            {/* Right Side */}
            <motion.div 
               initial={{ x: 100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.5, type: 'spring', stiffness: 50 }}
              className="flex flex-col gap-2 w-1/3 max-w-[120px] pointer-events-auto text-left"
            >
               <Button asChild variant="outline" size="sm" className="bg-background/70 justify-start">
                  <Link href="https://x.com/AllianceForgeHQ" target="_blank" rel="noopener noreferrer">
                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-3 w-3 fill-current">
                      <title>X</title>
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                    </svg>
                    X
                  </Link>
                </Button>
               <Button asChild variant="outline" size="sm" className="bg-background/70 justify-start">
                 <Link href="https://discord.gg/xnWDwGBC" target="_blank" rel="noopener noreferrer">
                   <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 fill-current"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8245-.6667 1.284-.0001.0001-3.9102-1.5162-3.9102-1.5162l-.0448-.0204-3.9102 1.5162c-.2203-.4595-.4557-.9087-.6667-1.284a.0741.0741 0 00-.0785-.0371 19.7913 19.7913 0 00-4.8851 1.5152.069.069 0 00-.0321.0234C.5434 9.0458-.319 13.5799.0992 18.0578a.08.08 0 00.0414.0582c1.837.7749 3.6521 1.1648 5.4468 1.1648a12.6022 12.6022 0 002.3787-.2214.0741.0741 0 00.0623-.0562 12.2227 12.2227 0 00.435-2.2204.0741.0741 0 00-.0449-.0832c-.933-.424-1.782-1.026-2.52-1.844a.0741.0741 0 01.0181-.11.6318.6318 0 01.0362-.0277 10.8718 10.8718 0 012.9817-1.1075.0741.0741 0 01.084.0258c.4618.633 1.053 1.254 1.725 1.799a.0741.0741 0 00.084.0258 10.8718 10.8718 0 012.9817 1.1075.6318.6318 0 01.0362.0277.0741.0741 0 01.0181.11c-.738.818-1.587 1.42-2.52 1.844a.0741.0741 0 00-.0449.0832 12.2227 12.2227 0 00.435 2.2204.0741.0741 0 00.0623.0562 12.6022 12.6022 0 002.3787.2214c1.7947 0 3.6098-.3899 5.4468-1.1648a.08.08 0 00.0414-.0582c.4182-4.4779-.4436-8.9912-2.6146-13.6646a.069.069 0 00-.0321-.0234zM8.02 15.3312c-.9416 0-1.705-.802-1.705-1.791s.7634-1.791 1.705-1.791c.9416 0 1.705.802 1.705 1.791s-.7634 1.791-1.705 1.791zm7.9748 0c-.9416 0-1.705-.802-1.705-1.791s.7634-1.791 1.705-1.791c.9416 0 1.705.802 1.705 1.791s-.7634 1.791-1.705 1.791z" /></svg>
                   Discord
                 </Link>
               </Button>
               {/* Uniform Stat Box */}
               <div className="flex items-center gap-2 p-2 rounded-md bg-background/70 border border-input">
                  <Shirt className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground">Uniform</p>
                    <p className="text-sm text-foreground font-mono">{playerProfile.equippedUniformPieces.length} / 5</p>
                  </div>
                </div>
            </motion.div>
        </div>
      </div>
       <style jsx>{`
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
    </AppLayout>
  );
}
