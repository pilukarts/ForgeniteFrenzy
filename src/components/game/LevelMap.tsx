"use client";

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Crown, Lock, Navigation, Sparkles, Star, X } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { LEVEL_STAGES } from '@/lib/gameData';
import { assetPath } from '@/lib/assetPath';
import { cn } from '@/lib/utils';

const MAX_LEVEL = 50_000;
const VISIBLE_LEVELS = 25;
const ARK_IMAGE = assetPath('/images/global/ark-carrier.png');

function stageFor(level: number) {
  return LEVEL_STAGES.find(stage => level >= stage.startLevel && level <= stage.endLevel) || LEVEL_STAGES[LEVEL_STAGES.length - 1];
}

export default function LevelMap() {
  const { playerProfile } = useGame();
  const currentLevel = Math.min(MAX_LEVEL, Math.max(1, playerProfile?.level || 1));
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [windowOffset, setWindowOffset] = useState(0);
  const currentStage = stageFor(currentLevel);

  const levels = useMemo(() => {
    const naturalStart = Math.max(1, currentLevel - 4 + windowOffset);
    const start = Math.min(MAX_LEVEL - VISIBLE_LEVELS + 1, naturalStart);
    return Array.from({ length: VISIBLE_LEVELS }, (_, index) => start + index).filter(level => level <= MAX_LEVEL);
  }, [currentLevel, windowOffset]);

  const moveWindow = (direction: number) => {
    setWindowOffset(previous => {
      const desired = previous + direction * 20;
      const min = 1 - Math.max(1, currentLevel - 4);
      const max = MAX_LEVEL - VISIBLE_LEVELS + 1 - Math.max(1, currentLevel - 4);
      return Math.min(max, Math.max(min, desired));
    });
  };

  return <div className="relative min-h-full overflow-y-auto px-3 pb-28 pt-5 text-white sm:px-6">
    <header className="sticky top-0 z-30 mx-auto mb-7 flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-300/30 bg-slate-950/80 p-4 shadow-[0_0_35px_rgba(34,211,238,.14)] backdrop-blur-xl">
      <div><p className="text-[10px] font-bold uppercase tracking-[.32em] text-cyan-300">Galactic flight path</p><h1 className="text-2xl font-black">Level {currentLevel.toLocaleString()}</h1><p className="text-xs text-slate-300">{currentStage.name} · Destination 50,000</p></div>
      <div className="text-right"><p className="text-[10px] uppercase tracking-widest text-slate-400">Journey complete</p><p className="text-xl font-black text-amber-300">{((currentLevel / MAX_LEVEL) * 100).toFixed(2)}%</p></div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10"><motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-amber-300" initial={{ width: 0 }} animate={{ width: `${Math.max(.25, currentLevel / MAX_LEVEL * 100)}%` }} /></div>
    </header>

    <div className="mx-auto mb-4 flex max-w-3xl justify-between gap-3">
      <button onClick={() => moveWindow(-1)} className="rounded-full border border-cyan-300/35 bg-cyan-950/60 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-100 disabled:opacity-30" disabled={levels[0] === 1}>Previous sector</button>
      <button onClick={() => { setWindowOffset(0); document.getElementById(`level-${currentLevel}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className="flex items-center gap-2 rounded-full border border-amber-300/45 bg-amber-950/55 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-100"><Navigation className="h-4 w-4" /> Locate ARK</button>
      <button onClick={() => moveWindow(1)} className="rounded-full border border-violet-300/35 bg-violet-950/60 px-4 py-2 text-xs font-bold uppercase tracking-wider text-violet-100 disabled:opacity-30" disabled={levels[levels.length - 1] === MAX_LEVEL}>Next sector</button>
    </div>

    <div className="relative mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-950/35 px-5 py-10 backdrop-blur-sm sm:px-12">
      <div className="absolute bottom-12 left-1/2 top-12 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-300/20 via-violet-400/40 to-amber-300/20 shadow-[0_0_18px_rgba(103,232,249,.35)]" />
      <div className="relative space-y-10">
        {levels.map((level, index) => {
          const completed = level < currentLevel;
          const active = level === currentLevel;
          const locked = level > currentLevel;
          const isMilestone = level % 10 === 0 || level === MAX_LEVEL;
          const left = index % 2 === 0;
          const nodeStage = stageFor(level);
          return <div id={`level-${level}`} key={level} className={cn('relative flex min-h-24 items-center', left ? 'justify-start' : 'justify-end')}>
            <div className={cn('absolute top-1/2 h-px w-[calc(50%-2.75rem)]', left ? 'left-[2.75rem]' : 'right-[2.75rem]', completed ? 'bg-cyan-300/65' : active ? 'bg-amber-300/80' : 'bg-white/15')} />
            <motion.button whileHover={!locked ? { scale: 1.05 } : {}} whileTap={!locked ? { scale: .96 } : {}} onClick={() => !locked && setSelectedLevel(level)}
              className={cn('relative z-10 flex h-20 w-[44%] min-w-32 items-center gap-3 rounded-2xl border p-3 text-left backdrop-blur-xl transition', completed && 'border-cyan-300/40 bg-cyan-950/65 shadow-[0_0_20px_rgba(34,211,238,.12)]', active && 'border-amber-200 bg-gradient-to-r from-amber-950/90 via-violet-950/85 to-cyan-950/90 shadow-[0_0_35px_rgba(251,191,36,.28)]', locked && 'cursor-not-allowed border-white/10 bg-slate-950/65 text-slate-500')}
              style={active ? { borderColor: `hsl(${nodeStage.colors.primary})` } : undefined}>
              <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-full border text-sm font-black', completed ? 'border-cyan-200/60 bg-cyan-400/15 text-cyan-100' : active ? 'border-amber-200 bg-amber-300/15 text-amber-100' : 'border-white/15 bg-white/5')}>
                {completed ? <Check className="h-5 w-5" /> : locked ? <Lock className="h-4 w-4" /> : level}
              </span>
              <span className="min-w-0"><span className="block text-[9px] uppercase tracking-[.2em] opacity-70">{isMilestone ? 'Milestone' : active ? 'ARK position' : completed ? 'Complete' : 'Locked'}</span><span className="block truncate font-black">Level {level.toLocaleString()}</span></span>
              {isMilestone && <Crown className="ml-auto h-5 w-5 shrink-0 text-amber-300" />}
            </motion.button>

            {active && <motion.div className="pointer-events-none absolute left-1/2 z-20 h-20 w-36 -translate-x-1/2" initial={{ opacity: 0, y: -35 }} animate={{ opacity: 1, y: [0, -5, 0] }} transition={{ opacity: { duration: .6 }, y: { duration: 2.5, repeat: Infinity } }}>
              <span className="absolute inset-3 rounded-full bg-cyan-300/25 blur-xl" /><Image src={ARK_IMAGE} alt={`ARK landed at level ${level}`} fill unoptimized className="object-contain drop-shadow-[0_0_12px_rgba(103,232,249,.95)]" />
            </motion.div>}
          </div>;
        })}
      </div>
    </div>

    <AnimatePresence>{selectedLevel !== null && <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLevel(null)}><motion.div className="w-full max-w-sm rounded-3xl border border-cyan-300/35 bg-slate-950 p-6 shadow-[0_0_45px_rgba(34,211,238,.2)]" initial={{ scale: .85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .9, opacity: 0 }} onClick={event => event.stopPropagation()}><button className="float-right text-slate-400" onClick={() => setSelectedLevel(null)}><X /></button><Sparkles className="mb-3 h-10 w-10 text-amber-300" /><p className="text-xs uppercase tracking-[.25em] text-cyan-300">{stageFor(selectedLevel).name}</p><h2 className="text-3xl font-black">Level {selectedLevel.toLocaleString()}</h2><p className="mt-3 text-slate-300">{selectedLevel < currentLevel ? 'Route completed. This star coordinate is secured.' : 'The ARK is currently stationed at this coordinate. Complete the mission to fly to the next level.'}</p><div className="mt-5 flex gap-1">{[1,2,3].map(star => <Star key={star} className={cn('h-7 w-7', selectedLevel < currentLevel ? 'fill-amber-300 text-amber-300' : 'text-slate-700')} />)}</div></motion.div></motion.div>}</AnimatePresence>
  </div>;
}
