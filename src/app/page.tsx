
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
  const gameUrl = "https://allianceforge.game"; // Placeholder URL for the game

  const handleTelegramShare = () => {
    if (playerProfile) {
      let shareText = `Join me in Alliance Forge! I've reached ${playerProfile.points.toLocaleString()} points and the rank of ${playerProfile.rankTitle}.`;
      if (playerProfile.referralCode) {
        shareText += ` Use my referral code: ${playerProfile.referralCode} when you sign up!`;
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
        className="relative flex flex-col items-center justify-center text-center h-full pt-1 sm:pt-2 bg-cover bg-center bg-no-repeat" // Reduced top padding for mobile
        style={backgroundImageStyle}
        data-ai-hint="futuristic space background"
      >
        <div className="absolute top-2 sm:top-6 left-2 sm:left-6 z-0 opacity-75"> {/* Adjusted logo position */}
          <Image
            src={introLogoUrl}
            alt="Alliance Forge Logo"
            width={100} /* Reduced size for mobile */
            height={56} 
            className="object-contain sm:w-[150px] sm:h-[84px]"
            data-ai-hint="game logo title"
          />
        </div>

        <CommanderPortrait
          commanderSex={playerProfile.commanderSex}
          onTap={handleTap}
        />

        <div className="mt-8 sm:mt-12"> {/* Reduced top margin on mobile */}
          <p className="text-sm sm:text-base font-semibold text-primary font-headline bg-background/70 p-1 rounded">
            Tap Commander to Generate Points
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground bg-background/70 p-1 rounded mt-1">
            Current Objective: {playerProfile.currentSeasonId ? playerProfile.seasonProgress[playerProfile.currentSeasonId]?.toLocaleString() || 0 : 0} Points
          </p>

          <Button onClick={switchCommanderSex} variant="outline" size="sm" className="mt-2 sm:mt-3 text-foreground hover:text-accent-foreground hover:bg-accent bg-background/70 text-sm sm:text-base"> {/* Adjusted size and margin */}
            {playerProfile.commanderSex === 'male' ? (
              <>Switch to <UserRound className="inline-block ml-1 mr-1 h-4 w-4 sm:h-5 sm:w-5" /> Female</> // Shortened text
            ) : (
              <>Switch to <User className="inline-block ml-1 mr-1 h-4 w-4 sm:h-5 sm:w-5" /> Male</> // Shortened text
            )}
          </Button>
          
          <div className="mt-2 sm:mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3 items-center px-2"> {/* Added gap-2 for mobile column stacking */}
            <Button
              variant="default" 
              size="sm" // Made button smaller on mobile
              className="w-full sm:w-auto text-xs sm:text-sm" // Adjusted text size
              onClick={handleTelegramShare}
            >
              <Send className="mr-1 sm:mr-2 h-4 w-4" /> Share & Invite (Telegram)
            </Button>

            <Button
              variant="default"
              size="sm" // Made button smaller on mobile
              className="w-full sm:w-auto text-xs sm:text-sm" // Adjusted text size
              onClick={handleTikTokShare}
            >
              <Film className="mr-1 sm:mr-2 h-4 w-4" /> Share & Invite (TikTok)
            </Button>

            <Button
              variant="default"
              size="sm" // Made button smaller on mobile
              className="w-full sm:w-auto text-xs sm:text-sm" // Adjusted text size
              onClick={handleDiscordShare}
            >
              <MessageSquare className="mr-1 sm:mr-2 h-4 w-4" /> Share & Invite (Discord)
            </Button>
          </div>
        </div>


        {playerProfile.equippedUniformPieces && playerProfile.equippedUniformPieces.length > 0 && (
          <div className="mt-4 sm:mt-6 text-center w-full max-w-[280px] sm:max-w-xs p-2 sm:p-3 bg-card/80 rounded-lg shadow"> {/* Reduced padding and max-width on mobile */}
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

    

