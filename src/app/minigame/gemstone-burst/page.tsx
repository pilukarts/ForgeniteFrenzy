
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import GemstoneBurst from '@/components/minigame/GemstoneBurst';
import { Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const GemstoneBurstPage: React.FC = () => {
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
            <Gem className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" />
            Gemstone Burst
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Match 3 or more gems to clear them and earn points.
          </p>
        </header>
        <div className="flex-grow flex items-center justify-center">
          <GemstoneBurst />
        </div>
      </div>
    </AppLayout>
  );
};

export default GemstoneBurstPage;
