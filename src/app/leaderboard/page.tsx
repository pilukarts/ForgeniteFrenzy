
import { fetchLeaderboardData } from '@/lib/server/data';
import LeaderboardTable from './LeaderboardTable';

// This is a server-side rendered page
const LeaderboardPage = async () => {
  // Fetch data on the server
  const leaderboardData = await fetchLeaderboardData();

  // Pass the fetched data as a prop to the client component
  return <LeaderboardTable initialLeaderboardData={leaderboardData} />;
};

export default LeaderboardPage;
