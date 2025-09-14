
"use client";
import React, { ReactNode, useState, useEffect } from 'react';
import BottomNavBar from '../navigation/BottomNavBar';
import PlayerProfileHeader from '@/components/player/PlayerProfileHeader';
import ResourceDisplay from '@/components/game/ResourceDisplay';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { Wallet, CreditCard, Loader2 } from 'lucide-react'; 
import CoreDisplay from '@/components/core/CoreDisplay';
import Link from 'next/link';
import IntroScreen from '../intro/IntroScreen';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { playerProfile, connectWallet, currentSeason, isLoading } = useGame();
  const spaceImageUrl = "https://i.imgur.com/foWm9FG.jpeg";
  
  if (isLoading || !playerProfile) {
    return <IntroScreen />;
  }

  const seasonProgress = playerProfile?.seasonProgress?.[currentSeason.id] ?? 0;

  return (
    <>
    <div 
      className="flex flex-col min-h-screen bg-background text-foreground items-center justify-center p-0 sm:p-4"
      style={{
        backgroundImage: `url('${spaceImageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        animation: 'pan-background-global 90s linear infinite',
      }}
    >
      <div className="relative flex flex-col w-full h-full max-w-md bg-background/95 shadow-2xl overflow-hidden sm:rounded-2xl border border-border/20">
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 p-2 bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50">
            <div className="flex items-center justify-between gap-2">
              <PlayerProfileHeader profile={playerProfile} />
              <div className="flex items-start gap-1">
                <ResourceDisplay 
                  seasonResourceAmount={seasonProgress}
                  auronCount={playerProfile.auron ?? 0} 
                />
                <div className="flex flex-col items-start gap-1 ml-1 pl-1 border-l border-border">
                    {!playerProfile.isWalletConnected && (
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
                                if (connected && account?.address) {
                                    connectWallet(account.address);
                                }
                            }, [connected, account?.address, connectWallet]);

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
                                  return null;
                                })()}
                              </div>
                            );
                          }}
                        </ConnectButton.Custom>
                    )}
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
          
          <main className="flex-grow overflow-y-auto pb-[56px] sm:pb-[60px]">
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
