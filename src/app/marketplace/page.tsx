
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import PlayerSetup from '@/components/player/PlayerSetup';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, HelpCircle } from 'lucide-react'; // Changed default icon from Tag to HelpCircle
import type { MarketplaceItem } from '@/lib/types';
import IntroScreen from '@/components/intro/IntroScreen';

const MarketplacePage: React.FC = () => {
  const { playerProfile, marketplaceItems, purchaseMarketplaceItem, isLoading, isInitialSetupDone } = useGame();

  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  if (!playerProfile) return null;

  return (
    <AppLayout>
      <div className="pb-16"> {/* Padding for bottom nav */}
        <div className="flex justify-between items-center px-4 pt-4 mb-6">
            <h1 className="text-3xl font-headline text-primary">Item Shop</h1>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-card text-card-foreground shadow">
                <Sparkles className="h-6 w-6 text-bright-gold" />
                <span className="text-lg font-semibold text-bright-gold">{playerProfile.auron}</span>
                <span className="text-sm text-muted-foreground">Auron</span>
            </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-250px)] px-4"> {/* Adjust height as needed */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketplaceItems.map(item => {
              const Icon = item.icon || HelpCircle; // Use HelpCircle as a fallback
              return (
                <Card key={item.id} className="bg-card text-card-foreground shadow-lg flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className="h-10 w-10 text-primary" />
                      <div>
                        <CardTitle className="text-xl font-headline">{item.name}</CardTitle>
                        <CardDescription className="text-muted-foreground mt-1">{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-primary flex items-center">
                        Effect: +{(item.bonusEffect.multiplier - 1) * 100}% Tap Power for {item.bonusEffect.durationTaps} taps.
                    </p>
                  </CardContent>
                  <CardFooter className="flex-col items-stretch space-y-2">
                     <div className="flex items-center justify-center text-lg font-semibold mb-2">
                        <Sparkles className="h-5 w-5 text-bright-gold mr-1.5" />
                        <span>{item.costInAuron} Auron</span>
                    </div>
                    <Button 
                      onClick={() => purchaseMarketplaceItem(item.id)} 
                      disabled={playerProfile.auron < item.costInAuron}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Purchase
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
           {playerProfile.activeTapBonuses && playerProfile.activeTapBonuses.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-headline text-accent mb-3">Active Boosts</h2>
              <div className="space-y-2">
                {playerProfile.activeTapBonuses.map(bonus => (
                  <Card key={bonus.id} className="bg-card/70 p-3">
                    <p className="font-semibold text-primary">{bonus.name}</p>
                    <p className="text-sm text-muted-foreground">
                      +{ (bonus.bonusMultiplier - 1) * 100 }% tap power. {bonus.remainingTaps} / {bonus.originalDurationTaps} taps remaining.
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </AppLayout>
  );
};

export default MarketplacePage;
