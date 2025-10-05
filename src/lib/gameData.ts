

import type { Season, Upgrade, ArkUpgrade, MarketplaceItem, DailyQuestTemplate, LeagueName, LeagueTier, BattlePass, LevelStage, SelectableAvatar } from './types';
import { Ship, BarChartBig, ShieldAlert, Landmark, Gem, Atom, Sparkles, HelpCircle, Coins, Container, Zap, Package, CircleDollarSign, Target, TrendingUp, LogIn, ShoppingBag, ArrowUpCircle, Shield, ShieldCheck, Award, Star, Crown, LucideIcon, Swords, Shirt, Replace } from 'lucide-react';
import images from './placeholder-images.json';

export const SEASONS_DATA: Season[] = [
  {
    id: 'chapter1',
    chapter: 1,
    title: "The Concord's Shadow",
    description: "Gather 'Ark Construction Materials' to build the massive StarForge Arks on Earth.",
    objectiveResourceName: 'Ark Construction Materials',
    objectiveResourceIcon: Ship,
    coreBriefingObjective: "construct StarForge Arks to escape Earth before the Cyber Concord attacks",
    unlocksCore: true,
  },
  {
    id: 'chapter2',
    chapter: 2,
    title: 'The Quantum Beacon',
    description: "Generate 'Scanner Triangulation Data' to pinpoint the elusive Sanctaris system.",
    objectiveResourceName: 'Scanner Triangulation Data',
    objectiveResourceIcon: BarChartBig,
    coreBriefingObjective: "triangulate the Sanctaris system coordinates using Quantum Scanners",
    unlocksCore: false,
  },
  {
    id: 'chapter3',
    chapter: 3,
    title: 'First Wave',
    description: "Generate 'Planetary Shield Energy' to repel the Cyber Concord's vanguard.",
    objectiveResourceName: 'Planetary Shield Energy',
    objectiveResourceIcon: ShieldAlert,
    coreBriefingObjective: "defend Earth by generating planetary shield energy against the Concord's first wave",
    unlocksCore: false,
  },
  {
    id: 'chapter4',
    chapter: 4,
    title: 'Sanctaris Foundation',
    description: "Gather Forgeite to establish a new home in the Sanctaris system.",
    objectiveResourceName: 'Forgeite',
    objectiveResourceIcon: Landmark,
    coreBriefingObjective: "gather Forgeite to begin building a new home on Sanctaris",
    unlocksCore: false,
  },
];

export const MULE_DRONE_BASE_RATE = 1; // Points per minute

export const UPGRADES_DATA: Upgrade[] = [
  {
    id: 'tapPower',
    name: 'Enhanced Tapping Servos',
    description: 'Increases points generated per tap.',
    baseCost: 10,
    costMultiplier: 1.5,
    effectDescription: (level) => `+${level} Points per tap.`,
    icon: Zap,
  },
  {
    id: 'critChance',
    name: 'Precision Targeting Matrix',
    description: 'Increases the chance of a Critical Tap.',
    baseCost: 50,
    costMultiplier: 2,
    effectDescription: (level) => `+${level * 0.5}% Critical Tap Chance.`,
    icon: Target,
  },
  {
    id: 'critMultiplier',
    name: 'Overcharge Capacitors',
    description: 'Increases the point multiplier for Critical Taps.',
    baseCost: 100,
    costMultiplier: 2.5,
    effectDescription: (level) => `+${level * 10}% Critical Tap Bonus.`,
    icon: TrendingUp,
  },
  {
    id: 'comboBonus',
    name: 'Synergy Uplink',
    description: 'Increases the combo meter bonus.',
    baseCost: 75,
    costMultiplier: 1.8,
    effectDescription: (level) => `+${level * 2}% Combo Multiplier.`,
    icon: ArrowUpCircle,
  },
  {
    id: 'muleDrone',
    name: 'Construct M.U.L.E. Drone',
    description: 'Build a Mobile Utility & Logistics Entity to passively generate points while you are offline.',
    baseCost: 5000,
    costMultiplier: 1.8,
    effectDescription: (level) => `You have ${level} drones, generating ${level * MULE_DRONE_BASE_RATE * 60} points per hour.`,
    icon: Container,
  },
];


export const ARK_UPGRADES_DATA: ArkUpgrade[] = [
  { id: 'hullPlating1', name: 'Basic Hull Plating', description: 'Reinforce the Ark structure.', cost: 1000, visualStage: 1, isPurchased: false },
  { id: 'engineModules1', name: 'Auxiliary Engines', description: 'Install initial engine modules.', cost: 2500, visualStage: 2, isPurchased: false },
  { id: 'cargoBays1', name: 'Expandable Cargo Bays', description: 'Increase resource storage capacity.', cost: 5000, visualStage: 3, isPurchased: false },
];

export const INITIAL_XP_TO_NEXT_LEVEL = 100;
export const XP_LEVEL_MULTIPLIER = 1.5;

export const RANK_TITLES: { [level: number]: string } = {
    1: 'Recruit',
    5: 'Cadet',
    10: 'Officer',
    25: 'Veteran Officer',
    50: 'Commander',
    75: 'Section Commander',
    100: 'Battalion Commander',
    150: 'Fleet Commander',
    200: 'High Commander',
    250: 'Vanguard Commander',
    300: 'Forge Master',
    400: 'Galactic Marshall',
    500: 'Celestial Admiral',
    750: 'Ark Architect',
    1000: 'Starforger',
    1500: 'Void Walker',
    2000: 'Nebula Captain',
    3000: 'Cosmic Sentinel',
    4000: 'Galactic Protector',
    5000: 'Alliance High Guard',
    7500: 'Supreme Commander',
    10000: 'Living Legend',
};


export function getRankTitle(level: number): string {
  let currentRank = 'Recruit';
  for (const rankLevel in RANK_TITLES) {
    if (level >= parseInt(rankLevel)) {
      currentRank = RANK_TITLES[parseInt(rankLevel)];
    } else {
      break;
    }
  }
  return currentRank;
}

export const POINTS_PER_TAP = 1;
export const AF_LOGO_TAP_BONUS_MULTIPLIER = 2.5; // Tapping the logo gives 2.5x points
export const AURON_PER_WALLET_CONNECT = 100;

export const INITIAL_MAX_TAPS = 100;
export const TAP_REGEN_COOLDOWN_MINUTES = 4;
export const TAP_REGEN_COOLDOWN_MILLISECONDS = TAP_REGEN_COOLDOWN_MINUTES * 60 * 1000;
export const AURON_COST_FOR_TAP_REFILL = 50;

// Monetization constants
export const REWARDED_AD_AURON_REWARD = 10;
export const REWARDED_AD_COOLDOWN_MINUTES = 30; // 30 minutes
export const REWARDED_AD_COOLDOWN_MILLISECONDS = REWARDED_AD_COOLDOWN_MINUTES * 60 * 1000;


const TIER_COLORS_HSL = {
  SILVER: '210 15% 75%',
  CYAN: '180 100% 50%',
  GREEN_LIGHT: '120 100% 70%',
  PURPLE: '270 70% 60%',
  CORAL: '16 80% 65%',
  FIERY_RED: '0 100% 50%',
  GOLD: '45 100% 50%',
};

export function getTierColorByLevel(level: number): string {
  if (level < 50) return TIER_COLORS_HSL.SILVER;
  if (level < 100) return TIER_COLORS_HSL.CYAN;
  if (level < 200) return TIER_COLORS_HSL.GREEN_LIGHT;
  if (level < 300) return TIER_COLORS_HSL.PURPLE;
  if (level < 500) return TIER_COLORS_HSL.CORAL;
  if (level < 750) return TIER_COLORS_HSL.FIERY_RED;
  return TIER_COLORS_HSL.GOLD;
}
export const INITIAL_TIER_COLOR = getTierColorByLevel(1);

export const MARKETPLACE_ITEMS_DATA: MarketplaceItem[] = [
  {
    id: 'tap_boost_quick',
    name: 'Quick Boost',
    description: 'Slightly increases tap power for a short time.',
    costInAuron: 25,
    bonusEffect: {
      durationTaps: 20, // Number of taps the boost lasts
      multiplier: 1.10, // 10% increase
    },
    icon: Zap,
  },
  {
    id: 'tap_boost_mini_pack',
    name: 'Mini Energy Pack',
    description: 'A small pack to empower your taps.',
    costInAuron: 50,
    bonusEffect: {
      durationTaps: 30,
      multiplier: 1.15, // 15% increase
    },
    icon: Package,
  },
  {
    id: 'tap_boost_minor',
    name: 'Minor Power Surge',
    description: 'Boosts tap power by 25% for the next 50 taps.',
    costInAuron: 100,
    bonusEffect: {
      durationTaps: 50,
      multiplier: 1.25, // 25% increase
    },
    icon: CircleDollarSign,
  },
  {
    id: 'tap_boost_standard',
    name: 'Standard Power Surge',
    description: 'Boosts tap power by 50% for the next 100 taps.',
    costInAuron: 300,
    bonusEffect: {
      durationTaps: 100,
      multiplier: 1.5, // 50% increase
    },
    icon: Coins,
  },
  {
    id: 'tap_boost_major',
    name: 'Major Power Surge',
    description: 'Doubles tap power for the next 150 taps.',
    costInAuron: 750,
    bonusEffect: {
      durationTaps: 150,
      multiplier: 2.0, // 100% increase (double)
    },
    icon: Container,
  },
];

export const DAILY_QUESTS_POOL: DailyQuestTemplate[] = [
  { templateId: 'dq001', title: 'Tap Enthusiast', description: 'Tap the commander 100 times.', type: 'taps', target: 100, reward: { points: 1000 }, icon: Target },
  { templateId: 'dq002', title: 'Point Collector', description: 'Earn 2,500 points.', type: 'points_earned', target: 2500, reward: { points: 1500, auron: 10 }, icon: TrendingUp },
  { templateId: 'dq003', title: 'Daily Check-in', description: 'Log in to the game today.', type: 'login', target: 1, reward: { auron: 20 }, icon: LogIn },
  { templateId: 'dq004', title: 'Auron Spender', description: 'Spend 50 Auron in the marketplace or for refills.', type: 'spend_auron', target: 50, reward: { points: 5000 }, icon: ShoppingBag },
  { templateId: 'dq005', title: 'Upgrade Initiative', description: 'Purchase any upgrade.', type: 'purchase_upgrade', target: 1, reward: { points: 2000, auron: 5 }, icon: ArrowUpCircle },
  { templateId: 'dq006', title: 'Power Tapper', description: 'Tap the commander 250 times.', type: 'taps', target: 250, reward: { points: 2500, auron: 5 }, icon: Target },
  { templateId: 'dq007', title: 'Resource Hoarder', description: 'Earn 5,000 points.', type: 'points_earned', target: 5000, reward: { points: 3000, auron: 15 }, icon: TrendingUp },
];

// League System Data
export const LEAGUE_TIERS: LeagueTier[] = [
  { name: 'Bronze', minPoints: 0, icon: Shield, colorClass: 'text-yellow-600' },
  { name: 'Silver', minPoints: 50000, icon: ShieldCheck, colorClass: 'text-gray-400' },
  { name: 'Gold', minPoints: 250000, icon: Award, colorClass: 'text-yellow-400' },
  { name: 'Platinum', minPoints: 1000000, icon: Gem, colorClass: 'text-cyan-400' },
  { name: 'Diamond', minPoints: 5000000, icon: Sparkles, colorClass: 'text-blue-300' },
  { name: 'Master', minPoints: 10000000, icon: Star, colorClass: 'text-purple-400' },
  { name: 'Grandmaster', minPoints: 25000000, icon: Crown, colorClass: 'text-red-400' },
];

export const DEFAULT_LEAGUE: LeagueName = 'Bronze';

export function getLeagueByPoints(points: number): LeagueName {
  let currentLeague: LeagueName = DEFAULT_LEAGUE;
  for (let i = LEAGUE_TIERS.length - 1; i >= 0; i--) {
    if (points >= LEAGUE_TIERS[i].minPoints) {
      currentLeague = LEAGUE_TIERS[i].name;
      break;
    }
  }
  return currentLeague;
}

export function getLeagueIconAndColor(leagueName: LeagueName): { Icon: LucideIcon; colorClass: string } {
    const leagueData = LEAGUE_TIERS.find(tier => tier.name === leagueName);
    if (leagueData) {
        return { Icon: leagueData.icon, colorClass: leagueData.colorClass };
    }
    return { Icon: Shield, colorClass: 'text-yellow-600' }; // Default to Bronze
}

// BATTLE PASS
export const BATTLE_PASS_XP_PER_LEVEL = 10000; // 10k points for a level

export const BATTLE_PASS_DATA: BattlePass = {
  seasonId: 'chapter1', // This should be dynamic in a real app
  premiumCostInAuron: 500,
  levels: [
    { level: 1, freeReward: { type: 'points', amount: 500, icon: Coins }, premiumReward: { type: 'auron', amount: 50, icon: Sparkles } },
    { level: 2, freeReward: null, premiumReward: { type: 'points', amount: 2500, icon: Coins } },
    { level: 3, freeReward: { type: 'points', amount: 1000, icon: Coins }, premiumReward: { type: 'points', amount: 5000, icon: Coins } },
    { level: 4, freeReward: null, premiumReward: { type: 'auron', amount: 100, icon: Sparkles } },
    { level: 5, freeReward: { type: 'auron', amount: 25, icon: Sparkles }, premiumReward: { type: 'title', name: 'Seasoned', icon: Crown } },
    { level: 6, freeReward: { type: 'points', amount: 2500, icon: Coins }, premiumReward: { type: 'points', amount: 10000, icon: Coins } },
    { level: 7, freeReward: null, premiumReward: { type: 'points', amount: 15000, icon: Coins } },
    { level: 8, freeReward: { type: 'points', amount: 5000, icon: Coins }, premiumReward: { type: 'auron', amount: 150, icon: Sparkles } },
    { level: 9, freeReward: null, premiumReward: { type: 'points', amount: 20000, icon: Coins } },
    { level: 10, freeReward: { type: 'auron', amount: 50, icon: Sparkles }, premiumReward: { type: 'title', name: 'Vanguard', icon: Swords } },
  ],
};

export const LEVEL_STAGES: LevelStage[] = [
    { name: 'SILVER STAGE', startLevel: 1, endLevel: 49, colors: { primary: TIER_COLORS_HSL.SILVER, fill: '210 25% 15%' }, backgroundImageUrl: images.global.background1, aiHint: 'silver nebula' },
    { name: 'CYAN SECTOR', startLevel: 50, endLevel: 99, colors: { primary: TIER_COLORS_HSL.CYAN, fill: '180 25% 15%' }, backgroundImageUrl: images.global.background6, aiHint: 'cyan nebula' },
    { name: 'JADE NEBULA', startLevel: 100, endLevel: 199, colors: { primary: TIER_COLORS_HSL.GREEN_LIGHT, fill: '120 25% 15%' }, backgroundImageUrl: images.global.background2, aiHint: 'green nebula' },
    { name: 'VIOLET ABYSS', startLevel: 200, endLevel: 299, colors: { primary: TIER_COLORS_HSL.PURPLE, fill: '270 25% 15%' }, backgroundImageUrl: images.global.background4, aiHint: 'purple nebula' },
    { name: 'CORAL EXPANSE', startLevel: 300, endLevel: 499, colors: { primary: TIER_COLORS_HSL.CORAL, fill: '16 25% 15%' }, backgroundImageUrl: images.global.background5, aiHint: 'orange nebula' },
    { name: 'INFERNO REALM', startLevel: 500, endLevel: 749, colors: { primary: TIER_COLORS_HSL.FIERY_RED, fill: '0 25% 15%' }, backgroundImageUrl: images.global.background6, aiHint: 'red nebula' },
    { name: 'AETHERIS CORE', startLevel: 750, endLevel: 999, colors: { primary: TIER_COLORS_HSL.GOLD, fill: '45 25% 15%' }, backgroundImageUrl: images.global.background7, aiHint: 'gold nebula' },
    { name: 'VOID OF STARS', startLevel: 1000, endLevel: 1999, colors: { primary: '240 50% 70%', fill: '240 25% 15%' }, backgroundImageUrl: images.global.background1, aiHint: 'dark space' },
    { name: 'EMERALD CHASM', startLevel: 2000, endLevel: 3999, colors: { primary: '145 70% 50%', fill: '145 25% 15%' }, backgroundImageUrl: images.global.background2, aiHint: 'emerald galaxy' },
    { name: 'RUBY VEIL', startLevel: 4000, endLevel: 6999, colors: { primary: '350 80% 60%', fill: '350 25% 15%' }, backgroundImageUrl: images.global.background3, aiHint: 'ruby galaxy' },
    { name: 'CELESTIAL FORGE', startLevel: 7000, endLevel: 10000, colors: { primary: '0 0% 100%', fill: '0 0% 20%' }, backgroundImageUrl: images.global.background4, aiHint: 'white galaxy' },
    { name: 'OMEGA CLUSTER', startLevel: 10001, endLevel: 15000, colors: { primary: '300 100% 80%', fill: '300 25% 15%' }, backgroundImageUrl: images.global.background5, aiHint: 'pink nebula' },
    { name: 'HYPERION RIFT', startLevel: 15001, endLevel: 25000, colors: { primary: '210 100% 70%', fill: '210 25% 15%' }, backgroundImageUrl: images.global.background6, aiHint: 'light blue space' },
    { name: 'GALACTIC CORE', startLevel: 25001, endLevel: 50000, colors: { primary: '60 100% 50%', fill: '60 25% 15%' }, backgroundImageUrl: images.global.background7, aiHint: 'bright galaxy core' },
];

export const SELECTABLE_AVATARS: SelectableAvatar[] = [
    {
      portraitUrl: images.commanders.male_portrait,
      fullBodyUrl: images.commanders.male_full,
      sex: 'male',
      hint: 'male commander headshot',
    },
    {
      portraitUrl: images.commanders.female_portrait,
      fullBodyUrl: images.commanders.female_full,
      sex: 'female',
      hint: 'female commander headshot',
    },
];

// This list is only kept for backwards compatibility or reference, but is not actively used in the setup logic.
export const ALL_AVATARS: { url: string; sex: 'male' | 'female'; }[] = [
    { url: images.commanders.male_full, sex: 'male' }, // Full Body
    { url: images.commanders.female_full, sex: 'female' }, // Full Body
];






