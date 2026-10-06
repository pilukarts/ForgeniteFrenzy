"use client";

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Clock3, Crown, RadioTower, ShieldCheck, Sparkles, Swords, Trophy, Users } from 'lucide-react';

const LAUNCH_AT = Date.now() + (2 * 24 * 60 * 60 * 1000) + (7 * 60 * 60 * 1000) + (18 * 60 * 1000);

function useLaunchClock() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return Math.max(0, LAUNCH_AT - now);
}

function formatClock(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

const previewRanks = [
  { rank: 1, name: 'Awaiting first commander', score: '—', accent: 'text-amber-300' },
  { rank: 2, name: 'Competitive uplink pending', score: '—', accent: 'text-cyan-300' },
  { rank: 3, name: 'No simulated scores', score: '—', accent: 'text-violet-300' },
];

export default function TournamentsPage() {
  const remaining = useLaunchClock();
  const clock = useMemo(() => formatClock(remaining), [remaining]);

  return (
    <main className="relative min-h-full overflow-y-auto bg-[#040915] px-3 pb-28 pt-5 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-20 top-64 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(34,211,238,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.08)_1px,transparent_1px)] [background-size:42px_42px]" />
      </div>

      <section className="relative mx-auto max-w-5xl">
        <header className="overflow-hidden rounded-[2rem] border border-cyan-200/25 bg-slate-950/75 p-5 shadow-[0_0_45px_rgba(34,211,238,.14)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.34em] text-cyan-300"><RadioTower className="h-4 w-4 animate-pulse" /> Vanguard network · staging</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Tournament Command</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">Enter chat-based operations, climb verified rankings and earn Vanguard Credits when the secure Telegram uplink comes online.</p>
            </div>
            <div className="rounded-2xl border border-amber-200/35 bg-amber-300/10 px-5 py-4 text-center shadow-[inset_0_0_24px_rgba(251,191,36,.08)]">
              <ShieldCheck className="mx-auto h-8 w-8 text-amber-300" />
              <p className="mt-1 text-[9px] font-black uppercase tracking-[.25em] text-amber-100">Verified scoring</p>
              <p className="text-xs text-slate-300">Cloud uplink required</p>
            </div>
          </div>
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
          <motion.article className="relative overflow-hidden rounded-[2rem] border border-violet-300/30 bg-gradient-to-br from-violet-950/85 via-slate-950/95 to-cyan-950/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,.42)] sm:p-7" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <div className="absolute right-[-3rem] top-[-3rem] h-48 w-48 rounded-full border-[22px] border-cyan-300/5" />
            <div className="relative flex items-start justify-between gap-4">
              <div><p className="text-[10px] font-black uppercase tracking-[.3em] text-violet-300">Operation 001</p><h2 className="mt-2 text-2xl font-black">First Contact Sprint</h2><p className="mt-2 text-sm text-slate-300">Weekly individual tournament · highest verified mission score wins.</p></div>
              <Crown className="h-10 w-10 shrink-0 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,.65)]" />
            </div>

            <div className="relative mt-6 grid grid-cols-4 gap-2">
              {Object.entries(clock).map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-black/25 p-3 text-center"><p className="text-xl font-black text-cyan-100 sm:text-2xl">{String(value).padStart(2, '0')}</p><p className="text-[8px] uppercase tracking-[.18em] text-slate-400">{label}</p></div>)}
            </div>

            <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-3"><Users className="h-5 w-5 text-cyan-300" /><p className="mt-2 text-xs font-bold">Open division</p><p className="text-[10px] text-slate-400">All commanders</p></div>
              <div className="rounded-xl border border-violet-300/20 bg-violet-300/5 p-3"><Swords className="h-5 w-5 text-violet-300" /><p className="mt-2 text-xs font-bold">7 day mission</p><p className="text-[10px] text-slate-400">Best score counts</p></div>
              <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-3"><Sparkles className="h-5 w-5 text-amber-300" /><p className="mt-2 text-xs font-bold">Credit rewards</p><p className="text-[10px] text-slate-400">Prize pool pending</p></div>
            </div>

            <button disabled className="relative mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-cyan-200/20 bg-gradient-to-r from-cyan-700/35 to-violet-700/35 text-xs font-black uppercase tracking-[.2em] text-slate-400"><Clock3 className="h-4 w-4" /> Registration opens after secure uplink</button>
          </motion.article>

          <motion.aside className="rounded-[2rem] border border-cyan-300/20 bg-slate-950/80 p-5 shadow-[0_20px_55px_rgba(0,0,0,.38)]" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}>
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.3em] text-cyan-300"><Trophy className="h-4 w-4" /> Live ranking preview</p>
            <div className="mt-5 space-y-3">
              {previewRanks.map(item => <div key={item.rank} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.035] p-3"><span className={`grid h-9 w-9 place-items-center rounded-full border border-current font-black ${item.accent}`}>{item.rank}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{item.name}</p><p className="text-[9px] uppercase tracking-wider text-slate-500">Verified Telegram player</p></div><span className="font-black text-slate-500">{item.score}</span></div>)}
            </div>
            <div className="mt-5 rounded-xl border border-violet-300/20 bg-violet-300/5 p-4">
              <Bot className="h-6 w-6 text-violet-300" />
              <p className="mt-2 text-xs font-black uppercase tracking-wider">Chat challenge protocol</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">Soon, commanders will share a verified challenge directly into Telegram groups and private chats.</p>
            </div>
          </motion.aside>
        </div>
      </section>
    </main>
  );
}
