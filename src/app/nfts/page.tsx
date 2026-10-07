"use client";

import React from "react";
import { GalleryHorizontal, Rocket, Shield, Sparkles } from "lucide-react";
import IntroScreen from "@/components/intro/IntroScreen";
import PlayerSetup from "@/components/player/PlayerSetup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/contexts/GameContext";

const futureCollections = [
  {
    title: "Founding Crew",
    description: "Original commanders, cadets and insignias from the first Mission: Vanguard expedition.",
    icon: Shield,
  },
  {
    title: "The Ark",
    description: "Concept art, ship sections and mission records from humanity's Vanguard flagship.",
    icon: Rocket,
  },
  {
    title: "Astralyte Artifacts",
    description: "Cosmetic relics and discoveries gathered across future sectors of the Vanguard Universe.",
    icon: Sparkles,
  },
];

export default function VanguardCollectiblesPage() {
  const { isLoading, isInitialSetupDone } = useGame();

  if (isLoading) return <IntroScreen />;
  if (!isInitialSetupDone) return <PlayerSetup />;

  return (
    <section className="min-h-full bg-[radial-gradient(circle_at_top,rgba(34,211,238,.13),transparent_36%),linear-gradient(180deg,#020617,#080b1d)] p-4 text-white sm:p-7">
      <header className="mx-auto max-w-5xl text-center">
        <GalleryHorizontal className="mx-auto h-10 w-10 text-cyan-300" />
        <p className="mt-3 text-xs font-bold uppercase tracking-[.35em] text-cyan-300">Vanguard Archive</p>
        <h1 className="mt-2 text-3xl font-black sm:text-5xl">Mission: Vanguard Collectibles</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          A future gallery for original Mission: Vanguard artwork, characters, ships and story artifacts.
          The collection is currently in development and nothing on this page is for sale.
        </p>
      </header>

      <div className="mx-auto mt-9 grid max-w-5xl gap-4 md:grid-cols-3">
        {futureCollections.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="border-cyan-300/25 bg-slate-950/70 text-white shadow-[0_0_28px_rgba(34,211,238,.08)]">
            <CardHeader>
              <Icon className="h-9 w-9 text-amber-300" />
              <CardTitle className="pt-3">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-slate-300">{description}</CardContent>
          </Card>
        ))}
      </div>

      <div className="mx-auto mt-7 max-w-3xl rounded-2xl border border-amber-300/25 bg-amber-300/5 p-4 text-center text-sm text-slate-300">
        <strong className="text-amber-200">Coming later:</strong> no official NFT, token or blockchain collection has been launched.
        Any future release will be announced with separate terms and clear ownership information.
      </div>
    </section>
  );
}
