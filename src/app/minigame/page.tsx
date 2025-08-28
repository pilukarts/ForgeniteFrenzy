
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import GalacticPacman from '@/components/minigame/GalacticPacman';
import { Gamepad2 } from 'lucide-react';

const MinigamePage: React.FC = () => {
  const { isLoading, isInitialSetupDone } = useGame();

  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <header className="mb-4 sm:mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-headline text-primary flex items-center justify-center">
            <Gamepad2 className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" />
            Galactic Labyrinth
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Collect all the star fragments to earn bonus points. Avoid the patrol drone!
          </p>
        </header>
        <GalacticPacman />
      </div>
    </AppLayout>
  );
};

export default MinigamePage;
