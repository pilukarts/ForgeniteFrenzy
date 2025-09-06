import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { getLeaderboardFromFirestore } from '@/lib/firestore';
import LeaderboardTable from './LeaderboardTable'; // We will create this component

export const revalidate = 60; // Re-fetch leaderboard data every 60 seconds

const LeaderboardPage = async () => {
  const leaderboardData = await getLeaderboardFromFirestore();

  return (
    <AppLayout>
      <LeaderboardTable initialLeaderboardData={leaderboardData} />
    </AppLayout>
  );
};

export default LeaderboardPage;
