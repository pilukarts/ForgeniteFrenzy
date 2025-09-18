
"use client";
import React, { ReactNode, useEffect } from 'react';
import BottomNavBar from '../navigation/BottomNavBar';
import SidebarNav from '../navigation/SidebarNav';
import PlayerProfileHeader from '@/components/player/PlayerProfileHeader';
import ResourceDisplay from '@/components/game/ResourceDisplay';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { Wallet, CreditCard } from 'lucide-react'; 
import CoreDisplay from '@/components/core/CoreDisplay';
import Link from 'next/link';
import IntroScreen from '../intro/IntroScreen';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { playerProfile, connectWallet, currentSeason, isLoading, isInitialSetupDone } = useGame();
  const spaceImageUrl = "https://i.imgur.com/foWm9FG.jpeg";
  
  if (isLoading) {
    return <IntroScreen />;
  }
  
  if (!isInitialSetupDone || !playerProfile) {
    // PlayerSetup will be handled by the page itself (e.g., HomePage)
    // We just render the children, which will show PlayerSetup if needed.
    return <>{children}</>;
  }


  const seasonProgress = playerProfile.seasonProgress?.[currentSeason.id] ?? 0;

  return (
    <>
      <div 
        className="flex flex-col min-h-screen bg-background text-foreground items-center justify-center p-0 md:p-4"
        style={{
          backgroundImage: `url('${spaceImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'pan-background-global 90s linear infinite',
        }}
      >
        <div className="relative flex w-full h-screen max-w-7xl bg-background/95 shadow-2xl overflow-hidden md:rounded-2xl border-border/20">
          <SidebarNav />
          <div className="flex flex-col flex-grow min-h-screen">
            <header className="sticky top-0 z-50 p-2 bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50">
              <div className="flex items-center justify-between gap-2">
                <PlayerProfileHeader profile={playerProfile} />
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
                          }, [connected, account?.address, connectWallet, playerProfile.isWalletConnected]);

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
