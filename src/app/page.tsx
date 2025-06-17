
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
      return <IntroScreen />;
    }
    if (!playerProfile) {
      // This case should ideally be handled by redirecting to setup or an error page
      // For now, showing IntroScreen or a simple message.
      return <IntroScreen />; // Or <p>Error: Player profile not found after setup.</p>;
    }
  } else {
    // 2. Handle new users (initial setup is NOT done)
    if (newUserIntroPhase === 'pre') {
      return <PreIntroScreen onCompletion={() => setNewUserIntroPhase('main')} />;
    }
    if (newUserIntroPhase === 'main') {
      // Show IntroScreen for 2.5 seconds then move to setup
      return <IntroScreenWithTransition onComplete={() => setNewUserIntroPhase('setup')} duration={2500} />; 
    }
    if (newUserIntroPhase === 'setup') {
      return <PlayerSetup />;
    }
    // Fallback for any other unhandled new user state, though ideally all paths are covered.
    return <IntroScreen />;
  }


  const backgroundImageStyle = {
    backgroundImage: "url('https://i.imgur.com/awGhtRo.png')",
  };
  const introLogoUrl = "https://i.imgur.com/AwQqiyx.png"; // Provided image URL
  const gameUrl = "https://allianceforge.game"; // Replace with your actual game URL

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
      // Consider not auto-opening TikTok or making it optional
      window.open('https://www.tiktok.com/', '_blank', 'noopener,noreferrer');
    }
  };

  const handleDiscordShare = async () => {
    if (playerProfile) {
      const discordInviteLink = "https://discord.gg/HYzPh32K"; // Replace with your actual Discord invite
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

  // This check is after the new user flow, so playerProfile should exist if isInitialSetupDone is true.
  // If it's still null here for an existing user, something is wrong with context/loading.
  if (!playerProfile) return <IntroScreen/>; // Should ideally be caught by earlier checks, but as a safeguard

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

        {/* Black Uniform Progress Section */}
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
    

    