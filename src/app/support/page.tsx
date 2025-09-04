
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ContactForm from '@/components/support/ContactForm';
import { LifeBuoy, Heart } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PAYPAL_DONATION_URL } from '@/lib/gameData';


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
            Need help or want to support the project?
          </p>
        </header>

        <div className="space-y-6 max-w-lg mx-auto">
          <ContactForm />

          <Separator />

          <Card className="bg-card/70 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center text-accent font-headline text-xl sm:text-2xl">
                <Heart className="mr-3 h-6 w-6" />
                Support the Mission
              </CardTitle>
              <CardDescription>
                Alliance Forge is a passion project. Your support helps us cover server costs, develop new features, and keep the universe expanding.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href={PAYPAL_DONATION_URL} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-[#00457C] hover:bg-[#003057] text-white text-base font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M7.375 6.25h6.375c3.5 0 5.625 2.25 5.625 5.75c0 2.625-1.5 4.625-3.75 5.375c-.499.167-1.082.25-1.75.25h-1.375c-.667 0-1.167.417-1.333 1.083c-.167.584-.5 1.667-1.083 1.667H7.375c-.583 0-.833-.5-.666-1.167c.25-1 .583-1.916 1.333-2.666c.834-.75 2-1.5 3.333-1.5h.5c.916 0 1.666-.583 1.75-1.416c.166-.834-.5-1.5-1.5-1.5H8.292c-.833 0-1.5-.417-1.667-1.25C6.542 8.333 7 7.167 7.5 6.417C7.583 6.334 7.5 6.25 7.375 6.25m3.375-2C9.583 4.25 8.583 5.417 8 6.25H6.5c-1.167 0-1.834.75-2 2s.333 2 1.5 2h.25c.083.833-.334 2-1.25 2.833c-.917.917-1.334 2.167-1.083 3.5c.333 1.583 1.5 2.667 3.083 2.667h2.75c.917 0 1.5-1.5 1.5-1.5s.417-1.167 1.167-1.583c.666-.334 1.333-.417 2-.417h1.334c2.833 0 5.333-2.167 5.333-5.583c0-4.5-3.084-6.917-6.667-6.917h-6.25Z"/></svg>
                  Donate with PayPal
                </Button>
              </a>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                You will be redirected to the official PayPal website. This is a real donation link.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
};

export default SupportPage;

    