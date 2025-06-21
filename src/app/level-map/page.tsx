
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import LevelMap from '@/components/game/LevelMap';
import { Map } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';

const LevelMapPage: React.FC = () => {
    const { isLoading, isInitialSetupDone } = useGame();

    if (isLoading) {
        return <IntroScreen />;
    }

    if (!isInitialSetupDone) {
        return <PlayerSetup />;
    }

  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 h-full flex flex-col">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-headline text-primary flex items-center">
            <Map className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" />
            Progression Map
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Your journey through the galaxy. Each level unlocks new potential.
          </p>
        </header>
        <div className="flex-grow overflow-auto border border-border rounded-lg bg-card/20">
            <LevelMap />
        </div>
      </div>
    </AppLayout>
  );
};

export default LevelMapPage;
