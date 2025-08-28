
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Sparkles, Swords, Check, Lock, Gift } from 'lucide-react';
import type { BattlePassReward } from '@/lib/types';


const RewardCard: React.FC<{
  level: number;
  reward: BattlePassReward | null;
  track: 'free' | 'premium';
  isClaimed: boolean;
  isUnlocked: boolean;
  hasPremium: boolean;
  onClaim: () => void;
}> = ({ level, reward, track, isClaimed, isUnlocked, hasPremium, onClaim }) => {
  if (!reward) {
    return <div className="bg-card/30 rounded-lg p-2 min-h-[110px] flex items-center justify-center text-muted-foreground text-xs">Empty Tier</div>;
  }

  const canClaim = isUnlocked && !isClaimed && (track === 'free' || hasPremium);
  const Icon = reward.icon;

  return (
    <Card className={cn(
      "p-3 flex flex-col items-center justify-between text-center h-full",
      track === 'premium' ? "bg-primary/10 border-primary/50" : "bg-card",
      (!isUnlocked || (track === 'premium' && !hasPremium)) && "opacity-60"
    )}>
      <div>
        <Icon className="h-8 w-8 mx-auto text-primary" />
        <p className="font-semibold text-base mt-1">{reward.name || `${reward.amount?.toLocaleString()} ${reward.type}`}</p>
      </div>
      <Button size="sm" className="mt-2 w-full text-sm" onClick={onClaim} disabled={!canClaim}>
        {isClaimed ? <><Check className="mr-1 h-4 w-4"/>Claimed</> : 
         !isUnlocked ? <><Lock className="mr-1 h-4 w-4"/>Lvl {level}</> :
         track === 'premium' && !hasPremium ? <><Lock className="mr-1 h-4 w-4"/>Premium</> :
         "Claim"}
      </Button>
    </Card>
  );
};


const BattlePassPage: React.FC = () => {
  const { playerProfile, isLoading, isInitialSetupDone, battlePassData, purchasePremiumPass, claimBattlePassReward } = useGame();

  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone || !playerProfile) {
    return <PlayerSetup />;
  }
  
  const bpProgress = playerProfile.battlePassXp / playerProfile.xpToNextBattlePassLevel * 100;

  return (
    <AppLayout>
      <div className="h-full flex flex-col p-2 sm:p-4">
        <Card className="mb-4 flex-shrink-0">
          <CardHeader>
            <CardTitle className="flex items-center text-primary font-headline text-2xl sm:text-3xl">
              <Swords className="mr-3 h-7 w-7" />
              Season Battle Pass
            </CardTitle>
            <CardDescription className="text-base">
              Level up by playing the game to unlock exclusive rewards on the free and premium tracks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-1 text-base">
                <span className="font-semibold">Level {playerProfile.battlePassLevel}</span>
                <span className="text-muted-foreground">{playerProfile.battlePassXp.toLocaleString()} / {playerProfile.xpToNextBattlePassLevel.toLocaleString()} XP</span>
            </div>
            <Progress value={bpProgress} />
          </CardContent>
          {!playerProfile.hasPremiumPass && (
            <CardFooter>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={purchasePremiumPass}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Unlock Premium Pass ({battlePassData.premiumCostInAuron} Auron)
                </Button>
            </CardFooter>
          )}
        </Card>

        <ScrollArea className="flex-grow">
          <div className="space-y-4">
            {battlePassData.levels.map(levelData => (
              <div key={levelData.level} className="flex items-center gap-2 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center font-bold text-lg text-primary">
                    {levelData.level}
                </div>
                <div className="flex-grow grid grid-cols-2 gap-2 sm:gap-4">
                    <RewardCard
                        level={levelData.level}
                        reward={levelData.freeReward}
                        track="free"
                        isClaimed={playerProfile.claimedBattlePassRewards[levelData.level]?.includes('free') || false}
                        isUnlocked={playerProfile.battlePassLevel >= levelData.level}
                        hasPremium={playerProfile.hasPremiumPass}
                        onClaim={() => claimBattlePassReward(levelData.level, 'free')}
                    />
                     <RewardCard
                        level={levelData.level}
                        reward={levelData.premiumReward}
                        track="premium"
                        isClaimed={playerProfile.claimedBattlePassRewards[levelData.level]?.includes('premium') || false}
                        isUnlocked={playerProfile.battlePassLevel >= levelData.level}
                        hasPremium={playerProfile.hasPremiumPass}
                        onClaim={() => claimBattlePassReward(levelData.level, 'premium')}
                    />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </AppLayout>
  );
};

export default BattlePassPage;

    