
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import PlayerSetup from '@/components/player/PlayerSetup';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronUp, Zap, ShieldCheck, PlusCircle } from 'lucide-react'; // Example icons

const UpgradesPage: React.FC = () => {
  const { playerProfile, upgrades, getUpgradeLevel, purchaseUpgrade, getUpgradeCost, isLoading, isInitialSetupDone, arkUpgrades, purchaseArkUpgrade, getArkUpgradeById } = useGame();

  if (isLoading) {
     return (
      <AppLayout>
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-1/3 mb-4" />
          {[1,2,3].map(i => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
              <CardContent><Skeleton className="h-4 w-3/4" /></CardContent>
              <CardFooter><Skeleton className="h-10 w-24" /></CardFooter>
            </Card>
          ))}
        </div>
      </AppLayout>
    );
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }
  
  if (!playerProfile) return null;

  const regularUpgrades = upgrades.filter(u => !u.id.startsWith('ark_')); // Example differentiation

  return (
    <AppLayout>
      <div className="pb-16"> {/* Padding for bottom nav */}
        <h1 className="text-3xl font-headline text-primary mb-6 px-4 pt-4">Armory & Enhancements</h1>
        
        <ScrollArea className="h-[calc(100vh-200px)] px-4"> {/* Adjust height as needed */}
          <section className="mb-8">
            <h2 className="text-2xl font-headline text-accent mb-4">Commander Upgrades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regularUpgrades.map(upgrade => {
                const level = getUpgradeLevel(upgrade.id);
                const cost = getUpgradeCost(upgrade.id);
                const Icon = upgrade.icon || PlusCircle;
                return (
                  <Card key={upgrade.id} className="bg-card text-card-foreground shadow-lg">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Icon className="h-8 w-8 text-primary" />
                        <div>
                          <CardTitle className="text-xl font-headline">{upgrade.name}</CardTitle>
                          <CardDescription className="text-muted-foreground">{upgrade.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">Current Level: <span className="font-semibold text-primary">{level}</span></p>
                      <p className="text-sm">{upgrade.effectDescription(level)}</p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => purchaseUpgrade(upgrade.id)} 
                        disabled={playerProfile.points < cost || (upgrade.maxLevel && level >= upgrade.maxLevel)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
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
            <section className="mb-8">
              <h2 className="text-2xl font-headline text-accent mb-4">Ark Hangar</h2>
               <CardDescription className="text-muted-foreground mb-3">Upgrade your StarForge Ark. Fully upgrade to earn the exclusive Founder's Ark NFT!</CardDescription>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {arkUpgrades.map(arkUpgrade => {
                  const isPurchased = !!playerProfile.upgrades[arkUpgrade.id];
                  const Icon = ChevronUp; // Placeholder
                  return (
                    <Card key={arkUpgrade.id} className="bg-card text-card-foreground shadow-lg">
                      <CardHeader>
                         <div className="flex items-center gap-3">
                            <Icon className="h-8 w-8 text-primary" />
                            <div>
                                <CardTitle className="text-xl font-headline">{arkUpgrade.name}</CardTitle>
                                <CardDescription className="text-muted-foreground">{arkUpgrade.description}</CardDescription>
                            </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Status: <span className={isPurchased ? "text-green-400 font-semibold" : "text-orange-400 font-semibold"}>{isPurchased ? 'Installed' : 'Pending Installation'}</span></VCardContent>
                      <CardFooter>
                        <Button 
                          onClick={() => purchaseArkUpgrade(arkUpgrade.id)} 
                          disabled={isPurchased || playerProfile.points < arkUpgrade.cost}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
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
      </div>
    </AppLayout>
  );
};

export default UpgradesPage;
