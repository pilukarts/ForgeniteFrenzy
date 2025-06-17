
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
      <header className="sticky top-0 z-50 p-2 sm:p-3 bg-background/80 backdrop-blur-md shadow-md"> {/* Reduced padding on mobile */}
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
                className="bg-primary/20 border-primary text-primary-foreground hover:bg-primary/30 whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3" // Made button more compact on mobile
                onClick={connectWallet}
              >
               <Wallet className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-bright-gold" /> Secure Rewards
             </Button>
          )}
        </div>
      </header>
      
      {/* Adjusted bottom padding to account for new BottomNavBar height (h-14 = 56px) and some spacing (p-4=16px), total ~72px = pb-18 */}
      <main className="flex-grow container mx-auto px-2 sm:px-4 pt-2 sm:pt-4 pb-18 relative"> {/* Reduced horizontal and top padding on mobile */}
        {children}
      </main>
      
      {playerProfile && <CoreDisplay />}
      
      <BottomNavBar />
    </div>
  );
};

export default AppLayout;

