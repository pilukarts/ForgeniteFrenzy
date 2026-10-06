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
const ARK_IMAGE = assetPath('/images/global/ark-carrier-complete.png');

function stageFor(level: number) {
  return LEVEL_STAGES.find(stage => level >= stage.startLevel && level <= stage.endLevel) || LEVEL_STAGES[LEVEL_STAGES.length - 1];
}

export default function LevelMap() {
  const { playerProfile } = useGame();
  const currentLevel = Math.min(MAX_LEVEL, Math.max(1, playerProfile?.level || 1));
  const levelProgress = Math.min(1, Math.max(0, (playerProfile?.xp || 0) / Math.max(1, playerProfile?.xpToNextLevel || 1)));
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
      <div><p className="text-[10px] font-bold uppercase tracking-[.32em] text-cyan-300">Galactic flight path</p><h1 className="text-2xl font-black">Level {currentLevel.toLocaleString()}</h1><p className="text-xs text-slate-300">{currentStage.name} · {Math.round(levelProgress * 100)}% to level {(currentLevel + 1).toLocaleString()}</p></div>
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
            <motion.button whileHover={!locked ? { scale: 1.045, y: -3 } : {}} whileTap={!locked ? { scale: .97, y: 2 } : {}} onClick={() => !locked && setSelectedLevel(level)}
              className={cn('group relative z-10 h-24 w-[46%] min-w-36 text-left transition [perspective:700px]', locked && 'cursor-not-allowed text-slate-500')}
              aria-label={`Level ${level.toLocaleString()} · ${active ? 'ARK position' : completed ? 'complete' : 'locked'}`}>
              <span className={cn('absolute inset-x-2 bottom-0 h-[72%] translate-y-2 rounded-[1.2rem] border shadow-[0_16px_24px_rgba(0,0,0,.48)]',
                completed && 'border-cyan-500/35 bg-gradient-to-b from-cyan-800/70 to-slate-950',
                active && 'border-amber-300/60 bg-gradient-to-b from-amber-700/75 via-violet-900/80 to-slate-950 shadow-[0_18px_30px_rgba(251,191,36,.18)]',
                locked && 'border-slate-700/40 bg-gradient-to-b from-slate-700/45 to-slate-950')} />
              <span className={cn('absolute inset-x-0 top-0 h-[82%] overflow-hidden rounded-[1.3rem] border backdrop-blur-xl [transform:rotateX(5deg)] [transform-origin:center_bottom]',
                completed && 'border-cyan-200/50 bg-gradient-to-br from-cyan-700/75 via-cyan-950/90 to-slate-950 shadow-[inset_0_2px_0_rgba(255,255,255,.2),0_0_24px_rgba(34,211,238,.2)]',
                active && 'border-amber-100/90 bg-gradient-to-br from-amber-700/80 via-violet-950/90 to-cyan-950/90 shadow-[inset_0_2px_0_rgba(255,255,255,.28),0_0_38px_rgba(251,191,36,.38)]',
                locked && 'border-white/15 bg-gradient-to-br from-slate-700/55 via-slate-900/90 to-slate-950 shadow-[inset_0_2px_0_rgba(255,255,255,.08)]')}
                style={active ? { borderColor: `hsl(${nodeStage.colors.primary})` } : undefined}>
                <span className={cn('absolute inset-x-3 top-1 h-px rounded-full', completed ? 'bg-cyan-100/70' : active ? 'bg-amber-100/90' : 'bg-white/15')} />
                <span className={cn('absolute -inset-6 rounded-full blur-2xl', completed ? 'bg-cyan-400/10' : active ? 'animate-pulse bg-amber-300/20' : 'bg-transparent')} />
              </span>
              <span className="absolute inset-x-3 bottom-1 z-10 h-1 rounded-full bg-black/60 blur-[2px]" />
              <span className="relative z-20 flex h-[82%] items-center gap-2.5 px-3 sm:gap-3">
                <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 text-sm font-black shadow-[inset_0_-5px_10px_rgba(0,0,0,.38)]',
                  completed ? 'border-cyan-100/70 bg-gradient-to-b from-cyan-300/35 to-cyan-950 text-cyan-50 shadow-[0_0_16px_rgba(34,211,238,.3),inset_0_-5px_10px_rgba(0,0,0,.38)]' :
                  active ? 'border-amber-100 bg-gradient-to-b from-amber-200/40 to-amber-950 text-amber-50 shadow-[0_0_22px_rgba(251,191,36,.5),inset_0_-5px_10px_rgba(0,0,0,.38)]' :
                  'border-white/20 bg-gradient-to-b from-slate-600/35 to-slate-950')}>
                  {completed ? <Check className="h-5 w-5" /> : locked ? <Lock className="h-4 w-4" /> : level}
                </span>
                <span className="min-w-0"><span className="block text-[8px] font-bold uppercase tracking-[.18em] opacity-75 sm:text-[9px]">{isMilestone ? 'Milestone' : active ? 'ARK position' : completed ? 'Complete' : 'Locked'}</span><span className="block truncate text-sm font-black sm:text-base">Level {level.toLocaleString()}</span></span>
                {isMilestone && <Crown className="ml-auto h-5 w-5 shrink-0 text-amber-300 drop-shadow-[0_0_7px_rgba(251,191,36,.7)]" />}
              </span>
            </motion.button>

            {active && <motion.div className="pointer-events-none absolute z-20 h-24 w-40 -translate-x-1/2 -translate-y-1/2" initial={{ opacity: 0 }} animate={{ opacity: 1, left: `${left ? 44 + levelProgress * 12 : 56 - levelProgress * 12}%`, top: `${50 + levelProgress * 140}%` }} transition={{ opacity: { duration: .45 }, left: { duration: .9, ease: 'easeInOut' }, top: { duration: .9, ease: 'easeInOut' } }}>
              <motion.span className="absolute left-1/2 top-[72%] h-5 w-24 -translate-x-1/2 rounded-full border border-cyan-100/70 bg-cyan-300/20 shadow-[0_0_24px_rgba(34,211,238,.9)]" initial={{ scale: .35, opacity: 0 }} animate={{ scale: [0.35, 1.55, 1.8], opacity: [0, .85, 0] }} transition={{ duration: 1.15, delay: 1.05, repeat: Infinity, repeatDelay: 3.4, ease: 'easeOut' }} />
              <motion.span className="absolute left-[31%] top-[57%] h-3 w-10 -translate-y-1/2 rounded-full bg-gradient-to-l from-cyan-100 via-cyan-300/80 to-transparent blur-[2px]" animate={{ scaleX: [0.55, 1.15, .7], opacity: [.45, 1, .55] }} transition={{ duration: .32, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.span className="absolute left-[42%] top-[67%] h-4 w-8 -translate-y-1/2 rotate-12 rounded-full bg-gradient-to-l from-amber-100 via-amber-300/75 to-transparent blur-[2px]" animate={{ scaleX: [.5, 1.05, .65], opacity: [.35, .9, .45] }} transition={{ duration: .4, repeat: Infinity, ease: 'easeInOut' }} />
              <span className="absolute inset-3 rounded-full bg-cyan-300/25 blur-xl" />
              <motion.div className="absolute inset-0" initial={{ y: -26, scale: .92, rotate: -2 }} animate={{ y: [-26, 2, -3, 0], scale: [.92, 1, 1, 1], rotate: [-2, 1, -.5, 0] }} transition={{ duration: 1.55, times: [0, .66, .84, 1], ease: 'easeOut' }}>
                <motion.div className="absolute inset-0" animate={{ y: [0, -2, 0], rotate: [-.35, .35, -.35] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}>
                  <Image src={ARK_IMAGE} alt={`ARK travelling from level ${level} to level ${Math.min(MAX_LEVEL, level + 1)}`} fill unoptimized className="object-contain drop-shadow-[0_0_14px_rgba(103,232,249,.98)]" />
                </motion.div>
              </motion.div>
              <motion.span className="absolute left-1/2 top-[74%] -translate-x-1/2 whitespace-nowrap rounded-full border border-cyan-200/30 bg-slate-950/80 px-2 py-1 text-[7px] font-black uppercase tracking-[.22em] text-cyan-100" initial={{ opacity: 0, y: 4 }} animate={{ opacity: [0, 1, 1, 0], y: [4, 0, 0, -2] }} transition={{ duration: 2.4, times: [0, .3, .78, 1] }}>Landing sequence</motion.span>
            </motion.div>}
          </div>;
        })}
      </div>
    </div>

    <AnimatePresence>{selectedLevel !== null && <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLevel(null)}><motion.div className="w-full max-w-sm rounded-3xl border border-cyan-300/35 bg-slate-950 p-6 shadow-[0_0_45px_rgba(34,211,238,.2)]" initial={{ scale: .85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .9, opacity: 0 }} onClick={event => event.stopPropagation()}><button className="float-right text-slate-400" onClick={() => setSelectedLevel(null)}><X /></button><Sparkles className="mb-3 h-10 w-10 text-amber-300" /><p className="text-xs uppercase tracking-[.25em] text-cyan-300">{stageFor(selectedLevel).name}</p><h2 className="text-3xl font-black">Level {selectedLevel.toLocaleString()}</h2><p className="mt-3 text-slate-300">{selectedLevel < currentLevel ? 'Route completed. This star coordinate is secured.' : 'The ARK is currently stationed at this coordinate. Complete the mission to fly to the next level.'}</p><div className="mt-5 flex gap-1">{[1,2,3].map(star => <Star key={star} className={cn('h-7 w-7', selectedLevel < currentLevel ? 'fill-amber-300 text-amber-300' : 'text-slate-700')} />)}</div></motion.div></motion.div>}</AnimatePresence>
  </div>;
}
