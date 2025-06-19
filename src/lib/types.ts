
import type { LucideIcon } from 'lucide-react';

export type LeagueName = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster';

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
  playerCountry: string;
  score: number;
  playerLeague: LeagueName; // Added for league display
}

export interface CoreMessage {
  type: 'briefing' | 'progress_update' | 'lore_snippet' | 'advice' | 'system_alert';
  content: string;
  timestamp: number;
}

export const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
];

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
  id: string;
  marketItemId: string;
  name: string;
  remainingTaps: number;
  bonusMultiplier: number;
  originalDurationTaps: number;
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

