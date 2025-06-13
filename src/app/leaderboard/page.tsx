
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
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline text-primary">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center text-muted-foreground">Rank</TableHead>
              <TableHead className="text-muted-foreground">Commander</TableHead>
              <TableHead className="text-right text-muted-foreground">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry) => (
              <TableRow key={entry.playerId} className={entry.playerId === playerProfile.id ? 'bg-primary/10' : ''}>
                <TableCell className="font-medium text-center text-lg">
                  {entry.rank === 1 && <Trophy className="inline-block h-5 w-5 text-bright-gold mr-1" />}
                  {entry.rank}
                </TableCell>
                <TableCell>
                  <span className="mr-2">{entry.playerCountry}</span>
                  {entry.playerName}
                  {entry.playerId === playerProfile.id && <span className="ml-2 text-xs text-primary">(You)</span>}
                </TableCell>
                <TableCell className="text-right font-mono text-primary">{entry.score.toLocaleString()}</TableCell>
              </TableRow>
            ))}
             {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">No data available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      <div className="pb-16 px-4 pt-4"> {/* Padding for bottom nav */}
        <h1 className="text-3xl font-headline text-primary mb-6">Leaderboards</h1>
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-1 mb-4 md:grid-cols-2 bg-background"> {/* Adjusted for single tab for now */}
            <TabsTrigger value="global" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Global Rankings</TabsTrigger>
            {/* <TabsTrigger value="country">Country Rankings</TabsTrigger> */}
          </TabsList>
          <TabsContent value="global">
            {renderLeaderboardTable(globalLeaderboard, "Global Top Commanders", <Globe className="h-6 w-6" />)}
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
