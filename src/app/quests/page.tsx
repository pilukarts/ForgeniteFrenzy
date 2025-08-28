
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
      {/* AppLayout handles global bottom padding */}
      <div className=""> 
        <div className="flex justify-between items-center px-2 sm:px-4 pt-2 sm:pt-4 mb-3 sm:mb-4"> {/* Adjusted padding and margin */}
            <h1 className="text-2xl sm:text-3xl font-headline text-primary flex items-center"> {/* Adjusted text size */}
                <ListChecks className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" /> {/* Adjusted icon size and margin */}
                Daily Quests
            </h1>
            <Button onClick={refreshDailyQuestsIfNeeded} variant="outline" size="xs"> {/* Changed to size="xs" (custom or adjust if not available, use sm) */}
                <RefreshCw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:h-4" /> Refresh {/* Adjusted icon size and margin */}
            </Button>
        </div>
        <p className="text-muted-foreground px-2 sm:px-4 mb-4 sm:mb-6 text-base"> {/* Adjusted padding, margin, text size */}
            Complete these tasks daily for valuable rewards and advance your standing in the Alliance! New quests are available each day.
        </p>
        
         {/* Adjust height: viewport height - app header - page header (title, desc, button) - bottom nav (implicitly by AppLayout padding) */}
        <ScrollArea className="h-[calc(100vh-var(--app-header-h,60px)-var(--page-header-h,120px)-var(--bottom-nav-h,56px))] px-2 sm:px-4"> {/* Placeholder heights, adjust as needed */}
          {questsAvailable ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"> {/* Adjusted gap */}
              {activeQuests.map(quest => {
                const QuestIcon = quest.icon || Gift;
                const progressPercentage = quest.target > 0 ? (quest.progress / quest.target) * 100 : 0;
                return (
                  <Card key={quest.id} className={cn("bg-card text-card-foreground shadow-lg flex flex-col", quest.isClaimed ? "opacity-60" : "")}>
                    <CardHeader className="p-3 sm:p-4"> {/* Adjusted padding */}
                      <div className="flex items-start gap-2 sm:gap-3"> {/* Adjusted gap */}
                        <QuestIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary mt-0.5 sm:mt-1" /> {/* Adjusted icon size and margin */}
                        <div>
                          <CardTitle className="text-lg sm:text-xl font-headline">{quest.title}</CardTitle> {/* Adjusted text size */}
                          <CardDescription className="text-base text-muted-foreground mt-0.5 sm:mt-1">{quest.description}</CardDescription> {/* Adjusted text size and margin */}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-1.5 sm:space-y-2 p-3 sm:p-4 pt-0"> {/* Adjusted padding and spacing */}
                      <div className="flex justify-between items-center text-base text-muted-foreground mb-1"> {/* Adjusted text size */}
                        <span>Progress:</span>
                        <span>{quest.progress.toLocaleString()} / {quest.target.toLocaleString()}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2 sm:h-3" indicatorClassName={quest.isCompleted ? "bg-green-500" : "bg-primary"} /> {/* Adjusted height */}
                       <p className="text-base text-primary flex items-center mt-2 sm:mt-3"> {/* Adjusted text size and margin */}
                        <Sparkles className="h-3 w-3 sm:h-4 sm:h-4 mr-1 sm:mr-1.5 text-bright-gold" />
                        Reward: {getRewardString(quest)}
                      </p>
                    </CardContent>
                    <CardFooter className="p-3 sm:p-4 pt-0"> {/* Adjusted padding */}
                      <Button 
                        onClick={() => claimQuestReward(quest.id)} 
                        disabled={!quest.isCompleted || quest.isClaimed}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-2" /* Adjusted text size and padding */
                        size="default" /* Or sm for h-9 */
                      >
                        {quest.isClaimed ? (
                            <> <CheckCircle2 className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Claimed </>
                        ) : quest.isCompleted ? (
                            <> <Gift className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Claim Reward </>
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
            <Card className="bg-card text-card-foreground shadow-lg p-4 sm:p-6 text-center"> {/* Adjusted padding */}
                <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" /> {/* Adjusted icon size and margin */}
                <CardTitle className="text-lg sm:text-xl font-headline mb-1 sm:mb-2">No Active Quests</CardTitle> {/* Adjusted text size and margin */}
                <CardDescription className="text-base text-muted-foreground"> {/* Adjusted text size */}
                    Check back later or try refreshing for new daily assignments, Commander.
                </CardDescription>
                 <Button onClick={refreshDailyQuestsIfNeeded} variant="default" className="mt-3 sm:mt-4 text-base" size="sm"> {/* Adjusted margin, text size, button size */}
                    <RefreshCw className="mr-1 sm:mr-2 h-4 w-4" /> Check for New Quests
                </Button>
            </Card>
          )}
        </ScrollArea>
         {/* CSS variables for dynamic height calculation (optional, can be refined) */}
        <style jsx>{`
          :root {
            --app-header-h: 60px; 
            --page-header-h: 120px; /* Approx height of title, desc, refresh button area */
            --bottom-nav-h: 56px;
          }
          @media (min-width: 640px) { /* sm breakpoint */
            :root {
              --app-header-h: 68px;
              --page-header-h: 130px;
            }
          }
        `}</style>
      </div>
    </AppLayout>
  );
};

export default DailyQuestsPage;

    