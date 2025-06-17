
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
      {/* AppLayout handles global bottom padding */}
      <div className=""> 
        <div className="flex flex-col sm:flex-row justify-between items-center px-2 sm:px-4 pt-2 sm:pt-4 mb-4 sm:mb-6 gap-2"> {/* Adjusted padding, margin, gap */}
            <h1 className="text-2xl sm:text-3xl font-headline text-primary">Item Shop</h1> {/* Adjusted text size */}
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-card text-card-foreground shadow"> {/* Adjusted gap and padding */}
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-bright-gold" />
                <span className="text-base sm:text-lg font-semibold text-bright-gold">{playerProfile.auron}</span>
                <span className="text-xs sm:text-sm text-muted-foreground">Auron</span>
            </div>
        </div>
        
        {/* Adjust height: viewport height - app header - page header - bottom nav (implicitly handled by AppLayout padding) */}
        <ScrollArea className="h-[calc(100vh-var(--app-header-h,60px)-var(--page-header-h,80px)-var(--bottom-nav-h,56px))] px-2 sm:px-4"> {/* Placeholder heights, adjust as needed */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"> {/* Adjusted gap */}
            {marketplaceItems.map(item => {
              const Icon = item.icon || HelpCircle; 
              return (
                <Card key={item.id} className="bg-card text-card-foreground shadow-lg flex flex-col">
                  <CardHeader className="p-3 sm:p-4"> {/* Adjusted padding */}
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3"> {/* Adjusted gap and alignment for mobile */}
                      <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary mt-1 sm:mt-0" />
                      <div>
                        <CardTitle className="text-lg sm:text-xl font-headline">{item.name}</CardTitle> {/* Adjusted text size */}
                        <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{item.description}</CardDescription> {/* Adjusted text size and margin */}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow p-3 sm:p-4 pt-0"> {/* Adjusted padding */}
                    <p className="text-xs sm:text-sm text-primary flex items-center">
                        Effect: +{(item.bonusEffect.multiplier - 1) * 100}% Tap Power for {item.bonusEffect.durationTaps} taps.
                    </p>
                  </CardContent>
                  <CardFooter className="flex-col items-stretch space-y-1.5 sm:space-y-2 p-3 sm:p-4 pt-0"> {/* Adjusted padding and spacing */}
                     <div className="flex items-center justify-center text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-bright-gold mr-1 sm:mr-1.5" />
                        <span>{item.costInAuron} Auron</span>
                    </div>
                    <Button 
                      onClick={() => purchaseMarketplaceItem(item.id)} 
                      disabled={playerProfile.auron < item.costInAuron}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base py-2 sm:py-2.5" /* Adjusted text size and padding */
                      size="default" /* Explicitly use default which is h-10, can be sm for h-9 */
                    >
                      Purchase
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
           {playerProfile.activeTapBonuses && playerProfile.activeTapBonuses.length > 0 && (
            <div className="mt-6 sm:mt-8"> {/* Adjusted margin */}
              <h2 className="text-xl sm:text-2xl font-headline text-accent mb-2 sm:mb-3">Active Boosts</h2> {/* Adjusted text size and margin */}
              <div className="space-y-1.5 sm:space-y-2"> {/* Adjusted spacing */}
                {playerProfile.activeTapBonuses.map(bonus => (
                  <Card key={bonus.id} className="bg-card/70 p-2 sm:p-3"> {/* Adjusted padding */}
                    <p className="font-semibold text-primary text-sm sm:text-base">{bonus.name}</p> {/* Adjusted text size */}
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      +{ (bonus.bonusMultiplier - 1) * 100 }% tap power. {bonus.remainingTaps} / {bonus.originalDurationTaps} taps remaining.
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
         {/* CSS variables for dynamic height calculation (optional, can be refined) */}
        <style jsx>{`
          :root {
            --app-header-h: 60px; /* Approximate AppHeader height */
            --page-header-h: 80px; /* Approximate PageHeader height (title + auron display) */
            --bottom-nav-h: 56px; /* Actual BottomNav height */
          }
          @media (min-width: 640px) { /* sm breakpoint */
            :root {
              --app-header-h: 68px;
              --page-header-h: 88px;
            }
          }
        `}</style>
      </div>
    </AppLayout>
  );
};

export default MarketplacePage;

