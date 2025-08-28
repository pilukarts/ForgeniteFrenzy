
"use client";
import React from 'react';
import type { PlayerProfile } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, UserCircle, ShieldCheck, Award, Gem, Star, Crown, Sparkles, LucideIcon } from 'lucide-react'; 
import { getLeagueIconAndColor } from '@/lib/gameData';
import { cn } from '@/lib/utils';

interface PlayerProfileHeaderProps {
  profile: PlayerProfile;
}

const PlayerProfileHeader: React.FC<PlayerProfileHeaderProps> = ({ profile }) => {
  const xpPercentage = profile.xpToNextLevel > 0 ? (profile.xp / profile.xpToNextLevel) * 100 : 0;
  const avatarSrc = profile.commanderSex === 'male' ? "https://i.imgur.com/gB3i4OQ.png" : "https://i.imgur.com/J3tG1e4.png";
  const dataAiHint = profile.commanderSex === 'male' ? "male commander" : "female commander";

  const { Icon: LeagueIcon, colorClass: leagueColorClass } = getLeagueIconAndColor(profile.league);

  return (
    <div className="flex items-center gap-2 p-1 rounded-lg bg-card/50 shadow-sm min-w-0">
      <Avatar className="h-8 w-8 border-2 border-primary">
        <AvatarImage src={avatarSrc} alt={profile.name} data-ai-hint={dataAiHint} />
        <AvatarFallback>
          {profile.name ? profile.name.substring(0, 1).toUpperCase() : <UserCircle className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-1.5">
          <Shield className="h-4 w-4 text-bright-gold" /> {/* Rank Insignia */}
          <p className="text-sm font-semibold text-foreground truncate" title={profile.name}>
            {profile.name}
          </p>
        </div>
        <p className="text-xs text-primary font-medium truncate" title={`Level ${profile.level} - ${profile.rankTitle}`}>
          Lvl {profile.level} - {profile.rankTitle}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
            <LeagueIcon className={cn("h-3 w-3", leagueColorClass)} />
            <p className={cn("text-xs font-medium", leagueColorClass)}>{profile.league}</p>
        </div>
        <Progress value={xpPercentage} className="h-1 mt-1 bg-muted" indicatorClassName="bg-primary" />
      </div>
    </div>
  );
};

export default PlayerProfileHeader;
