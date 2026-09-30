import { Bot, Gauge, Shield, Sparkles, Sword, Zap } from 'lucide-react';
import type { EquipmentItem } from './types';

export const EQUIPMENT_ITEMS: EquipmentItem[] = [
  { id: 'pulse-cannon', name: 'Pulse Cannon', description: 'A dependable ARK energy weapon.', slot: 'weapon', rarity: 'Common', cost: 1500, currency: 'points', power: 12, perk: '+12 attack power', icon: Zap },
  { id: 'nova-lance', name: 'Nova Lance', description: 'Pierces armored raiders with focused plasma.', slot: 'weapon', rarity: 'Epic', cost: 140, currency: 'auron', power: 38, perk: '+38 attack power', icon: Sword },
  { id: 'ion-veil', name: 'Ion Veil', description: 'A compact shield for dangerous sectors.', slot: 'shield', rarity: 'Rare', cost: 4500, currency: 'points', power: 24, perk: '+24 shield integrity', icon: Shield },
  { id: 'aegis-matrix', name: 'Aegis Matrix', description: 'Alliance-grade regenerative protection.', slot: 'shield', rarity: 'Legendary', cost: 260, currency: 'auron', power: 55, perk: '+55 shield integrity', icon: Sparkles },
  { id: 'comet-drive', name: 'Comet Drive', description: 'Improves ARK acceleration between encounters.', slot: 'engine', rarity: 'Rare', cost: 6000, currency: 'points', power: 28, perk: '+28 flight speed', icon: Gauge },
  { id: 'mule-scout', name: 'M.U.L.E. Scout', description: 'Collects resources while the commander fights.', slot: 'droid', rarity: 'Epic', cost: 175, currency: 'auron', power: 34, perk: '+34 salvage efficiency', icon: Bot },
];

export const EQUIPMENT_SLOTS = ['weapon', 'shield', 'engine', 'droid'] as const;
