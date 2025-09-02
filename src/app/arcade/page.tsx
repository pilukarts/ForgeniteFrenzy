
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Gem, Ship } from 'lucide-react';
import Link from 'next/link';

const ArcadePage: React.FC = () => {
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
        <header className="mb-4 sm:mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-headline text-primary flex items-center justify-center">
            <Gamepad2 className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" />
            Alliance Arcade
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Take a break and test your skills in the simulator.
          </p>
        </header>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-2 sm:p-4">
          <Card className="bg-card/70 hover:bg-card/90 transition-colors flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center text-accent">
                <Gem className="mr-2 h-5 w-5" /> Gemstone Burst
              </CardTitle>
              <CardDescription>Match 3 or more gems of the same color to clear them and earn points.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
              {/* You can add a preview image here if you want */}
            </CardContent>
            <CardContent>
               <Link href="/minigame/gemstone-burst" className="w-full">
                <Button className="w-full">Play Now</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card/70 hover:bg-card/90 transition-colors flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center text-accent">
                <Ship className="mr-2 h-5 w-5" /> Galactic Labyrinth
              </CardTitle>
              <CardDescription>Navigate the labyrinth, collect star fragments, and avoid the patrol drone.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
              {/* You can add a preview image here if you want */}
            </CardContent>
            <CardContent>
               <Link href="/minigame/galactic-pacman" className="w-full">
                 <Button className="w-full">Play Now</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </AppLayout>
  );
};

export default ArcadePage;
