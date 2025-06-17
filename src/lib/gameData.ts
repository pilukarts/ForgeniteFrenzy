
import type { Season, Upgrade, ArkUpgrade, MarketplaceItem, DailyQuestTemplate } from './types';
import { Ship, BarChartBig, ShieldAlert, Landmark, Gem, Atom, Sparkles, HelpCircle, Coins, Container, Zap, Package, CircleDollarSign, Target, TrendingUp, LogIn, ShoppingBag, ArrowUpCircle } from 'lucide-react';

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
  {
    id: 'chapter5',
    chapter: 5,
    title: 'Asteroid Belt Expedition',
    description: "Generate 'Ancient Relic Fragments' by exploring a mysterious Asteroid Belt.",
    objectiveResourceName: 'Ancient Relic Fragments',
    objectiveResourceIcon: Gem,
    coreBriefingObjective: "explore the asteroid belt and recover ancient relic fragments",
    unlocksCore: false,
  },
  {
    id: 'chapter6',
    chapter: 6,
    title: 'The Aetheris Rush',
    description: "Gather 'Aetherian Crystals' from the volatile planet Aetheris.",
    objectiveResourceName: 'Aetherian Crystals',
    objectiveResourceIcon: Atom,
    coreBriefingObjective: "brave Aetheris to mine valuable Aetherian Crystals for advanced crafting",
    unlocksCore: false,
  },
  {
    id: 'chapter7',
    chapter: 7,
    title: 'The Plutonium Crisis',
    description: "Gather Plutonium, the rare resource for Legendary and Core units.",
    objectiveResourceName: 'Plutonium',
    objectiveResourceIcon: HelpCircle, 
    coreBriefingObjective: "secure Plutonium, vital for advanced military units",
    unlocksCore: false,
  },
  {
    id: 'finalChapter',
    chapter: 8,
    title: 'Token Unleashed',
    description: "Generate 'Token Fragments' to solidify your Founder's Score for the airdrop.",
    objectiveResourceName: 'Token Fragments',
    objectiveResourceIcon: Sparkles,
    coreBriefingObjective: "collect Token Fragments to forge into Alliance Forge tokens and secure your airdrop",
    unlocksCore: false,
  },
];

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
  15: 'Veteran Officer',
  20: 'Commander',
  25: 'Section Commander',
  30: 'Battalion Commander',
  40: 'Fleet Commander',
  50: 'High Commander',
  60: 'Vanguard Commander',
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
export const AURON_PER_WALLET_CONNECT = 100;
export const MULE_DRONE_BASE_RATE = 1;

export const MARKETPLACE_ITEMS_DATA: MarketplaceItem[] = [
  {
    id: 'tap_boost_quick',
    name: 'Impulso Rápido',
    description: 'Aumenta ligeramente el poder de tus taps por un corto tiempo.',
    costInAuron: 25,
    bonusEffect: {
      durationTaps: 20,
      multiplier: 1.10,
    },
    icon: Zap,
  },
  {
    id: 'tap_boost_mini_pack',
    name: 'Mini Paquete de Energía',
    description: 'Un pequeño paquete para potenciar tus taps.',
    costInAuron: 50,
    bonusEffect: {
      durationTaps: 30,
      multiplier: 1.15,
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
      multiplier: 1.25,
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
      multiplier: 1.5,
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
      multiplier: 2.0,
    },
    icon: Container,
  },
];

export const DAILY_QUESTS_POOL: DailyQuestTemplate[] = [
  { templateId: 'dq001', title: 'Tap Enthusiast', description: 'Tap the commander 100 times.', type: 'taps', target: 100, reward: { points: 1000 }, icon: Target },
  { templateId: 'dq002', title: 'Point Collector', description: 'Earn 2,500 points.', type: 'points_earned', target: 2500, reward: { points: 1500, auron: 10 }, icon: TrendingUp },
  { templateId: 'dq003', title: 'Daily Check-in', description: 'Log in to the game today.', type: 'login', target: 1, reward: { auron: 20 }, icon: LogIn },
  { templateId: 'dq004', title: 'Auron Spender', description: 'Spend 50 Auron in the marketplace.', type: 'spend_auron', target: 50, reward: { points: 5000 }, icon: ShoppingBag },
  { templateId: 'dq005', title: 'Upgrade Initiative', description: 'Purchase any upgrade.', type: 'purchase_upgrade', target: 1, reward: { points: 2000, auron: 5 }, icon: ArrowUpCircle },
  { templateId: 'dq006', title: 'Power Tapper', description: 'Tap the commander 250 times.', type: 'taps', target: 250, reward: { points: 2500, auron: 5 }, icon: Target },
  { templateId: 'dq007', title: 'Resource Hoarder', description: 'Earn 5,000 points.', type: 'points_earned', target: 5000, reward: { points: 3000, auron: 15 }, icon: TrendingUp },
];
