
"use client";
import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import Image from 'next/image';
import AppLayout from '@/components/layout/AppLayout';
import CommanderPortrait from '@/components/game/CommanderPortrait';
import PlayerSetup from '@/components/player/PlayerSetup';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { User, UserRound, CheckCircle2, ShieldEllipsis, Send, Film, MessageSquare } from 'lucide-react'; // Added Send, Film, MessageSquare icons
import IntroScreen from '@/components/intro/IntroScreen';
import PreIntroScreen from '@/components/intro/PreIntroScreen'; 
import { useToast } from "@/hooks/use-toast"; // Import useToast

export default function HomePage() {
  const { playerProfile, isLoading, isInitialSetupDone, handleTap, switchCommanderSex } = useGame();
  const [preIntroDone, setPreIntroDone] = useState(false);
  const { toast } = useToast(); // Initialize useToast

  useEffect(() => {
    // If already setup, skip pre-intro
    if (isInitialSetupDone) {
      setPreIntroDone(true);
    }
  }, [isInitialSetupDone]);

  // Step 1 of Intro: Show both commanders
  if (!preIntroDone && !isInitialSetupDone) {
    return <PreIntroScreen onCompletion={() => setPreIntroDone(true)} />;
  }

  // Step 2 of Intro: Show loading screen (game logo + spinner)
  if (isLoading && !isInitialSetupDone) { // This condition ensures it shows after PreIntro for new users
    return <IntroScreen />;
  }

  // Step 3 of Intro: Player character and name setup
  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  if (!playerProfile) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            Error: Player profile not loaded.
        </div>
    );
  }

  const backgroundImageStyle = {
    backgroundImage: "url('https://i.imgur.com/awGhtRo.png')",
  };

  const introLogoUrl = "https://i.imgur.com/AwQqiyx.png";

  const handleTelegramShare = () => {
    if (playerProfile) {
      const gameUrl = "https://allianceforge.game"; // Placeholder URL for the game
      const shareText = `I've reached ${playerProfile.points.toLocaleString()} points in Alliance Forge and achieved the rank of ${playerProfile.rankTitle}! Join the fight for humanity's future! #AllianceForge #ArkEvac`;
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(gameUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTikTokShare = async () => {
    if (playerProfile) {
      const shareText = `Check out my progress in Alliance Forge! I've reached ${playerProfile.points.toLocaleString()} points and the rank of ${playerProfile.rankTitle}! #AllianceForge #Gaming #ArkEvac #SciFiGame`;
      try {
        await navigator.clipboard.writeText(shareText);
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
      const gameUrl = "https://allianceforge.game"; // Placeholder
      const shareText = `I've reached ${playerProfile.points.toLocaleString()} points in Alliance Forge and achieved the rank of ${playerProfile.rankTitle}! Join the fight for humanity's future at ${gameUrl}! #AllianceForge`;
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Discord Message Copied!",
          description: "Paste it into your server or a friend's DM.",
        });
      } catch (err) {
        console.error('Failed to copy text: ', err);
        toast({
          title: "Error",
          description: "Could not copy message. Please try again or copy manually.",
          variant: "destructive",
        });
      }
      // Optional: Open a specific Discord invite link if you have one.
      // window.open('YOUR_DISCORD_INVITE_LINK_HERE', '_blank', 'noopener,noreferrer');
    }
  };


  return (
    <AppLayout>
      <div
        className="relative flex flex-col items-center justify-center text-center h-full pt-2 pb-16 bg-cover bg-center bg-no-repeat"
        style={backgroundImageStyle}
        data-ai-hint="futuristic space background"
      >
        <div className="absolute top-6 left-6 z-0 opacity-75">
          <Image
            src={introLogoUrl}
            alt="Alliance Forge Logo"
            width={150}
            height={84} 
            className="object-contain"
            data-ai-hint="game logo title"
          />
        </div>

        <CommanderPortrait
          commanderSex={playerProfile.commanderSex}
          onTap={handleTap}
        />

        <div className="mt-12">
          <p className="text-base font-semibold text-primary font-headline bg-background/70 p-1 rounded">
            Tap Commander to Generate Points
          </p>
          <p className="text-sm text-muted-foreground bg-background/70 p-1 rounded mt-1">
            Current Objective: {playerProfile.currentSeasonId ? playerProfile.seasonProgress[playerProfile.currentSeasonId]?.toLocaleString() || 0 : 0} Points
          </p>

          <Button onClick={switchCommanderSex} variant="outline" className="mt-3 text-foreground hover:text-accent-foreground hover:bg-accent bg-background/70 text-base">
            {playerProfile.commanderSex === 'male' ? (
              <>Switch to <UserRound className="inline-block ml-1 mr-1 h-5 w-5" /> Female Commander</>
            ) : (
              <>Switch to <User className="inline-block ml-1 mr-1 h-5 w-5" /> Male Commander</>
            )}
          </Button>
          
          <div className="mt-3 flex flex-col sm:flex-row sm:justify-center sm:gap-3 items-center">
            <Button
              variant="default" 
              className="w-full sm:w-auto text-base mb-2 sm:mb-0"
              onClick={handleTelegramShare}
            >
              <Send className="mr-2 h-5 w-5" /> Share on Telegram
            </Button>

            <Button
              variant="default"
              className="w-full sm:w-auto text-base mb-2 sm:mb-0"
              onClick={handleTikTokShare}
            >
              <Film className="mr-2 h-5 w-5" /> Share on TikTok
            </Button>

            <Button
              variant="default"
              className="w-full sm:w-auto text-base"
              onClick={handleDiscordShare}
            >
              <MessageSquare className="mr-2 h-5 w-5" /> Share on Discord
            </Button>
          </div>
        </div>


        {playerProfile.equippedUniformPieces && playerProfile.equippedUniformPieces.length > 0 && (
          <div className="mt-6 text-center w-full max-w-xs p-3 bg-card/80 rounded-lg shadow">
            <h3 className="text-md font-semibold text-accent flex items-center justify-center">
              <ShieldEllipsis className="h-5 w-5 mr-2"/>
              Black Uniform Progress
            </h3>
            <ul className="mt-2 text-sm text-muted-foreground list-none p-0 space-y-1">
              {playerProfile.equippedUniformPieces.map(piece => (
                <li key={piece} className="flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />
                  <span>{piece}</span>
                </li>
              ))}
            </ul>
            {playerProfile.equippedUniformPieces.length < 5 && (
                 <p className="text-xs text-muted-foreground/70 mt-2">
                    Next piece at: { ((playerProfile.equippedUniformPieces.length + 1) * 2000).toLocaleString() } taps
                </p>
            )}
             {playerProfile.equippedUniformPieces.length === 5 && (
                 <p className="text-xs text-green-400 font-semibold mt-2">
                    Black Uniform Complete!
                </p>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

    