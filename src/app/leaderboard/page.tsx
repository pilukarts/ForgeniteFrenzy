"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { getLeaderboardFromFirestore } from '@/lib/firestore';
import LeaderboardTable from './LeaderboardTable';
import type { LeaderboardEntry } from '@/lib/types';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { Skeleton } from '@/components/ui/skeleton';

const LeaderboardPage: React.FC = () => {
  const { playerProfile, isLoading: isGameLoading, isInitialSetupDone } = useGame();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isBoardLoading, setIsBoardLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboardFromFirestore();
        setLeaderboardData(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setIsBoardLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (isGameLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone || !playerProfile) {
    return <PlayerSetup />;
  }
  
  if (isBoardLoading) {
      return (
          <AppLayout>
              <div className="p-4">
                  <h1 className="text-2xl sm:text-3xl font-headline text-primary mb-4 sm:mb-6">Leaderboards</h1>
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
              </div>
          </AppLayout>
      );
  }

  return (
    <AppLayout>
      <LeaderboardTable initialLeaderboardData={leaderboardData} />
    </AppLayout>
  );
};

export default LeaderboardPage;
