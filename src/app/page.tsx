
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CommanderPortrait from '@/components/game/CommanderPortrait';
import PlayerSetup from '@/components/player/PlayerSetup';
import { useGame } from '@/contexts/GameContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User, UserRound, CheckCircle2, ShieldEllipsis } from 'lucide-react';

export default function HomePage() {
  const { playerProfile, isLoading, isInitialSetupDone, handleTap, switchCommanderSex } = useGame();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-64 w-64 rounded-full mb-4" />
        <Skeleton className="h-8 w-3/4" />
      </div>
    );
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  if (!playerProfile) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            Error: Player profile not loaded.
        </div>
    );
  }
  

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center text-center h-full pt-4 pb-16"> {/* pb-16 for bottom nav space */}
        <CommanderPortrait 
          commanderSex={playerProfile.commanderSex} 
          onTap={handleTap} 
        />
        <p className="mt-20 text-lg font-semibold text-primary font-headline">
          Tap Commander to Generate Points
        </p>
        <p className="text-sm text-muted-foreground">
          Current Objective: {playerProfile.currentSeasonId ? playerProfile.seasonProgress[playerProfile.currentSeasonId] || 0 : 0} Points
        </p>

        <Button onClick={switchCommanderSex} variant="outline" className="mt-4 text-foreground hover:text-accent-foreground hover:bg-accent">
          {playerProfile.commanderSex === 'male' ? (
            <>Switch to <UserRound className="inline-block ml-1 mr-1 h-5 w-5" /> Female Commander</>
          ) : (
            <>Switch to <User className="inline-block ml-1 mr-1 h-5 w-5" /> Male Commander</>
          )}
        </Button>

        {playerProfile.equippedUniformPieces && playerProfile.equippedUniformPieces.length > 0 && (
          <div className="mt-6 text-center w-full max-w-xs p-3 bg-card/50 rounded-lg shadow">
            <h3 className="text-md font-semibold text-accent flex items-center justify-center">
              <ShieldEllipsis className="h-5 w-5 mr-2"/>
              Black Uniform Progress
            </h3>
            <ul className="mt-2 text-sm text-muted-foreground list-none p-0 space-y-1">
              {playerProfile.equippedUniformPieces.map(piece => (
                <li key={piece} className="flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />
                  <span>{piece}</span>
                </li>
              ))}
            </ul>
            {playerProfile.equippedUniformPieces.length < 5 && ( // Assuming 5 pieces total
                 <p className="text-xs text-muted-foreground/70 mt-2">
                    Next piece at: { (playerProfile.equippedUniformPieces.length + 1) * 2000 } taps
                </p>
            )}
             {playerProfile.equippedUniformPieces.length === 5 && (
                 <p className="text-xs text-green-400 font-semibold mt-2">
                    Black Uniform Complete!
                </p>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

    