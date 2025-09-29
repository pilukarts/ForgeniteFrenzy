
"use client";
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import PlayerSetup from '@/components/player/PlayerSetup';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronUp, Zap, ShieldCheck, PlusCircle } from 'lucide-react'; // Example icons
import IntroScreen from '@/components/intro/IntroScreen';

const UpgradesPage: React.FC = () => {
  const { playerProfile, upgrades, getUpgradeLevel, purchaseUpgrade, getUpgradeCost, isLoading, isInitialSetupDone, arkUpgrades, purchaseArkUpgrade, getArkUpgradeById } = useGame();

  if (isLoading) {
     return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }
  
  if (!playerProfile) return null;

  const regularUpgrades = upgrades.filter(u => !u.id.startsWith('ark_')); 

  return (
    <>
      {/* AppLayout handles global bottom padding */}
      <div className=""> 
        <h1 className="text-2xl sm:text-3xl font-headline text-primary mb-4 sm:mb-6 px-2 sm:px-4 pt-2 sm:pt-4">Armory & Enhancements</h1> {/* Adjusted text size, margin, padding */}
        
        {/* Adjust height: viewport height - app header - page title - bottom nav (implicitly by AppLayout padding) */}
        <ScrollArea className="h-[calc(100vh-var(--app-header-h,60px)-var(--page-title-h,60px)-var(--bottom-nav-h,56px))] px-2 sm:px-4"> {/* Placeholder heights, adjust as needed */}
          <section className="mb-6 sm:mb-8"> {/* Adjusted margin */}
            <h2 className="text-xl sm:text-2xl font-headline text-accent mb-3 sm:mb-4">Commander Upgrades</h2> {/* Adjusted text size, margin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"> {/* Adjusted gap */}
              {regularUpgrades.map(upgrade => {
                const level = getUpgradeLevel(upgrade.id);
                const cost = getUpgradeCost(upgrade.id);
                const Icon = upgrade.icon || PlusCircle;
                return (
                  <Card key={upgrade.id} className="bg-card text-card-foreground shadow-lg">
                    <CardHeader className="p-3 sm:p-4"> {/* Adjusted padding */}
                      <div className="flex items-start sm:items-center gap-2 sm:gap-3"> {/* Adjusted gap and alignment */}
                        <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary mt-1 sm:mt-0" /> {/* Adjusted icon size */}
                        <div>
                          <CardTitle className="text-lg sm:text-xl font-headline">{upgrade.name}</CardTitle> {/* Adjusted text size */}
                          <CardDescription className="text-sm text-muted-foreground mt-0.5 sm:mt-1">{upgrade.description}</CardDescription> {/* Adjusted text size, margin */}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0"> {/* Adjusted padding */}
                      <p className="text-base">Current Level: <span className="font-semibold text-primary">{level}</span></p> {/* Adjusted text size */}
                      <p className="text-base">{upgrade.effectDescription(level)}</p> {/* Adjusted text size */}
                    </CardContent>
                    <CardFooter className="p-3 sm:p-4 pt-0"> {/* Adjusted padding */}
                      <Button 
                        onClick={() => purchaseUpgrade(upgrade.id)} 
                        disabled={playerProfile.points < cost || (upgrade.maxLevel && level >= upgrade.maxLevel)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-2" /* Adjusted text size, padding */
                        size="default"
                      >
                        {upgrade.maxLevel && level >= upgrade.maxLevel ? 'Max Level' : `Upgrade (${cost} Pts)`}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </section>

          {playerProfile.isWalletConnected && (
            <section className="mb-6 sm:mb-8"> {/* Adjusted margin */}
              <h2 className="text-xl sm:text-2xl font-headline text-accent mb-2 sm:mb-3">Ark Hangar</h2> {/* Adjusted text size, margin */}
               <CardDescription className="text-sm text-muted-foreground mb-2 sm:mb-3">Upgrade your StarForge Ark. Fully upgrade to earn the exclusive Founder's Ark NFT!</CardDescription> {/* Adjusted text size, margin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"> {/* Adjusted gap */}
                {arkUpgrades.map(arkUpgrade => {
                  const isPurchased = !!playerProfile.upgrades[arkUpgrade.id];
                  const Icon = ChevronUp; 
                  return (
                    <Card key={arkUpgrade.id} className="bg-card text-card-foreground shadow-lg">
                      <CardHeader className="p-3 sm:p-4"> {/* Adjusted padding */}
                         <div className="flex items-start sm:items-center gap-2 sm:gap-3"> {/* Adjusted gap and alignment */}
                            <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary mt-1 sm:mt-0" /> {/* Adjusted icon size */}
                            <div>
                                <CardTitle className="text-lg sm:text-xl font-headline">{arkUpgrade.name}</CardTitle> {/* Adjusted text size */}
                                <CardDescription className="text-sm text-muted-foreground mt-0.5 sm:mt-1">{arkUpgrade.description}</CardDescription> {/* Adjusted text size, margin */}
                            </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-4 pt-0"> {/* Adjusted padding */}
                        <p className="text-base">Status: <span className={isPurchased ? "text-green-400 font-semibold" : "text-orange-400 font-semibold"}>{isPurchased ? 'Installed' : 'Pending Installation'}</span></p> {/* Adjusted text size */}
                      </CardContent>
                      <CardFooter className="p-3 sm:p-4 pt-0"> {/* Adjusted padding */}
                        <Button 
                          onClick={() => purchaseArkUpgrade(arkUpgrade.id)} 
                          disabled={isPurchased || playerProfile.points < arkUpgrade.cost}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-2" /* Adjusted text size, padding */
                          size="default"
                        >
                          {isPurchased ? 'Installed' : `Install (${arkUpgrade.cost} Pts)`}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}
        </ScrollArea>
        {/* CSS variables for dynamic height calculation (optional, can be refined) */}
        <style jsx>{`
          :root {
            --app-header-h: 60px; 
            --page-title-h: 60px; /* Approx height of page title "Armory & Enhancements" */
            --bottom-nav-h: 56px;
          }
           @media (min-width: 640px) { /* sm breakpoint */
            :root {
              --app-header-h: 68px;
              --page-title-h: 70px;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default UpgradesPage;

    