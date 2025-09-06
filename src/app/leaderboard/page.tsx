
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import LeaderboardTable from './LeaderboardTable';
import { fetchLeaderboardData } from '@/lib/server/data';

const LeaderboardPage = async () => {
  const initialLeaderboardData = await fetchLeaderboardData();

  return (
    <AppLayout>
      <LeaderboardTable initialLeaderboardData={initialLeaderboardData} />
    </AppLayout>
  );
};

export default LeaderboardPage;
