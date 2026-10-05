
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
import images from '@/lib/images';

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
        toast({
          title: 'Open Auron Vanguard in Telegram',
          description: 'Auron purchases are only available through the connected Telegram Wallet.',
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
      <div className="relative min-h-full overflow-hidden bg-[radial-gradient(circle_at_15%_10%,rgba(0,229,255,0.14),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.16),transparent_32%),linear-gradient(180deg,rgba(4,10,28,0.98),rgba(8,8,22,0.98))]">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(74,222,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,255,0.08)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="relative mx-2 mt-2 overflow-hidden rounded-2xl border border-cyan-300/30 bg-slate-950/70 px-4 py-4 shadow-[0_0_35px_rgba(34,211,238,0.12)] sm:mx-4 sm:flex sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-cyan-300">ARK Deck 07 · Galactic Exchange</p>
            <h1 className="mt-1 text-2xl font-headline text-white sm:text-4xl">Auron Holographic Market</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-300">Acquire field modules, recharge technology and prepare your commander for the next sector.</p>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-3 shadow-[inset_0_0_22px_rgba(251,191,36,0.08)] sm:mt-0">
            <Sparkles className="h-6 w-6 text-bright-gold" />
            <div><span className="block text-[10px] uppercase tracking-[0.24em] text-amber-200/70">Available balance</span><span className="text-xl font-black text-bright-gold">{playerProfile.auron.toLocaleString()} AURON</span></div>
          </div>
        </div>
        
        <ScrollArea className="relative h-[calc(100vh-var(--app-header-h,60px)-var(--page-header-h,80px)-var(--bottom-nav-h,56px))] px-2 pt-5 sm:px-4">
          
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
            <div className="mb-3"><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300">Free transmission</p><h2 className="text-xl sm:text-2xl font-headline text-white">Alliance Broadcast Center</h2></div>
            <Card className="border-cyan-300/30 bg-cyan-950/30 text-card-foreground shadow-[0_0_28px_rgba(34,211,238,0.1)] flex flex-col items-center p-4">
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
            <div className="mb-3"><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-300">Telegram Wallet Bay</p><h2 className="text-xl sm:text-2xl font-headline text-white">Auron Energy Crystals</h2><p className="text-sm text-slate-400">Secure purchases activate only inside Telegram with your connected wallet.</p></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {auronPackages.map(pkg => {
                const Icon = pkg.icon;
                return (
                  <Card key={pkg.id} className="group overflow-hidden border-violet-300/25 bg-violet-950/25 text-card-foreground shadow-[0_0_24px_rgba(168,85,247,0.08)] flex flex-col relative transition hover:-translate-y-1 hover:border-violet-300/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.18)]">
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
                      <Button onClick={() => handleAuronPurchase(pkg)} disabled={!isTelegramEnv} className="w-full bg-violet-500 hover:bg-violet-400 text-white text-base disabled:bg-slate-700 disabled:text-slate-400">
                        {isTelegramEnv ? `Continue · ${pkg.price} TON` : 'Telegram only'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Item Shop Section */}
           <section>
              <div className="mb-3"><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300">Power Modules</p><h2 className="text-xl sm:text-2xl font-headline text-white">Commander Field Boosts</h2><p className="text-sm text-slate-400">Spend earned Auron on tactical boosts. Every module shows its exact strength and duration.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {marketplaceItems.map(item => {
                  const Icon = item.icon || HelpCircle; 
                  return (
                    <Card key={item.id} className="group border-amber-300/25 bg-slate-950/70 text-card-foreground shadow-[0_0_22px_rgba(251,191,36,0.07)] flex flex-col transition hover:-translate-y-1 hover:border-amber-300/60">
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
                        <div className="grid grid-cols-2 gap-2"><div className="rounded-lg border border-cyan-300/20 bg-cyan-300/5 p-2 text-center"><span className="block text-[10px] uppercase tracking-wider text-slate-400">Power</span><strong className="text-cyan-300">+{Math.round((item.bonusEffect.multiplier - 1) * 100)}%</strong></div><div className="rounded-lg border border-violet-300/20 bg-violet-300/5 p-2 text-center"><span className="block text-[10px] uppercase tracking-wider text-slate-400">Duration</span><strong className="text-violet-300">{item.bonusEffect.durationTaps} taps</strong></div></div>
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
                          {playerProfile.auron < item.costInAuron ? 'Not enough Auron' : 'Activate Module'}
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
