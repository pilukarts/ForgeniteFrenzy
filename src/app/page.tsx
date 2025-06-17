
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AppLayout from '@/components/layout/AppLayout';
import CommanderPortrait from '@/components/game/CommanderPortrait';
import PlayerSetup from '@/components/player/PlayerSetup';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { User, UserRound, CheckCircle2, ShieldEllipsis, Send, Film, MessageSquare } from 'lucide-react';
import IntroScreen from '@/components/intro/IntroScreen';
import PreIntroScreen from '@/components/intro/PreIntroScreen';
import { useToast } from "@/hooks/use-toast";

type NewUserIntroPhase = 'pre' | 'main' | 'setup';

// Helper component for IntroScreen with timed transition
const IntroScreenWithTransition: React.FC<{ onComplete: () => void; duration: number }> = ({ onComplete, duration }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return <IntroScreen />;
};

export default function HomePage() {
  const { playerProfile, isLoading, isInitialSetupDone, handleTap, switchCommanderSex } = useGame();
  const { toast } = useToast();

  // State for new user intro flow
  const [newUserIntroPhase, setNewUserIntroPhase] = useState<NewUserIntroPhase>('pre');

  // --- Conditional Rendering Logic ---

  // 1. Handle existing users (initial setup is done)
  if (isInitialSetupDone) {
    if (isLoading) {
      // Existing user, but their data is still loading
      return <IntroScreen />;
    }
    if (!playerProfile) {
      // Existing user, data loaded, but no profile (error or unexpected state)
      // This could also be a brief moment after PlayerSetup completes before playerProfile re-renders.
      // Showing IntroScreen as a fallback is reasonable.
      return <IntroScreen />;
      // A more specific error might be:
      // return (
      //   <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      //     Error: Player profile not available after setup. Please reload.
      //   </div>
      // );
    }
    // Existing user, data loaded, profile available: render the main game content (defined below)
  } else {
    // 2. Handle new users (initial setup is NOT done)
    if (newUserIntroPhase === 'pre') {
      return <PreIntroScreen onCompletion={() => setNewUserIntroPhase('main')} />;
    }
    if (newUserIntroPhase === 'main') {
      return <IntroScreenWithTransition onComplete={() => setNewUserIntroPhase('setup')} duration={2500} />; // Show IntroScreen for 2.5 seconds
    }
    if (newUserIntroPhase === 'setup') {
      // PlayerSetup will call completeInitialSetup from GameContext,
      // which sets isInitialSetupDone=true. This will exit the new user flow on the next render.
      return <PlayerSetup />;
    }
    // Fallback for new user flow if phase is unexpected (should not happen)
    return <IntroScreen />;
  }

  // --- Main Game Content Rendering ---
  // This part is reached if isInitialSetupDone is true, isLoading is false, and playerProfile is available.

  const backgroundImageStyle = {
    backgroundImage: "url('https://i.imgur.com/awGhtRo.png')",
  };
  const introLogoUrl = "https://i.imgur.com/AwQqiyx.png";
  const gameUrl = "https://allianceforge.game"; // Used by share handlers

  const handleTelegramShare = () => {
    if (playerProfile) {
      let shareText = `Join me in Alliance Forge! I've reached ${playerProfile.points.toLocaleString()} points and the rank of ${playerProfile.rankTitle}.`;
      if (playerProfile.referralCode) {
        shareText += ` Use my referral code: ${playerProfile.referralCode} when you sign up!`;
      }
      if (playerProfile.referredByCode) { // If they were referred
        shareText += ` I joined thanks to a friend!`;
      }
      shareText += ` Let's save humanity! ${gameUrl} #AllianceForge #ArkEvac #Invite`;
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(gameUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTikTokShare = async () => {
    if (playerProfile) {
      let shareText = `Come play Alliance Forge with me! My score: ${playerProfile.points.toLocaleString()}, Rank: ${playerProfile.rankTitle}.`;
      if (playerProfile.referralCode) {
        shareText += ` My referral: ${playerProfile.referralCode}.`;
      }
      if (playerProfile.referredByCode) {
        shareText += ` Joined via referral!`;
      }
      shareText += ` #AllianceForge #Gaming #SciFiGame #Referral #Invite`;
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
      const discordInviteLink = "https://discord.gg/HYzPh32K"; // Example Discord server
      let shareText = `Calling all Commanders! Join Alliance Forge: ${gameUrl}. I'm at ${playerProfile.points.toLocaleString()} points (Rank: ${playerProfile.rankTitle}).`;
      if (playerProfile.referralCode) {
        shareText += ` Use my referral code: ${playerProfile.referralCode}.`;
      }
      if (playerProfile.referredByCode) {
        shareText += ` Honored to join the ranks via referral!`;
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

  return (
    <AppLayout>
      <div
        className="relative flex flex-col items-center justify-center text-center h-full pt-1 sm:pt-2 bg-cover bg-center bg-no-repeat"
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

        <div className="mt-8 sm:mt-12">
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
              <ShieldEllipsis className="h-4 w-4 sm:h-5 sm:w-5 mr-2"/>
              Black Uniform Progress
            </h3>
            <ul className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground list-none p-0 space-y-0.5 sm:space-y-1">
              {playerProfile.equippedUniformPieces.map(piece => (
                <li key={piece} className="flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-400 flex-shrink-0" />
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
    
