
import React from 'react';
import LeaderboardTable from './LeaderboardTable';
import { fetchLeaderboardData } from '@/lib/server/data';

const LeaderboardPage = async () => {
  const initialLeaderboardData = await fetchLeaderboardData();

  return (
    <>
      <LeaderboardTable initialLeaderboardData={initialLeaderboardData} />
    </>
  );
};

export default LeaderboardPage;
