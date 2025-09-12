

"use client";
import React, { ReactNode, useState, useRef, useEffect } from 'react';
import BottomNavBar from '../navigation/BottomNavBar';
import PlayerProfileHeader from '@/components/player/PlayerProfileHeader';
import ResourceDisplay from '@/components/game/ResourceDisplay';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { Wallet, CreditCard, Loader2 } from 'lucide-react'; 
import CoreDisplay from '@/components/core/CoreDisplay';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import IntroScreen from '../intro/IntroScreen';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';


const WalletConnectDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}> = ({ isOpen, onClose, onConnect }) => {
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnectClick = () => {
        setIsConnecting(true);
        // Simulate a delay for connecting to the wallet
        setTimeout(() => {
            onConnect();
            setIsConnecting(false);
            onClose();
        }, 1500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline text-primary text-center">Connect Your Wallet</DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Connect your wallet to unlock exclusive Ark Hangar upgrades and receive a one-time bonus of 100 Auron.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-3">
                    <Button 
                        className="w-full h-14 text-lg justify-start" 
                        variant="outline" 
                        onClick={handleConnectClick}
                        disabled={isConnecting}
                    >
                        {isConnecting ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Image src="https://i.imgur.com/gZ2D7XG.png" alt="MetaMask" width={28} height={28} className="mr-3" data-ai-hint="metamask fox" />
                        )}
                        MetaMask (Simulated)
                    </Button>
                    <Button 
                        className="w-full h-14 text-lg justify-start" 
                        variant="outline" 
                        onClick={handleConnectClick}
                        disabled={isConnecting}
                    >
                         {isConnecting ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Image src="https://i.imgur.com/J3h23L2.png" alt="Coinbase" width={28} height={28} className="mr-3" data-ai-hint="coinbase logo" />
                        )}
                        Coinbase Wallet (Simulated)
                    </Button>
                    <Button 
                        className="w-full h-14 text-lg justify-start" 
                        variant="outline" 
                        onClick={handleConnectClick}
                        disabled={isConnecting}
                    >
                         {isConnecting ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Image src="https://i.imgur.com/3g7bZ7I.png" alt="Cronos" width={28} height={28} className="mr-3" data-ai-hint="cronos logo" />
                        )}
                        Cronos | Crypto.com (Simulated)
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};


interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { playerProfile, connectWallet, currentSeason, isLoading, isInitialSetupDone } = useGame();
  const [isWalletDialogOpen, setWalletDialogOpen] = useState(false);
  const spaceImageUrl = "https://i.imgur.com/foWm9FG.jpeg";


  
  // This is the new, centralized loading logic.
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-primary/20 border-primary text-primary-foreground hover:bg-primary/30 whitespace-nowrap text-xs px-2 h-7 w-full justify-start"
                          onClick={() => setWalletDialogOpen(true)}
                        >
                        <Wallet className="mr-1.5 h-3 w-3 text-bright-gold" /> Connect
                      </Button>
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
       <WalletConnectDialog
            isOpen={isWalletDialogOpen}
            onClose={() => setWalletDialogOpen(false)}
            onConnect={connectWallet}
        />
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
