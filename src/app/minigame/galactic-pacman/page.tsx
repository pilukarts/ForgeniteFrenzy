
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import GalacticPacman from '@/components/minigame/GalacticPacman';
import { Ship } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';


const GalacticPacmanPage: React.FC = () => {
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
        <header className="mb-2 text-center relative">
          <Link href="/arcade" className="absolute left-0 top-1/2 -translate-y-1/2">
             <Button variant="ghost" size="icon">
                <ArrowLeft className="h-6 w-6" />
             </Button>
           </Link>
          <h1 className="text-2xl sm:text-3xl font-headline text-primary flex items-center justify-center">
            <Ship className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" />
            Galactic Labyrinth
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Collect star fragments and avoid the patrol drone.
          </p>
        </header>
        <div className="flex-grow flex items-center justify-center">
          <GalacticPacman />
        </div>
      </div>
    </AppLayout>
  );
};

export default GalacticPacmanPage;
