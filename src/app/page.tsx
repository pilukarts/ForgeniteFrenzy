
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AppLayout from '@/components/layout/AppLayout';
import CommanderPortrait from '@/components/game/CommanderPortrait';
import PlayerSetup from '@/components/player/PlayerSetup';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { User, UserRound, Zap, AlertTriangle, Trophy, Shirt, Ship, Share2, Send, Music } from 'lucide-react';
import IntroScreen from '@/components/intro/IntroScreen';
import PreIntroScreen from '@/components/intro/PreIntroScreen';
import { useToast } from "@/hooks/use-toast";
import { AURON_COST_FOR_TAP_REFILL, TAP_REGEN_COOLDOWN_MINUTES } from '@/lib/gameData';
import Link from 'next/link';

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

  const backgroundImageStyle = {
    backgroundImage: "url('https://i.imgur.com/awGhtRo.png')",
  };
 
  if (!playerProfile) return <IntroScreen/>; 

  const isOutOfTaps = playerProfile.currentTaps <= 0 && timeLeftForTapRegen > 0;

  return (
    <AppLayout>
      <div
        className="relative flex flex-col items-center justify-start text-center h-full pt-4 sm:pt-8 bg-cover bg-center bg-no-repeat"
        style={backgroundImageStyle}
        data-ai-hint="futuristic space background"
      >
        <CommanderPortrait
          onTap={handleTap}
        />

        <div className="mt-4 sm:mt-6 w-full max-w-xs sm:max-w-sm md:max-w-md space-y-2">
           <div className="bg-background/70 p-2 sm:p-3 rounded-lg space-y-2">
            <div>
              <p className="text-xl sm:text-2xl font-semibold text-primary font-headline">
                Taps: {playerProfile.currentTaps} / {playerProfile.maxTaps}
              </p>
              {isOutOfTaps && (
                <p className="text-sm sm:text-base text-orange-400 animate-pulse">
                  Regeneration in: {formatTimeLeft(timeLeftForTapRegen)}
                </p>
              )}
            </div>

            <div className="border-t border-border/50 my-2"></div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-xs text-left">
              <div className="flex items-center gap-1.5 p-1 rounded bg-black/20">
                <Ship className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="font-bold text-muted-foreground">{currentSeason.objectiveResourceName}</p>
                  <p className="text-foreground font-mono">{(playerProfile.seasonProgress[currentSeason.id] || 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 p-1 rounded bg-black/20">
                <Trophy className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="font-bold text-muted-foreground">League</p>
                  <p className="text-foreground font-mono">{playerProfile.league}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 p-1 rounded bg-black/20">
                <Shirt className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="font-bold text-muted-foreground">Uniform</p>
                  <p className="text-foreground font-mono">{playerProfile.equippedUniformPieces.length} / 5</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border/50 my-2"></div>
            
            {/* Social Links Section */}
            <div className="grid grid-cols-3 gap-2 pt-1">
               <Button asChild variant="outline" size="sm" className="bg-background/70">
                 <Link href="https://example.com/invite" target="_blank" rel="noopener noreferrer">
                  <Share2 className="mr-1 h-3 w-3"/> Invite
                 </Link>
               </Button>
               <Button asChild variant="outline" size="sm" className="bg-background/70">
                 <Link href="https://t.me/allianceforge" target="_blank" rel="noopener noreferrer">
                  <Send className="mr-1 h-3 w-3"/> Telegram
                 </Link>
               </Button>
               <Button asChild variant="outline" size="sm" className="bg-background/70">
                 <Link href="https://tiktok.com/@allianceforge" target="_blank" rel="noopener noreferrer">
                  <Music className="mr-1 h-3 w-3"/> TikTok
                 </Link>
               </Button>
            </div>

          </div>

          {isOutOfTaps && (
            <Button 
              onClick={refillTaps} 
              variant="destructive" 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={playerProfile.auron < AURON_COST_FOR_TAP_REFILL}
            >
              <Zap className="mr-2 h-4 w-4" /> Refill Taps ({AURON_COST_FOR_TAP_REFILL} Auron)
            </Button>
          )}
           {playerProfile.auron < AURON_COST_FOR_TAP_REFILL && isOutOfTaps && (
            <p className="text-xs text-red-400 flex items-center justify-center">
                <AlertTriangle className="h-3 w-3 mr-1"/>
                Insufficient Auron to refill.
            </p>
           )}

          <Button onClick={switchCommanderSex} variant="outline" size="sm" className="text-foreground hover:text-accent-foreground hover:bg-accent bg-background/70 text-sm sm:text-base">
            {playerProfile.commanderSex === 'male' ? (
              <>Switch to <UserRound className="inline-block ml-1 mr-1 h-4 w-4 sm:h-5 sm:w-5" /> Female</>
            ) : (
              <>Switch to <User className="inline-block ml-1 mr-1 h-4 w-4 sm:h-5 sm:w-5" /> Male</>
            )}
          </Button>

        </div>
      </div>
    </AppLayout>
  );
}
