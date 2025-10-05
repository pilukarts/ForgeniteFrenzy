
"use client";
import React, { useEffect, useState } from 'react';
import type { LeaderboardEntry } from '@/lib/types';
import { useGame } from '@/contexts/GameContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlayerSetup from '@/components/player/PlayerSetup';
import { Trophy, Globe, Loader2, SignalHigh, SignalLow, SignalMedium } from 'lucide-react';
import IntroScreen from '@/components/intro/IntroScreen';
import { getLeagueIconAndColor } from '@/lib/gameData';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle } from 'lucide-react';
import { countries } from '@/lib/countries';
import { formatDistanceToNow, parseISO } from 'date-fns';
import images from '@/lib/placeholder-images.json';

interface LeaderboardTableProps {
    initialLeaderboardData: LeaderboardEntry[];
}

const LastSeen: React.FC<{ lastSeen: Date | null | undefined }> = ({ lastSeen }) => {
    if (!lastSeen) {
        return null;
    }
    
    // Ensure lastSeen is a Date object
    const lastSeenDate = typeof lastSeen === 'string' ? parseISO(lastSeen) : lastSeen;
    
    const now = new Date();
    const diffHours = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60 * 60);

    let Icon = SignalHigh;
    let color = 'text-green-500';
    if (diffHours > 24) {
      Icon = SignalLow;
      color = 'text-red-500';
    } else if (diffHours > 4) {
      Icon = SignalMedium;
      color = 'text-yellow-500';
    }
    
    return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon className={cn("h-3.5 w-3.5", color)} />
            <span>
                {formatDistanceToNow(lastSeenDate, { addSuffix: true })}
            </span>
        </div>
    );
};


const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ initialLeaderboardData }) => {
  const { playerProfile, isLoading: isGameLoading, isInitialSetupDone } = useGame();
  
  if (isGameLoading) {
     return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }
  
  if (!playerProfile) {
    return <IntroScreen />; 
  }

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
                {data.length > 0 ? (
                    data.map((entry) => {
                        const { Icon: LeagueIcon, colorClass: leagueColorClass } = getLeagueIconAndColor(entry.playerLeague);
                        const flagSrc = `https://flags.fmcdn.net/data/flags/w580/${entry.country?.toLowerCase()}.png`;
                        const avatarSrc = entry.avatarUrl || images.generic.default_avatar;
                        const dataAiHint = "commander portrait";

                        return (
                            <TableRow key={entry.playerId} className={entry.playerId === playerProfile.id ? 'bg-primary/10' : ''}>
                            <TableCell className="font-medium text-center text-lg px-2 sm:px-4"> 
                                {entry.rank === 1 && <Trophy className="inline-block h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-1" />}
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
                                         <div className="flex items-center gap-2">
                                            {entry.country && (
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Image src={flagSrc} alt={entry.country} width={16} height={12} className="rounded-sm" data-ai-hint="country flag" />
                                                    <span>{countries.find(c => c.code === entry.country)?.name || entry.country}</span>
                                                </div>
                                            )}
                                            <LastSeen lastSeen={entry.lastSeen} />
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-mono text-primary text-base px-2 sm:px-4">{entry.score.toLocaleString()}</TableCell> 
                            </TableRow>
                        );
                    })
                ) : (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-6 sm:py-8">
                            <p className="font-semibold">No Commanders Ranked Yet</p>
                            <p className="text-sm">Be the first to make your mark on the galaxy!</p>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    );
  };

  return (
    <div className="px-0 sm:px-4 pt-2 sm:pt-4"> 
      <h1 className="text-2xl sm:text-3xl font-headline text-primary mb-4 sm:mb-6 px-2 sm:px-0">Leaderboards</h1> 
      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-1 mb-3 sm:mb-4 md:grid-cols-1 bg-background"> 
          <TabsTrigger value="global" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base">Global Rankings</TabsTrigger> 
        </TabsList>
        <TabsContent value="global">
          {renderLeaderboardTable(initialLeaderboardData, "Global Top Commanders", <Globe className="h-5 w-5 sm:h-6 sm:w-6" />)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaderboardTable;
