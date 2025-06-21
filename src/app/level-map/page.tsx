
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import LevelMap from '@/components/game/LevelMap';
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
      <div className="h-full w-full flex flex-col">
        <div className="flex-grow overflow-hidden relative bg-background">
            <LevelMap />
        </div>
      </div>
    </AppLayout>
  );
};

export default LevelMapPage;
