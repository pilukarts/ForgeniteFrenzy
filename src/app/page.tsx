
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AppLayout from '@/components/layout/AppLayout';
import CommanderPortrait from '@/components/game/CommanderPortrait';
import PlayerSetup from '@/components/player/PlayerSetup';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { User, UserRound, CheckCircle2, ShieldEllipsis, Send, Film, MessageSquare, Zap, AlertTriangle } from 'lucide-react';
import IntroScreen from '@/components/intro/IntroScreen';
import PreIntroScreen from '@/components/intro/PreIntroScreen';
import { useToast } from "@/hooks/use-toast";
import { AURON_COST_FOR_TAP_REFILL, TAP_REGEN_COOLDOWN_MINUTES } from '@/lib/gameData';

type NewUserIntroPhase = 'pre' | 'main' | 'setup';

// Helper component for IntroScreen with timed transition
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
  const { playerProfile, isLoading, isInitialSetupDone, handleTap, switchCommanderSex, refillTaps } = useGame();
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
          // Optionally auto-refresh profile or notify user taps are ready
           if(playerProfile.currentTaps <=0) { // Check again, as handleTap might refill it
             toast({title: "Taps Recharged!", description: "Your tap energy is ready."});
           }
        }
      };
      updateTimer(); // Initial call
      intervalId = setInterval(updateTimer, 1000);
    } else if (playerProfile && playerProfile.currentTaps > 0) {
      setTimeLeftForTapRegen(0); // Reset if taps are available
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
  const introLogoUrl = "https://i.imgur.com/AwQqiyx.png"; 
  const gameUrl = "https://allianceforge.game"; 

  const handleTelegramShare = () => {
    if (playerProfile) {
      let shareText = `Join me in Alliance Forge! Score: ${playerProfile.points.toLocaleString()}, Rank: ${playerProfile.rankTitle}.`;
      if (playerProfile.referralCode) {
        shareText += ` Use my code ${playerProfile.referralCode} at signup!`;
      }
      if (playerProfile.referredByCode) { 
        shareText += ` I joined thanks to a friend!`;
      }
      shareText += ` Let's save humanity! ${gameUrl} #AllianceForge #Invite`;
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(gameUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTikTokShare = async () => {
    if (playerProfile) {
      let shareText = `Alliance Forge is epic! My score: ${playerProfile.points.toLocaleString()}, Rank: ${playerProfile.rankTitle}.`;
      if (playerProfile.referralCode) {
        shareText += ` Join with my code: ${playerProfile.referralCode}.`;
      }
      if (playerProfile.referredByCode) { 
        shareText += ` Joined via referral!`;
      }
      shareText += ` #AllianceForge #Gaming #SciFiGame #Referral`;
      try {
        await navigator.clipboard.writeText(shareText + ` Game: ${gameUrl}`);
        toast({
          title: "TikTok Message Copied!",
          description: "Paste it into your video description. Opening TikTok...",
        });
      } catch (err) {
        console.error('Failed to copy text: ', err);
        toast({
          title: "Error",
          description: "Could not copy message. Please try again or copy manually.",
          variant: "destructive",
        });
      }
      window.open('https://www.tiktok.com/', '_blank', 'noopener,noreferrer');
    }
  };

  const handleDiscordShare = async () => {
    if (playerProfile) {
      const discordInviteLink = "https://discord.gg/HYzPh32K"; 
      let shareText = `Commanders, assemble in Alliance Forge: ${gameUrl}. My stats: ${playerProfile.points.toLocaleString()} pts (Rank: ${playerProfile.rankTitle}).`;
      if (playerProfile.referralCode) {
        shareText += ` Use referral: ${playerProfile.referralCode} when signing up.`;
      }
      if (playerProfile.referredByCode) { 
        shareText += ` Honored to join via referral!`;
      }
      shareText += ` Our Discord: ${discordInviteLink} #AllianceForge #Invite`;
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Discord Message Copied!",
          description: "Paste it into your server or a friend's DM. Opening Discord invite...",
        });
      } catch (err) {
        console.error('Failed to copy text: ', err);
        toast({
          title: "Error",
          description: "Could not copy message. Please try again or copy manually.",
          variant: "destructive",
        });
      }
      window.open(discordInviteLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (!playerProfile) return <IntroScreen/>; 

  const isOutOfTaps = playerProfile.currentTaps <= 0 && timeLeftForTapRegen > 0;

  return (
    <AppLayout>
      <div
        className="relative flex flex-col items-center justify-start text-center h-full pt-1 sm:pt-2 bg-cover bg-center bg-no-repeat"
        style={backgroundImageStyle}
        data-ai-hint="futuristic space background"
      >
        <div className="absolute top-2 sm:top-6 left-2 sm:left-6 z-0 opacity-75">
          <Image
            src={introLogoUrl}
            alt="Alliance Forge Logo"
            width={100} 
            height={56} 
            className="object-contain sm:w-[150px] sm:h-[84px]" 
            data-ai-hint="game logo title"
          />
        </div>

        <CommanderPortrait
          commanderSex={playerProfile.commanderSex}
          onTap={handleTap}
        />

        <div className="mt-4 sm:mt-6 w-full max-w-xs sm:max-w-sm md:max-w-md">
           <div className="bg-background/70 p-2 rounded-lg mb-2">
            <p className="text-lg sm:text-xl font-semibold text-primary font-headline">
              Taps: {playerProfile.currentTaps} / {playerProfile.maxTaps}
            </p>
            {isOutOfTaps && (
              <p className="text-xs sm:text-sm text-orange-400 animate-pulse">
                Recarga en: {formatTimeLeft(timeLeftForTapRegen)}
              </p>
            )}
          </div>

          {isOutOfTaps && (
            <Button 
              onClick={refillTaps} 
              variant="destructive" 
              className="w-full mb-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={playerProfile.auron < AURON_COST_FOR_TAP_REFILL}
            >
              <Zap className="mr-2 h-4 w-4" /> Rellenar Taps ({AURON_COST_FOR_TAP_REFILL} Auron)
            </Button>
          )}
           {playerProfile.auron < AURON_COST_FOR_TAP_REFILL && isOutOfTaps && (
            <p className="text-xs text-red-400 mb-2 flex items-center justify-center">
                <AlertTriangle className="h-3 w-3 mr-1"/>
                Auron insuficiente para rellenar.
            </p>
           )}


          <p className="text-sm sm:text-base font-semibold text-primary font-headline bg-background/70 p-1 rounded">
            Tap Commander to Generate Points
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground bg-background/70 p-1 rounded mt-1">
            Current Objective: {playerProfile.currentSeasonId ? playerProfile.seasonProgress[playerProfile.currentSeasonId]?.toLocaleString() || 0 : 0} Points
          </p>

          <Button onClick={switchCommanderSex} variant="outline" size="sm" className="mt-2 sm:mt-3 text-foreground hover:text-accent-foreground hover:bg-accent bg-background/70 text-sm sm:text-base">
            {playerProfile.commanderSex === 'male' ? (
              <>Switch to <UserRound className="inline-block ml-1 mr-1 h-4 w-4 sm:h-5 sm:w-5" /> Female</>
            ) : (
              <>Switch to <User className="inline-block ml-1 mr-1 h-4 w-4 sm:h-5 sm:w-5" /> Male</>
            )}
          </Button>
          
          <div className="mt-2 sm:mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3 items-center px-2">
            <Button
              variant="default" 
              size="sm"
              className="w-full sm:w-auto text-xs sm:text-sm" 
              onClick={handleTelegramShare}
            >
              <Send className="mr-1 sm:mr-2 h-4 w-4" /> Share & Invite (Telegram)
            </Button>

            <Button
              variant="default"
              size="sm"
              className="w-full sm:w-auto text-xs sm:text-sm" 
              onClick={handleTikTokShare}
            >
              <Film className="mr-1 sm:mr-2 h-4 w-4" /> Share & Invite (TikTok)
            </Button>

            <Button
              variant="default"
              size="sm"
              className="w-full sm:w-auto text-xs sm:text-sm" 
              onClick={handleDiscordShare}
            >
              <MessageSquare className="mr-1 sm:mr-2 h-4 w-4" /> Share & Invite (Discord)
            </Button>
          </div>
        </div>

        {playerProfile.equippedUniformPieces && playerProfile.equippedUniformPieces.length > 0 && (
          <div className="mt-4 sm:mt-6 text-center w-full max-w-[280px] sm:max-w-xs p-2 sm:p-3 bg-card/80 rounded-lg shadow">
            <h3 className="text-sm sm:text-md font-semibold text-accent flex items-center justify-center">
              <ShieldEllipsis className="h-4 w-4 sm:h-5 sm:h-5 mr-2"/>
              Black Uniform Progress
            </h3>
            <ul className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground list-none p-0 space-y-0.5 sm:space-y-1">
              {playerProfile.equippedUniformPieces.map(piece => (
                <li key={piece} className="flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:h-4 mr-1 sm:mr-2 text-green-400 flex-shrink-0" />
                  <span>{piece}</span>
                </li>
              ))}
            </ul>
            {playerProfile.equippedUniformPieces.length < 5 && ( 
                 <p className="text-xs text-muted-foreground/70 mt-1 sm:mt-2">
                    Next piece at: { ((playerProfile.equippedUniformPieces.length + 1) * 2000).toLocaleString() } taps
                </p>
            )}
             {playerProfile.equippedUniformPieces.length === 5 && ( 
                 <p className="text-xs text-green-400 font-semibold mt-1 sm:mt-2">
                    Black Uniform Complete!
                </p>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
