
"use client";
import React, { ReactNode } from 'react';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import PlayerProfileHeader from '@/components/player/PlayerProfileHeader';
import ResourceDisplay from '@/components/game/ResourceDisplay';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { Wallet } from 'lucide-react';
import CoreDisplay from '@/components/core/CoreDisplay';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { playerProfile, connectWallet } = useGame();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 p-3 bg-background/80 backdrop-blur-md shadow-md">
        <div className="container mx-auto flex items-center justify-between gap-2">
          {playerProfile && (
            <>
              <PlayerProfileHeader profile={playerProfile} />
              <ResourceDisplay 
                seasonResourceName={playerProfile ? playerProfile.seasonProgress[playerProfile.currentSeasonId]?.toString() ?? '0' : '0'} 
                auronCount={playerProfile?.auron ?? 0} 
              />
            </>
          )}
          {!playerProfile?.isWalletConnected && (
             <Button 
                variant="outline" 
                size="sm" 
                className="bg-primary/20 border-primary text-primary-foreground hover:bg-primary/30 whitespace-nowrap"
                onClick={connectWallet}
              >
               <Wallet className="mr-2 h-4 w-4 text-bright-gold" /> Secure Rewards
             </Button>
          )}
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4 relative">
        {children}
      </main>
      
      {playerProfile && <CoreDisplay />}
      
      <BottomNavBar />
    </div>
  );
};

export default AppLayout;
