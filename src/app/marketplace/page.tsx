
"use client";
import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import PlayerSetup from '@/components/player/PlayerSetup';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, HelpCircle, Gem, Clapperboard, Forward } from 'lucide-react';
import type { MarketplaceItem } from '@/lib/types';
import IntroScreen from '@/components/intro/IntroScreen';
import { useToast } from '@/hooks/use-toast';
import { REWARDED_AD_AURON_REWARD, REWARDED_AD_COOLDOWN_MINUTES } from '@/lib/gameData';
import Image from 'next/image';
import images from '@/lib/placeholder-images.json';

const auronPackages = [
  { id: 'auron_pack_1', amount: 100, price: 0.99, bestValue: false, icon: Gem },
  { id: 'auron_pack_2', amount: 550, price: 4.99, bestValue: true, icon: Gem },
  { id: 'auron_pack_3', amount: 1200, price: 9.99, bestValue: false, icon: Gem },
  { id: 'auron_pack_4', amount: 2500, price: 19.99, bestValue: false, icon: Gem },
];


const MarketplacePage: React.FC = () => {
  const { 
    playerProfile, 
    marketplaceItems, 
    purchaseMarketplaceItem, 
    isLoading, 
    isInitialSetupDone, 
    addPoints, 
    setPlayerProfile,
    watchRewardedAd,
    rewardedAdCooldown,
    isWatchingAd,
    isTelegramEnv,
    connectTelegramWallet,
    purchaseWithTelegramWallet,
  } = useGame();
  const { toast } = useToast();
  
  const [cooldownTime, setCooldownTime] = useState('');

  useEffect(() => {
    if (rewardedAdCooldown > 0) {
      const interval = setInterval(() => {
        const minutes = Math.floor(rewardedAdCooldown / 60000);
        const seconds = Math.floor((rewardedAdCooldown % 60000) / 1000);
        setCooldownTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [rewardedAdCooldown]);


  const handleAuronPurchase = (pkg: { amount: number; price: number; }) => {
    if (!playerProfile) return;

    if (isTelegramEnv && playerProfile.isTelegramWalletConnected) {
        purchaseWithTelegramWallet(pkg);
    } else {
        setPlayerProfile(prev => prev ? { ...prev, auron: prev.auron + pkg.amount } : null);
        toast({
          title: 'Purchase Successful (Simulated)',
          description: `You've received ${pkg.amount.toLocaleString()} Auron.`,
        });
    }
  };

  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  if (!playerProfile) return null;

  return (
    <>
      <div className=""> 
        <div className="flex flex-col sm:flex-row justify-between items-center px-2 sm:px-4 pt-2 sm:pt-4 mb-4 sm:mb-6 gap-2">
            <h1 className="text-2xl sm:text-3xl font-headline text-primary">Auron & Item Shop</h1>
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-card text-card-foreground shadow">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-bright-gold" />
                <span className="text-lg font-semibold text-bright-gold">{playerProfile.auron}</span>
                <span className="text-sm text-muted-foreground">Auron</span>
            </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-var(--app-header-h,60px)-var(--page-header-h,80px)-var(--bottom-nav-h,56px))] px-2 sm:px-4">
          
          {isTelegramEnv && !playerProfile.isTelegramWalletConnected && (
            <section className="mb-6 sm:mb-8">
                 <Card className="bg-blue-500/10 border-blue-400/50 text-card-foreground shadow-lg flex flex-col items-center p-4">
                    <CardHeader className="items-center text-center p-2">
                         <Image src={images.ui.telegram_wallet} alt="Telegram Wallet" width={48} height={48} data-ai-hint="telegram wallet" />
                        <CardTitle className="text-lg sm:text-xl font-semibold text-blue-300 mt-2">Connect Telegram Wallet</CardTitle>
                        <CardDescription className="text-base text-muted-foreground mt-1">
                            Connect your wallet to purchase Auron with Toncoin (TON).
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="w-full">
                        <Button 
                            onClick={connectTelegramWallet}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        >
                           Connect Wallet
                        </Button>
                    </CardFooter>
                 </Card>
            </section>
          )}

          {/* Rewarded Ad Section */}
          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-headline text-accent mb-3 sm:mb-4">Broadcast Center</h2>
            <Card className="bg-card text-card-foreground shadow-lg flex flex-col items-center p-4">
              <CardHeader className="items-center text-center p-2">
                <Clapperboard className="h-10 w-10 text-primary" />
                <CardTitle className="text-lg sm:text-xl font-semibold text-primary mt-2">Watch Ad</CardTitle>
                <CardDescription className="text-base text-muted-foreground mt-1">
                  Watch an Alliance broadcast to receive a free reward.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg font-semibold text-bright-gold flex items-center justify-center">
                  <Sparkles className="h-5 w-5 mr-1.5" />
                  Earn {REWARDED_AD_AURON_REWARD} Auron
                </p>
              </CardContent>
              <CardFooter className="w-full">
                <Button 
                  onClick={watchRewardedAd} 
                  disabled={rewardedAdCooldown > 0 || isWatchingAd}
                  className="w-full"
                >
                  {isWatchingAd ? 'Watching Broadcast...' : rewardedAdCooldown > 0 ? `Next in: ${cooldownTime}` : 'Watch Now'}
                </Button>
              </CardFooter>
            </Card>
          </section>

          {/* Buy Auron Section */}
          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-headline text-accent mb-3 sm:mb-4">Purchase Auron</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {auronPackages.map(pkg => {
                const Icon = pkg.icon;
                return (
                  <Card key={pkg.id} className="bg-card text-card-foreground shadow-lg flex flex-col relative">
                     {pkg.bestValue && (
                        <div className="absolute top-0 -right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full rotate-12">
                          Best Value!
                        </div>
                      )}
                    <CardHeader className="items-center text-center p-3 sm:p-4">
                      <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-bright-gold" />
                      <CardTitle className="text-lg sm:text-xl font-semibold text-bright-gold mt-1">{pkg.amount.toLocaleString()} Auron</CardTitle>
                    </CardHeader>
                    <CardFooter className="mt-auto p-3 sm:p-4 pt-0">
                      <Button onClick={() => handleAuronPurchase(pkg)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base">
                        {isTelegramEnv ? `~${pkg.price} TON` : `$${pkg.price}`}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Item Shop Section */}
           <section>
              <h2 className="text-xl sm:text-2xl font-headline text-accent mb-3 sm:mb-4">Temporary Boosts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {marketplaceItems.map(item => {
                  const Icon = item.icon || HelpCircle; 
                  return (
                    <Card key={item.id} className="bg-card text-card-foreground shadow-lg flex flex-col">
                      <CardHeader className="p-3 sm:p-4">
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                          <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary mt-1 sm:mt-0" />
                          <div>
                            <CardTitle className="text-lg sm:text-xl font-headline">{item.name}</CardTitle>
                            <CardDescription className="text-base text-muted-foreground mt-0.5 sm:mt-1">{item.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow p-3 sm:p-4 pt-0">
                        <p className="text-base text-primary flex items-center">
                            Effect: +{Math.round((item.bonusEffect.multiplier - 1) * 100)}% Tap Power for {item.bonusEffect.durationTaps} taps.
                        </p>
                      </CardContent>
                      <CardFooter className="flex-col items-stretch space-y-1.5 sm:space-y-2 p-3 sm:p-4 pt-0">
                         <div className="flex items-center justify-center text-lg font-semibold mb-1 sm:mb-2">
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-bright-gold mr-1 sm:mr-1.5" />
                            <span>{item.costInAuron} Auron</span>
                        </div>
                        <Button 
                          onClick={() => purchaseMarketplaceItem(item.id)} 
                          disabled={playerProfile.auron < item.costInAuron}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-2 sm:py-2.5"
                          size="default"
                        >
                          Purchase
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
           </section>

           {playerProfile.activeTapBonuses && playerProfile.activeTapBonuses.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <h2 className="text-xl sm:text-2xl font-headline text-accent mb-2 sm:mb-3">Active Boosts</h2>
              <div className="space-y-1.5 sm:space-y-2">
                {playerProfile.activeTapBonuses.map(bonus => (
                  <Card key={bonus.id} className="bg-card/70 p-2 sm:p-3">
                    <p className="font-semibold text-primary text-base">{bonus.name}</p>
                    <p className="text-base text-muted-foreground">
                      +{ (bonus.bonusMultiplier - 1) * 100 }% tap power. {bonus.remainingTaps} / {bonus.originalDurationTaps} taps remaining.
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
        <style jsx>{`
          :root {
            --app-header-h: 60px;
            --page-header-h: 80px;
            --bottom-nav-h: 56px;
          }
          @media (min-width: 640px) {
            :root {
              --app-header-h: 68px;
              --page-header-h: 88px;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default MarketplacePage;
