
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ContactForm from '@/components/support/ContactForm';
import { LifeBuoy, Heart, Coffee } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';


const SupportPage: React.FC = () => {
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
            <LifeBuoy className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" />
            Support Center
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Need help or want to report an issue?
          </p>
        </header>

        <div className="space-y-6 max-w-lg mx-auto">
          <ContactForm />
        </div>
      </div>
    </AppLayout>
  );
};

export default SupportPage;
