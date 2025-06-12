import type { LucideIcon } from 'lucide-react';

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
  rankInsignia?: string; // Could be path to an SVG or a key for a component
  currentSeasonId: string;
  seasonProgress: { [seasonId: string]: number }; // Points accumulated for a specific season objective
  upgrades: { [upgradeId: string]: number }; // Tracks the level of each upgrade
  muleDrones: number; // Number of M.U.L.E. Drones
  coreVoiceProtocol: 'male' | 'female' | 'synthetic';
  isWalletConnected: boolean;
  arkHangarFullyUpgraded: boolean;
  lastLoginTimestamp: number | null;
}

export interface Season {
  id: string;
  chapter: number;
  title: string;
  description: string; // Narrative description
  objectiveResourceName: string; // e.g., "Ark Construction Materials"
  objectiveResourceIcon?: LucideIcon | string; // Lucide icon or path to custom SVG
  coreBriefingObjective: string; // Text for C.O.R.E. AI input
  unlocksCore: boolean; // Does completing this season unlock C.O.R.E.?
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number; // How much cost increases per level
  effectDescription: (level: number) => string; // Describes the effect at current level
  maxLevel?: number;
  icon?: LucideIcon;
}

export interface ArkUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  visualStage: number; // To track visual evolution
  isPurchased: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  playerCountry: string; // Flag or country code
  score: number;
}

export interface CoreMessage {
  type: 'briefing' | 'progress_update' | 'lore_snippet' | 'advice';
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
  // Add more countries as needed
];
