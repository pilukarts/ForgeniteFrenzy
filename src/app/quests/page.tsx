
"use client";
import React, { useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import type { DailyQuest } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { AlertCircle, CheckCircle2, Gift, ListChecks, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const DailyQuestsPage: React.FC = () => {
  const { playerProfile, isLoading, isInitialSetupDone, claimQuestReward, refreshDailyQuestsIfNeeded } = useGame();

  useEffect(() => {
    if (playerProfile && isInitialSetupDone) {
        refreshDailyQuestsIfNeeded();
    }
  }, [playerProfile, isInitialSetupDone, refreshDailyQuestsIfNeeded]);


  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  if (!playerProfile) return null;

  const activeQuests = playerProfile.activeDailyQuests || [];
  const questsAvailable = activeQuests.length > 0;

  const getRewardString = (quest: DailyQuest): string => {
    const rewards = [];
    if (quest.reward.points) rewards.push(`${quest.reward.points.toLocaleString()} Points`);
    if (quest.reward.auron) rewards.push(`${quest.reward.auron} Auron`);
    return rewards.join(', ') || 'No reward';
  };

  return (
    <AppLayout>
      <div className="pb-16"> {/* Padding for bottom nav */}
        <div className="flex justify-between items-center px-4 pt-4 mb-4">
            <h1 className="text-3xl font-headline text-primary flex items-center">
                <ListChecks className="mr-3 h-8 w-8" />
                Daily Quests
            </h1>
            <Button onClick={refreshDailyQuestsIfNeeded} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
        </div>
        <p className="text-muted-foreground px-4 mb-6 text-sm">
            Complete these tasks daily for valuable rewards and advance your standing in the Alliance! New quests are available each day.
        </p>
        
        <ScrollArea className="h-[calc(100vh-300px)] px-4"> {/* Adjust height as needed */}
          {questsAvailable ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeQuests.map(quest => {
                const QuestIcon = quest.icon || Gift;
                const progressPercentage = quest.target > 0 ? (quest.progress / quest.target) * 100 : 0;
                return (
                  <Card key={quest.id} className={cn("bg-card text-card-foreground shadow-lg flex flex-col", quest.isClaimed ? "opacity-60" : "")}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <QuestIcon className="h-8 w-8 text-primary mt-1" />
                        <div>
                          <CardTitle className="text-xl font-headline">{quest.title}</CardTitle>
                          <CardDescription className="text-muted-foreground mt-1">{quest.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2">
                      <div className="flex justify-between items-center text-sm text-muted-foreground mb-1">
                        <span>Progress:</span>
                        <span>{quest.progress.toLocaleString()} / {quest.target.toLocaleString()}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-3" indicatorClassName={quest.isCompleted ? "bg-green-500" : "bg-primary"} />
                       <p className="text-sm text-primary flex items-center mt-3">
                        <Sparkles className="h-4 w-4 mr-1.5 text-bright-gold" />
                        Reward: {getRewardString(quest)}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => claimQuestReward(quest.id)} 
                        disabled={!quest.isCompleted || quest.isClaimed}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {quest.isClaimed ? (
                            <> <CheckCircle2 className="mr-2 h-5 w-5" /> Claimed </>
                        ) : quest.isCompleted ? (
                            <> <Gift className="mr-2 h-5 w-5" /> Claim Reward </>
                        ) : (
                            'In Progress'
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-card text-card-foreground shadow-lg p-6 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-xl font-headline mb-2">No Active Quests</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Check back later or try refreshing for new daily assignments, Commander.
                </CardDescription>
                 <Button onClick={refreshDailyQuestsIfNeeded} variant="default" className="mt-4">
                    <RefreshCw className="mr-2 h-4 w-4" /> Check for New Quests
                </Button>
            </Card>
          )}
        </ScrollArea>
      </div>
    </AppLayout>
  );
};

export default DailyQuestsPage;
