"use client";

import React from 'react';
import { Lock, Package, Sparkles } from 'lucide-react';
import IntroScreen from '@/components/intro/IntroScreen';
import PlayerSetup from '@/components/player/PlayerSetup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useGame } from '@/contexts/GameContext';
import { EQUIPMENT_ITEMS, EQUIPMENT_SLOTS } from '@/lib/equipmentData';
import type { EquipmentItem, EquipmentSlot } from '@/lib/types';
import { cn } from '@/lib/utils';

const rarityStyle = {
  Common: 'border-slate-400/40 text-slate-200',
  Rare: 'border-cyan-400/55 text-cyan-200',
  Epic: 'border-violet-400/60 text-violet-200',
  Legendary: 'border-amber-300/70 text-amber-200 shadow-[0_0_25px_rgba(251,191,36,.14)]',
};

export default function InventoryPage() {
  const { playerProfile, setPlayerProfile, isLoading, isInitialSetupDone } = useGame();
  const { toast } = useToast();

  if (isLoading) return <IntroScreen />;
  if (!isInitialSetupDone || !playerProfile) return <PlayerSetup />;

  const inventory = playerProfile.inventory || [];
  const equipped = playerProfile.equippedItems || {};
  const totalPower = EQUIPMENT_SLOTS.reduce((sum, slot) => {
    const item = EQUIPMENT_ITEMS.find(candidate => candidate.id === equipped[slot]);
    return sum + (item?.power || 0);
  }, 0);

  const buy = (item: EquipmentItem) => {
    if (inventory.includes(item.id)) return;
    const balance = item.currency === 'auron' ? playerProfile.auron : playerProfile.points;
    if (balance < item.cost) {
      toast({ title: 'Insufficient resources', description: `You need ${item.cost.toLocaleString()} ${item.currency === 'auron' ? 'Auron' : 'Ark Materials'}.`, variant: 'destructive' });
      return;
    }
    setPlayerProfile(previous => previous ? {
      ...previous,
      points: item.currency === 'points' ? previous.points - item.cost : previous.points,
      auron: item.currency === 'auron' ? previous.auron - item.cost : previous.auron,
      inventory: [...(previous.inventory || []), item.id],
    } : previous);
    toast({ title: `${item.name} acquired`, description: 'The module is now available in your loadout.' });
  };

  const equip = (item: EquipmentItem) => {
    if (!inventory.includes(item.id)) return;
    setPlayerProfile(previous => previous ? { ...previous, equippedItems: { ...(previous.equippedItems || {}), [item.slot]: item.id } } : previous);
    toast({ title: `${item.name} equipped`, description: item.perk });
  };

  return <main className="min-h-full bg-[radial-gradient(circle_at_top,#132443_0%,#050816_48%,#02030a_100%)] px-3 py-5 text-white sm:px-6">
    <header className="mx-auto mb-6 flex max-w-7xl flex-col justify-between gap-4 rounded-2xl border border-cyan-300/25 bg-slate-950/65 p-5 backdrop-blur-xl sm:flex-row sm:items-center">
      <div><p className="text-xs uppercase tracking-[.32em] text-cyan-300">ARK Quartermaster</p><h1 className="text-3xl font-black">Galactic Shop & Loadout</h1><p className="mt-1 text-sm text-slate-300">Collect permanent modules and prepare your ARK before battle.</p></div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs"><Stat label="Materials" value={playerProfile.points.toLocaleString()} /><Stat label="Auron" value={playerProfile.auron.toLocaleString()} /><Stat label="Power" value={totalPower.toString()} /></div>
    </header>

    <section className="mx-auto mb-8 max-w-7xl"><h2 className="mb-3 text-lg font-bold uppercase tracking-[.2em] text-cyan-200">Active loadout</h2><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {EQUIPMENT_SLOTS.map(slot => { const item = EQUIPMENT_ITEMS.find(candidate => candidate.id === equipped[slot]); const Icon = item?.icon || Package; return <Card key={slot} className="border-cyan-300/25 bg-slate-950/70 text-white"><CardContent className="flex min-h-28 items-center gap-3 p-4"><Icon className="h-8 w-8 text-cyan-300" /><div><p className="text-[10px] uppercase tracking-[.24em] text-slate-400">{slot}</p><p className="font-bold">{item?.name || 'Empty slot'}</p><p className="text-xs text-cyan-200">{item?.perk || 'Equip a module'}</p></div></CardContent></Card>; })}
    </div></section>

    <section className="mx-auto max-w-7xl"><h2 className="mb-3 text-lg font-bold uppercase tracking-[.2em] text-violet-200">Available equipment</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {EQUIPMENT_ITEMS.map(item => { const Icon = item.icon; const owned = inventory.includes(item.id); const isEquipped = equipped[item.slot as EquipmentSlot] === item.id; return <Card key={item.id} className={cn('flex flex-col bg-slate-950/75 text-white backdrop-blur-xl', rarityStyle[item.rarity])}><CardHeader><div className="flex items-start justify-between"><Icon className="h-10 w-10" /><span className="rounded-full border border-current/30 px-2 py-1 text-[10px] font-bold uppercase tracking-wider">{item.rarity}</span></div><CardTitle>{item.name}</CardTitle><CardDescription className="text-slate-300">{item.description}</CardDescription></CardHeader><CardContent className="flex-grow"><p className="font-semibold text-cyan-200">{item.perk}</p><p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{item.slot} module · {item.power} power</p></CardContent><CardFooter><Button className="w-full" variant={owned ? 'outline' : 'default'} disabled={isEquipped} onClick={() => owned ? equip(item) : buy(item)}>{isEquipped ? 'Equipped' : owned ? 'Equip module' : <><Lock className="mr-2 h-4 w-4" />{item.cost.toLocaleString()} {item.currency === 'auron' ? 'Auron' : 'Materials'}</>}</Button></CardFooter></Card>; })}
    </div></section>
  </main>;
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="min-w-20 rounded-xl border border-white/10 bg-white/5 px-3 py-2"><Sparkles className="mx-auto mb-1 h-4 w-4 text-amber-300" /><p className="font-black">{value}</p><p className="text-[9px] uppercase tracking-wider text-slate-400">{label}</p></div>; }
