
"use client";
import React from 'react';
import type { PlayerProfile } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, UserCircle, ShieldCheck, Award, Gem, Star, Crown, Sparkles, LucideIcon } from 'lucide-react'; 
import { getLeagueIconAndColor, DEFAULT_LEAGUE } from '@/lib/gameData';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useGame } from '@/contexts/GameContext';

interface PlayerProfileHeaderProps {
  profile: PlayerProfile;
}

const PlayerProfileHeader: React.FC<PlayerProfileHeaderProps> = ({ profile }) => {
  const { isInitialSetupDone } = useGame();
  const xpPercentage = profile.xpToNextLevel > 0 ? (profile.xp / profile.xpToNextLevel) * 100 : 0;
  
  // Use the profile's avatar if set, otherwise fallback to the sex-based one
  const avatarSrc = profile.avatarUrl || (profile.commanderSex === 'male' ? "https://i.imgur.com/gB3i4OQ.png" : "https://i.imgur.com/J3tG1e4.png");
  const dataAiHint = "commander portrait";

  const leagueName = profile.league || DEFAULT_LEAGUE;
  const { Icon: LeagueIcon, colorClass: leagueColorClass } = getLeagueIconAndColor(leagueName);

  const ProfileWrapper = ({children}: {children: React.ReactNode}) => {
    if (isInitialSetupDone) {
      return <Link href="/profile" className="flex items-center gap-2 p-1 rounded-lg bg-card/50 shadow-sm min-w-0 hover:bg-card/70 transition-colors">{children}</Link>
    }
    return <div className="flex items-center gap-2 p-1 rounded-lg bg-card/50 shadow-sm min-w-0">{children}</div>
  }

  return (
    <ProfileWrapper>
      <Avatar className="h-8 w-8 border-2 border-primary">
        <AvatarImage src={avatarSrc} alt={profile.name} data-ai-hint={dataAiHint} />
        <AvatarFallback>
          {profile.name ? profile.name.substring(0, 1).toUpperCase() : <UserCircle className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-1.5">
          <Shield className="h-4 w-4 text-bright-gold" />
          <p className="text-sm font-semibold text-foreground truncate" title={profile.name}>
            {profile.name}
          </p>
        </div>
        <p className="text-xs text-primary font-medium truncate" title={`Level ${profile.level} - ${profile.rankTitle}`}>
          Lvl {profile.level} - {profile.rankTitle}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
            <LeagueIcon className={cn("h-3 w-3", leagueColorClass)} />
            <p className={cn("text-xs font-medium", leagueColorClass)}>{leagueName}</p>
        </div>
        <Progress value={xpPercentage} className="h-1 mt-1 bg-muted" indicatorClassName="bg-primary" />
      </div>
    </ProfileWrapper>
  );
};

export default PlayerProfileHeader;
