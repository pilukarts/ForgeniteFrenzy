
"use client";
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import type { LeaderboardEntry, LeagueName } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlayerSetup from '@/components/player/PlayerSetup';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Globe, Flag, Shield, ShieldCheck, Award, Gem, Star, Crown, Sparkles, LucideIcon } from 'lucide-react';
import IntroScreen from '@/components/intro/IntroScreen';
import { getLeagueByPoints, getLeagueIconAndColor } from '@/lib/gameData';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle } from 'lucide-react';
import { countries } from '@/lib/countries';

const LeaderboardPage: React.FC = () => {
  const { playerProfile, isLoading, isInitialSetupDone } = useGame();
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const generateMockLeaderboard = (count: number): LeaderboardEntry[] => {
      const mockData: LeaderboardEntry[] = [];
      const firstNames = ['Li', 'Maria', 'Nushi', 'Jose', 'Mohammed', 'Wei', 'Anna', 'David', 'Fatima', 'Santiago', 'Olga', 'Kenji', 'Sofia', 'Ahmed', 'Lars', 'Isabella'];
      const lastNames = ['Chen', 'Garcia', 'Patel', 'Gonzalez', 'Khan', 'Smith', 'Ivanova', 'Kim', 'Rodriguez', 'Tanaka', 'Müller', 'Silva', 'Nguyen', 'Jones'];
      
      for (let i = 1; i <= count; i++) {
        // Create a more realistic score distribution (exponential decay)
        const score = Math.floor(10000000 * Math.exp(-i / 20) * (1 + Math.random() * 0.1));
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        const sex = Math.random() > 0.5 ? 'male' : 'female';

        mockData.push({
          rank: i,
          playerId: `player_${i}`,
          playerName: `Cmdr. ${randomFirstName} ${randomLastName}`,
          country: randomCountry.code,
          score: score,
          playerLeague: getLeagueByPoints(score),
          avatarUrl: `https://picsum.photos/seed/${sex}${i}/200`
        });
      }
      
      if (playerProfile) {
        const playerEntry: LeaderboardEntry = {
            rank: 0, 
            playerId: playerProfile.id,
            playerName: playerProfile.name,
            country: playerProfile.country,
            score: playerProfile.points,
            playerLeague: playerProfile.league,
            avatarUrl: playerProfile.avatarUrl,
        };
        
        const existingPlayerIndex = mockData.findIndex(p => p.playerId === playerProfile.id);
        if (existingPlayerIndex !== -1) {
            mockData.splice(existingPlayerIndex, 1);
        }
        mockData.push(playerEntry);
        mockData.sort((a, b) => b.score - a.score);
        mockData.forEach((entry, index) => entry.rank = index + 1);
      }
      return mockData.slice(0, 50); 
    };

    setGlobalLeaderboard(generateMockLeaderboard(50));
  }, [playerProfile]);

   if (isLoading) {
     return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }
  
  if (!playerProfile) return null;

  const renderLeaderboardTable = (data: LeaderboardEntry[], title: string, icon: React.ReactNode) => {
    return (
        <Card className="shadow-xl bg-card text-card-foreground">
        <CardHeader className="p-4 sm:p-6"> 
            <CardTitle className="flex items-center text-xl sm:text-2xl font-headline text-primary"> 
            {icon}
            <span className="ml-2">{title}</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-2"> 
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[40px] sm:w-[50px] text-center text-muted-foreground text-sm">Rank</TableHead> 
                <TableHead className="text-muted-foreground text-base">Commander</TableHead> 
                <TableHead className="text-right text-muted-foreground text-base">Score</TableHead> 
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((entry) => {
                const { Icon: LeagueIcon, colorClass: leagueColorClass } = getLeagueIconAndColor(entry.playerLeague);
                const flagSrc = `https://flags.fmcdn.net/data/flags/w580/${entry.country.toLowerCase()}.png`;
                const avatarSrc = entry.avatarUrl || "https://picsum.photos/seed/default/200";
                const dataAiHint = "commander portrait";

                return (
                    <TableRow key={entry.playerId} className={entry.playerId === playerProfile.id ? 'bg-primary/10' : ''}>
                    <TableCell className="font-medium text-center text-lg px-2 sm:px-4"> 
                        {entry.rank === 1 && <Trophy className="inline-block h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-1" />}
                        {entry.rank === 2 && <Trophy className="inline-block h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-1" />}
                        {entry.rank === 3 && <Trophy className="inline-block h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-1" />}
                        {entry.rank}
                    </TableCell>
                    <TableCell className="text-base px-2 sm:px-4"> 
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 border border-primary/50">
                                <AvatarImage src={avatarSrc} alt={entry.playerName} data-ai-hint={dataAiHint} />
                                <AvatarFallback>
                                    <UserCircle className="h-5 w-5"/>
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <div className="flex items-center">
                                  <LeagueIcon className={cn("h-3.5 w-3.5 mr-1.5 shrink-0", leagueColorClass)} />
                                  <span className="font-semibold">{entry.playerName}</span>
                                  {entry.playerId === playerProfile.id && <span className="ml-1 sm:ml-2 text-primary text-xs">(You)</span>}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Image src={flagSrc} alt={entry.country} width={16} height={12} className="rounded-sm" data-ai-hint="country flag" />
                                    <span>{countries.find(c => c.code === entry.country)?.name || entry.country}</span>
                                </div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-primary text-base px-2 sm:px-4">{entry.score.toLocaleString()}</TableCell> 
                    </TableRow>
                );
                })}
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
  };


  return (
    <AppLayout>
      <div className="px-0 sm:px-4 pt-2 sm:pt-4"> 
        <h1 className="text-2xl sm:text-3xl font-headline text-primary mb-4 sm:mb-6 px-2 sm:px-0">Leaderboards</h1> 
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-1 mb-3 sm:mb-4 md:grid-cols-2 bg-background"> 
            <TabsTrigger value="global" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base">Global Rankings</TabsTrigger> 
          </TabsList>
          <TabsContent value="global">
            {renderLeaderboardTable(globalLeaderboard, "Global Top Commanders", <Globe className="h-5 w-5 sm:h-6 sm:w-6" />)}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default LeaderboardPage;
