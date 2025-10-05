
"use client";
import React, { ReactNode, useEffect, useState } from 'react';
import BottomNavBar from '../navigation/BottomNavBar';
import PlayerProfileHeader from '@/components/player/PlayerProfileHeader';
import ResourceDisplay from '@/components/game/ResourceDisplay';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { Wallet, CreditCard, Zap, AlertTriangle } from 'lucide-react'; 
import CoreDisplay from '@/components/core/CoreDisplay';
import Link from 'next/link';
import IntroScreen from '../intro/IntroScreen';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PlayerSetup from '../player/PlayerSetup';
import PreIntroScreen from '../intro/PreIntroScreen';
import SidebarNav from '../navigation/SidebarNav';
import { Card, CardContent } from '@/components/ui/card';
import images from '@/lib/placeholder-images.json';

interface AppLayoutProps {
  children: ReactNode;
}

const formatTimeLeft = (milliseconds: number): string => {
  if (milliseconds <= 0) return "00:00:00";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const TapStatusCard: React.FC = () => {
    const { playerProfile } = useGame();
    const [timeLeftForTapRegen, setTimeLeftForTapRegen] = useState<number | null>(null);

    useEffect(() => {
        if (!playerProfile) return;

        const calculateInitialTime = () => {
            const remaining = (playerProfile.tapsAvailableAt || 0) - Date.now();
            setTimeLeftForTapRegen(Math.max(0, remaining));
        };

        calculateInitialTime();

        const timerId = setInterval(() => {
            setTimeLeftForTapRegen(prevTime => {
                if (prevTime === null) return null;
                if (prevTime <= 1000) {
                    if (playerProfile.currentTaps < playerProfile.maxTaps) {
                        const remaining = (playerProfile.tapsAvailableAt || 0) - Date.now();
                        return Math.max(0, remaining);
                    }
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [playerProfile]);

    if (!playerProfile) return null;

    const isOutOfTaps = playerProfile.currentTaps <= 0 && timeLeftForTapRegen !== null && timeLeftForTapRegen > 0;

    return (
        <Card className="bg-card/50 shadow-sm flex-grow text-center p-1">
            <CardContent className="p-0">
                <p className="text-sm font-semibold text-primary font-headline flex items-center justify-center gap-1">
                    <Zap className="h-4 w-4"/> Taps: {playerProfile.currentTaps.toLocaleString()} / {playerProfile.maxTaps.toLocaleString()}
                </p>
                 {isOutOfTaps && timeLeftForTapRegen !== null && (
                    <p className="text-xs text-orange-400 animate-pulse">
                        Regen in: {formatTimeLeft(timeLeftForTapRegen)}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { playerProfile, connectWallet, currentSeason, isLoading, isInitialSetupDone, completeInitialSetup } = useGame();
  const spaceImageUrl = images.global.spaceBackground;
  
  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }
  
  if (!playerProfile) {
      return <IntroScreen />;
  }


  const seasonProgress = playerProfile?.seasonProgress?.[currentSeason.id] ?? 0;

  return (
    <>
    <div 
      className="flex flex-col min-h-screen bg-background text-foreground items-center justify-center"
      style={{
        backgroundImage: `url('${spaceImageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        animation: 'pan-background-global 90s linear infinite',
      }}
    >
      <div className="relative flex w-full h-full max-w-7xl mx-auto bg-background/95 shadow-2xl overflow-hidden md:h-screen">
          <SidebarNav />
          <div className="flex flex-col flex-grow min-h-screen">
            <header className="sticky top-0 z-50 p-2 bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50">
              <div className="flex items-center justify-between gap-2">
                <PlayerProfileHeader profile={playerProfile} />
                <TapStatusCard />
                <div className="flex items-start gap-1">
                  <ResourceDisplay 
                    seasonResourceAmount={seasonProgress}
                    auronCount={playerProfile.auron ?? 0} 
                  />
                  <div className="flex flex-col items-start gap-1 ml-1 pl-1 border-l border-border">
                    <ConnectButton.Custom>
                      {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                      }) => {
                        const ready = mounted && authenticationStatus !== 'loading';
                        const connected =
                          ready &&
                          account &&
                          chain &&
                          (!authenticationStatus ||
                            authenticationStatus === 'authenticated');

                        useEffect(() => {
                            if (connected && account?.address && !playerProfile.isWalletConnected) {
                                connectWallet(account.address);
                            }
                        }, [connected, account?.address]);

                        return (
                          <div
                            {...(!ready && {
                              'aria-hidden': true,
                              'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                              },
                            })}
                          >
                            {(() => {
                              if (!connected) {
                                return (
                                  <Button 
                                    onClick={openConnectModal}
                                    type="button"
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-primary/20 border-primary text-primary-foreground hover:bg-primary/30 whitespace-nowrap text-xs px-2 h-7 w-full justify-start"
                                  >
                                    <Wallet className="mr-1.5 h-3 w-3 text-bright-gold" /> Connect
                                  </Button>
                                );
                              }
                              
                              if (chain?.unsupported) {
                                return (
                                    <Button onClick={openChainModal} type="button" variant="destructive" size="sm" className="whitespace-nowrap text-xs px-2 h-7 w-full justify-start">
                                      Wrong network
                                    </Button>
                                );
                              }

                              return (
                                <div className="flex gap-x-1">
                                    <Button onClick={openChainModal} type="button" size="sm" variant="outline" className="text-xs px-2 h-7">
                                        {chain.hasIcon && (
                                            <div style={{ background: chain.iconBackground, width: 12, height: 12, borderRadius: 999, overflow: 'hidden', marginRight: 4, }} >
                                                {chain.iconUrl && ( <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} style={{ width: 12, height: 12 }} /> )}
                                            </div>
                                        )}
                                         {chain.name}
                                    </Button>
                                     <Button onClick={openAccountModal} type="button" size="sm" variant="outline" className="text-xs px-2 h-7">
                                        {account.displayName}
                                     </Button>
                                </div>
                              )
                            })()}
                          </div>
                        );
                      }}
                    </ConnectButton.Custom>
                    <Button asChild
                        variant="outline" 
                        size="sm" 
                        className="bg-primary/20 border-primary text-primary-foreground hover:bg-primary/30 whitespace-nowrap text-xs px-2 h-7 w-full justify-start"
                      >
                      <Link href="/marketplace">
                        <CreditCard className="mr-1.5 h-3 w-3" /> Buy
                      </Link>
                    </Button>
                  </div>
              </div>
            </div>
          </header>
          
          <main className="flex-grow overflow-y-auto pb-[56px] md:pb-0">
            {children}
          </main>
          
          <CoreDisplay />
          
          <BottomNavBar />
        </div>
      </div>
      <style jsx global>{`
        @keyframes pan-background-global {
            0% { background-position: 0% 50%; }
            50% { background-position: 10% 50%; }
            100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
    </>
  );
};

export default AppLayout;
