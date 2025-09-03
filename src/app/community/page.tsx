
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import FeedbackForm from '@/components/community/FeedbackForm';
import { Users } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import NewsletterSignup from '@/components/community/NewsletterSignup';
import { Separator } from '@/components/ui/separator';

const CommunityPage: React.FC = () => {
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
            <Users className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" />
            Community Hub
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Share your feedback, suggestions, or report issues.
          </p>
        </header>
        <div className="max-w-lg mx-auto space-y-8">
          <FeedbackForm />
          <Separator />
          <NewsletterSignup />
        </div>
      </div>
    </AppLayout>
  );
};

export default CommunityPage;
