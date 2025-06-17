
"use client";
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import type { LeaderboardEntry } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlayerSetup from '@/components/player/PlayerSetup';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Globe, Flag } from 'lucide-react';
import IntroScreen from '@/components/intro/IntroScreen';

const LeaderboardPage: React.FC = () => {
  const { playerProfile, isLoading, isInitialSetupDone } = useGame();
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
  // const [countryLeaderboard, setCountryLeaderboard] = useState<LeaderboardEntry[]>([]); // For future use

  useEffect(() => {
    // Simulate fetching leaderboard data
    const generateMockLeaderboard = (count: number, isGlobal: boolean = true): LeaderboardEntry[] => {
      const mockData: LeaderboardEntry[] = [];
      for (let i = 1; i <= count; i++) {
        mockData.push({
          rank: i,
          playerId: `player_${i}`,
          playerName: `Commander ${String.fromCharCode(65 + (i % 26))}${i % 100}`,
          playerCountry: isGlobal ? ['🇺🇸', '🇨🇦', '🇬🇧', '🇩🇪', '🇯🇵'][i % 5] : playerProfile?.country || '🇺🇳',
          score: Math.floor(Math.random() * 1000000) + 50000,
        });
      }
      // Sort by score descending
      mockData.sort((a, b) => b.score - a.score);
      // Re-assign rank
      mockData.forEach((entry, index) => entry.rank = index + 1);
      
      // Add current player to the list if they exist
      if (playerProfile) {
        const playerEntry = {
            rank: 0, // will be updated
            playerId: playerProfile.id,
            playerName: playerProfile.name,
            playerCountry: playerProfile.country,
            score: playerProfile.points
        };
        
        // Check if player is already in mockData by chance (unlikely with random names but good practice)
        const existingPlayerIndex = mockData.findIndex(p => p.playerId === playerProfile.id);
        if (existingPlayerIndex !== -1) {
            mockData.splice(existingPlayerIndex, 1);
        }
        mockData.push(playerEntry);
        mockData.sort((a, b) => b.score - a.score);
        mockData.forEach((entry, index) => entry.rank = index + 1);
      }
      return mockData.slice(0, 50); // Show top 50
    };

    setGlobalLeaderboard(generateMockLeaderboard(50));
    // if (playerProfile) {
    //   setCountryLeaderboard(generateMockLeaderboard(20, false));
    // }
  }, [playerProfile]);

   if (isLoading) {
     return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }
  
  if (!playerProfile) return null;

  const renderLeaderboardTable = (data: LeaderboardEntry[], title: string, icon: React.ReactNode) => (
    <Card className="shadow-xl bg-card text-card-foreground">
      <CardHeader className="p-4 sm:p-6"> {/* Adjusted padding */}
        <CardTitle className="flex items-center text-xl sm:text-2xl font-headline text-primary"> {/* Adjusted text size */}
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-2"> {/* Adjusted padding */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] sm:w-[50px] text-center text-muted-foreground text-xs sm:text-sm">Rank</TableHead> {/* Adjusted width and text size */}
              <TableHead className="text-muted-foreground text-xs sm:text-sm">Commander</TableHead> {/* Adjusted text size */}
              <TableHead className="text-right text-muted-foreground text-xs sm:text-sm">Score</TableHead> {/* Adjusted text size */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry) => (
              <TableRow key={entry.playerId} className={entry.playerId === playerProfile.id ? 'bg-primary/10' : ''}>
                <TableCell className="font-medium text-center text-sm sm:text-lg px-2 sm:px-4"> {/* Adjusted padding and text size */}
                  {entry.rank === 1 && <Trophy className="inline-block h-4 w-4 sm:h-5 sm:w-5 text-bright-gold mr-1" />}
                  {entry.rank}
                </TableCell>
                <TableCell className="text-xs sm:text-sm px-2 sm:px-4"> {/* Adjusted padding and text size */}
                  <span className="mr-1 sm:mr-2">{entry.playerCountry}</span>
                  {entry.playerName}
                  {entry.playerId === playerProfile.id && <span className="ml-1 sm:ml-2 text-xs text-primary">(You)</span>}
                </TableCell>
                <TableCell className="text-right font-mono text-primary text-xs sm:text-sm px-2 sm:px-4">{entry.score.toLocaleString()}</TableCell> {/* Adjusted padding and text size */}
              </TableRow>
            ))}
             {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-4 sm:py-6">No data available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      {/* AppLayout now handles global bottom padding */}
      <div className="px-0 sm:px-4 pt-2 sm:pt-4"> 
        <h1 className="text-2xl sm:text-3xl font-headline text-primary mb-4 sm:mb-6 px-2 sm:px-0">Leaderboards</h1> {/* Adjusted text size and margin */}
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-1 mb-3 sm:mb-4 md:grid-cols-2 bg-background"> 
            <TabsTrigger value="global" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm sm:text-base">Global Rankings</TabsTrigger> {/* Adjusted text size */}
            {/* <TabsTrigger value="country">Country Rankings</TabsTrigger> */}
          </TabsList>
          <TabsContent value="global">
            {renderLeaderboardTable(globalLeaderboard, "Global Top Commanders", <Globe className="h-5 w-5 sm:h-6 sm:w-6" />)}
          </TabsContent>
          {/* <TabsContent value="country">
            {renderLeaderboardTable(countryLeaderboard, `${playerProfile.country} Top Commanders`, <Flag className="h-6 w-6" />)}
          </TabsContent> */}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default LeaderboardPage;

