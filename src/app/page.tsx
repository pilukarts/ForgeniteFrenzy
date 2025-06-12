
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CommanderPortrait from '@/components/game/CommanderPortrait';
import PlayerSetup from '@/components/player/PlayerSetup';
import { useGame } from '@/contexts/GameContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { playerProfile, isLoading, isInitialSetupDone, handleTap } = useGame();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-64 w-64 rounded-full mb-4" />
        <Skeleton className="h-8 w-3/4" />
      </div>
    );
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  if (!playerProfile) {
    // This case should ideally not be reached if isLoading and isInitialSetupDone are handled correctly
    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            Error: Player profile not loaded.
        </div>
    );
  }
  

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center text-center h-full pt-4 pb-16"> {/* pb-16 for bottom nav space */}
        <CommanderPortrait 
          commanderSex={playerProfile.commanderSex} 
          onTap={handleTap} 
        />
        <p className="mt-16 text-lg font-semibold text-primary font-headline">
          Tap Commander to Generate Points
        </p>
        <p className="text-sm text-muted-foreground">
          Current Objective: {playerProfile.currentSeasonId ? playerProfile.seasonProgress[playerProfile.currentSeasonId] || 0 : 0} Points
        </p>
      </div>
    </AppLayout>
  );
}

