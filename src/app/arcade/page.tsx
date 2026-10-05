"use client";

import React from "react";
import Link from "next/link";
import { useGame } from "@/contexts/GameContext";
import PlayerSetup from "@/components/player/PlayerSetup";
import IntroScreen from "@/components/intro/IntroScreen";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Gamepad2, Gem, Play, Ship, Sparkles, Star, Zap } from "lucide-react";

const GEM_TILES = [
  "text-cyan-300", "text-violet-300", "text-amber-300", "text-emerald-300",
  "text-fuchsia-300", "text-cyan-300", "text-amber-300", "text-violet-300",
  "text-emerald-300", "text-fuchsia-300", "text-cyan-300", "text-amber-300",
  "text-violet-300", "text-emerald-300", "text-fuchsia-300", "text-cyan-300",
  "text-amber-300", "text-violet-300", "text-emerald-300", "text-fuchsia-300",
];

const MAZE_DOTS = Array.from({ length: 30 });

export default function ArcadePage() {
  const { isLoading, isInitialSetupDone } = useGame();

  if (isLoading) return <IntroScreen />;
  if (!isInitialSetupDone) return <PlayerSetup />;

  return (
    <section className="relative min-h-full overflow-hidden bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,.12),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(168,85,247,.14),transparent_32%),linear-gradient(180deg,#071022,#030611)] px-3 py-5 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(34,211,238,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <header className="relative mb-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-[.42em] text-cyan-300">ARK Recreation Deck · Simulator Online</p>
        <h1 className="mt-2 flex items-center justify-center text-3xl font-headline text-amber-300 sm:text-4xl">
          <Gamepad2 className="mr-3 h-8 w-8" /> Vanguard Arcade
        </h1>
        <p className="mt-2 text-sm text-slate-300 sm:text-base">Train reflexes, collect rewards and recharge between missions.</p>
      </header>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2">
        <Card className="group overflow-hidden border-cyan-300/35 bg-slate-950/70 text-white shadow-[0_0_35px_rgba(34,211,238,.10)] transition duration-300 hover:-translate-y-1 hover:border-cyan-200/70 hover:shadow-[0_0_45px_rgba(34,211,238,.20)]">
          <CardHeader className="relative z-10 pb-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-200">Match simulator</span>
              <Zap className="h-5 w-5 text-amber-300" />
            </div>
            <CardTitle className="flex items-center text-2xl text-cyan-200"><Gem className="mr-2 h-6 w-6" /> Gemstone Burst</CardTitle>
            <CardDescription className="text-slate-300">Align three Auronite crystals, trigger chain reactions and earn points.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-cyan-300/25 bg-[radial-gradient(circle_at_center,rgba(8,145,178,.18),rgba(2,6,23,.95)_70%)] p-5 shadow-[inset_0_0_35px_rgba(34,211,238,.08)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
              <div className="grid grid-cols-5 gap-3">
                {GEM_TILES.map((color, index) => (
                  <div key={index} className="arcade-gem grid aspect-square place-items-center rounded-xl border border-white/10 bg-white/[.04]" style={{ animationDelay: `${index * 80}ms` }}>
                    <Gem className={`h-7 w-7 ${color} drop-shadow-[0_0_9px_currentColor] sm:h-9 sm:w-9`} />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-cyan-200"><Sparkles className="h-4 w-4" /> Chain reactor charged</div>
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <Link href="/minigame/gemstone-burst">
              <Button className="h-12 w-full bg-gradient-to-r from-cyan-500 to-blue-600 font-black uppercase tracking-[.18em] text-white hover:from-cyan-400 hover:to-blue-500"><Play className="mr-2 h-5 w-5 fill-current" /> Enter Gem Field</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group overflow-hidden border-violet-300/35 bg-slate-950/70 text-white shadow-[0_0_35px_rgba(168,85,247,.10)] transition duration-300 hover:-translate-y-1 hover:border-violet-200/70 hover:shadow-[0_0_45px_rgba(168,85,247,.20)]">
          <CardHeader className="relative z-10 pb-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full border border-violet-300/30 bg-violet-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-200">Navigation trial</span>
              <Bot className="h-5 w-5 text-rose-300" />
            </div>
            <CardTitle className="flex items-center text-2xl text-violet-200"><Ship className="mr-2 h-6 w-6" /> Galactic Labyrinth</CardTitle>
            <CardDescription className="text-slate-300">Pilot through the neon maze, recover star fragments and evade the patrol drone.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-violet-300/25 bg-[#050518] shadow-[inset_0_0_35px_rgba(168,85,247,.12)]">
              <div className="absolute inset-4 rounded-xl opacity-80 [background-image:linear-gradient(90deg,transparent_46%,rgba(139,92,246,.65)_47%,rgba(139,92,246,.65)_53%,transparent_54%),linear-gradient(transparent_46%,rgba(34,211,238,.48)_47%,rgba(34,211,238,.48)_53%,transparent_54%)] [background-size:72px_72px]" />
              <div className="absolute inset-6 grid grid-cols-6 gap-5">
                {MAZE_DOTS.map((_, index) => <span key={index} className="m-auto h-1.5 w-1.5 rounded-full bg-amber-200 shadow-[0_0_8px_rgba(253,230,138,.9)]" />)}
              </div>
              <Star className="arcade-star absolute left-[48%] top-[34%] h-7 w-7 fill-amber-300 text-amber-200 drop-shadow-[0_0_12px_rgba(251,191,36,.95)]" />
              <Ship className="arcade-ship absolute bottom-[18%] left-[12%] h-9 w-9 rotate-90 fill-cyan-400/25 text-cyan-200 drop-shadow-[0_0_12px_rgba(34,211,238,.9)]" />
              <Bot className="arcade-drone absolute right-[13%] top-[18%] h-9 w-9 text-rose-300 drop-shadow-[0_0_12px_rgba(251,113,133,.9)]" />
              <div className="absolute inset-x-0 bottom-3 text-center text-[10px] font-bold uppercase tracking-[.25em] text-violet-200">Drone patrol detected</div>
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <Link href="/minigame/galactic-pacman">
              <Button className="h-12 w-full bg-gradient-to-r from-violet-500 to-fuchsia-600 font-black uppercase tracking-[.18em] text-white hover:from-violet-400 hover:to-fuchsia-500"><Play className="mr-2 h-5 w-5 fill-current" /> Enter Labyrinth</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        .arcade-gem { animation: gemFloat 2.4s ease-in-out infinite; }
        .arcade-ship { animation: shipPatrol 4s ease-in-out infinite; }
        .arcade-drone { animation: dronePatrol 3.2s ease-in-out infinite alternate; }
        .arcade-star { animation: starPulse 1.5s ease-in-out infinite; }
        @keyframes gemFloat { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-5px) scale(1.06); } }
        @keyframes shipPatrol { 0%,100% { transform: translate(0,0) rotate(90deg); } 50% { transform: translate(155px,-70px) rotate(90deg); } }
        @keyframes dronePatrol { from { transform: translateX(0); } to { transform: translateX(-80px); } }
        @keyframes starPulse { 0%,100% { transform: scale(.85); opacity:.65; } 50% { transform: scale(1.2); opacity:1; } }
        @media (max-width: 420px) { @keyframes shipPatrol { 0%,100% { transform: translate(0,0) rotate(90deg); } 50% { transform: translate(105px,-65px) rotate(90deg); } } }
      `}</style>
    </section>
  );
}
