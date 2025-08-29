
import type { LucideIcon } from 'lucide-react';

export type LeagueName = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster';

// Battle Pass Types
export type RewardType = 'points' | 'auron' | 'uniform_piece' | 'title';

export interface BattlePassReward {
  type: RewardType;
  amount?: number; // for points and auron
  name?: string; // for uniform_piece and title
  icon: LucideIcon;
}

export interface BattlePassLevel {
  level: number;
  freeReward: BattlePassReward | null;
  premiumReward: BattlePassReward | null;
}

export interface BattlePass {
  seasonId: string;
  premiumCostInAuron: number;
  levels: BattlePassLevel[];
}

export interface CommanderOrder {
    id: string;
    objectiveType: 'points' | 'taps'; // Example objective types
    target: number;
    reward: {
        points?: number;
        auron?: number;
    };
    startTime: number;
    endTime: number;
    progress: number;
    isCompleted: boolean;
}

export interface PlayerProfile {
  id: string;
  name: string;
  commanderSex: 'male' | 'female';
  country: string;
  points: number;
  auron: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  rankTitle: string;
  rankInsignia?: string;
  currentSeasonId: string;
  seasonProgress: { [seasonId: string]: number };
  upgrades: { [upgradeId: string]: number };
  muleDrones: number;
  coreVoiceProtocol: 'male' | 'female' | 'synthetic';
  isWalletConnected: boolean;
  arkHangarFullyUpgraded: boolean;
  lastLoginTimestamp: number | null;
  activeTapBonuses: ActiveTapBonus[];
  totalTapsForUniform: number;
  equippedUniformPieces: string[];
  activeDailyQuests: DailyQuest[];
  lastDailyQuestRefresh: number; // Timestamp of the last daily quest refresh
  referralCode?: string;
  referredByCode?: string; // Stores the code of the player who referred this user

  // Tap Limit System
  currentTaps: number;
  maxTaps: number;
  tapsAvailableAt: number; // Timestamp when taps will be refilled

  // Visual Tier Color
  currentTierColor: string; // Stores HSL string like "210 15% 75%"

  // League System
  league: LeagueName;

  // Battle Pass fields
  battlePassLevel: number;
  battlePassXp: number;
  xpToNextBattlePassLevel: number;
  hasPremiumPass: boolean;
  claimedBattlePassRewards: { [level: number]: ('free' | 'premium')[] };
  
  // Commander Order
  activeCommanderOrder: CommanderOrder | null;
  lastCommanderOrderTimestamp: number;

  // Rewarded Ad
  lastRewardedAdTimestamp: number;
}

export interface Season {
  id: string;
  chapter: number;
  title:string;
  description: string;
  objectiveResourceName: string;
  objectiveResourceIcon?: LucideIcon | string;
  coreBriefingObjective: string;
  unlocksCore: boolean;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  effectDescription: (level: number) => string;
  maxLevel?: number;
  icon?: LucideIcon;
}

export interface ArkUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  visualStage: number;
  isPurchased: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName:string;
  country: string;
  score: number;
  playerLeague: LeagueName; // Added for league display
}

export interface CoreMessage {
  type: 'briefing' | 'progress_update' | 'lore_snippet' | 'advice' | 'system_alert';
  content: string;
  timestamp: number;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  costInAuron: number;
  bonusEffect: {
    durationTaps: number;
    multiplier: number;
  };
  icon?: LucideIcon;
}

export interface ActiveTapBonus {
  id: string; // Unique ID for this active bonus instance
  marketItemId: string; // ID of the MarketplaceItem this bonus came from
  name: string; // Name of the bonus (from MarketplaceItem)
  remainingTaps: number;
  bonusMultiplier: number;
  originalDurationTaps: number; // To display progress like X/Y taps
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderCommanderSex?: 'male' | 'female';
  content: string;
  timestamp: number;
  isPlayer: boolean;
}

// Daily Quests System Types
export type QuestType = 'taps' | 'points_earned' | 'login' | 'spend_auron' | 'purchase_upgrade';

export interface QuestReward {
  points?: number;
  auron?: number;
  // items?: string[]; // For future item rewards
}

export interface DailyQuest {
  id: string; // Unique ID for this instance of the quest (e.g., templateId-timestamp)
  templateId: string; // ID from the DAILY_QUESTS_POOL
  title: string;
  description: string;
  type: QuestType;
  target: number;
  progress: number;
  reward: QuestReward;
  isCompleted: boolean; // Calculated: progress >= target
  isClaimed: boolean;
  icon?: LucideIcon; // From template
}

// This is for the pool of available quests
export interface DailyQuestTemplate {
  templateId: string;
  title: string;
  description: string;
  type: QuestType;
  target: number;
  reward: QuestReward;
  icon?: LucideIcon;
}

// League System
export interface LeagueTier {
    name: LeagueName;
    minPoints: number;
    icon: LucideIcon;
    colorClass: string; // Tailwind color class for the icon/text
}

// Level Map Stages
export interface LevelStage {
    name: string;
    startLevel: number;
    endLevel: number;
    colors: {
        primary: string; // HSL string for the border/text
        fill: string; // HSL string for the hex fill
    };
    backgroundImageUrl: string;
    aiHint: string;
}
