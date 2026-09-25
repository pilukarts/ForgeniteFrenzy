"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Gamepad2, Map, Music, Music2, Radio, Share2, Shield, Sparkles, Trophy, Zap } from "lucide-react";
import IntroScreen from "@/components/intro/IntroScreen";
import PlayerSetup from "@/components/player/PlayerSetup";
import { useGame } from "@/contexts/GameContext";
import { useToast } from "@/hooks/use-toast";
import images from "@/lib/images";
import { cn } from "@/lib/utils";
import { POINTS_PER_TAP } from "@/lib/gameData";

const STARS = [
  [7, 12, 2, .2], [13, 66, 1, 1.7], [19, 30, 2, 2.6], [25, 82, 1, .8],
  [31, 17, 1, 3.1], [38, 54, 2, 1.1], [44, 8, 1, 2.2], [51, 73, 2, .4],
  [57, 26, 1, 3.5], [63, 91, 1, 1.5], [69, 45, 2, 2.9], [75, 14, 1, .7],
  [81, 63, 2, 2], [87, 34, 1, 3.8], [92, 79, 2, 1.3], [96, 20, 1, 2.4],
] as const;

type ActionProps = {
  href?: string;
  label: string;
  icon: React.ElementType;
  tone?: "cyan" | "gold" | "violet";
  onClick?: () => void;
};

function HoloAction({ href, label, icon: Icon, tone = "cyan", onClick }: ActionProps) {
  const className = cn(
    "group relative flex min-h-12 items-center gap-3 overflow-hidden rounded-xl border px-4 py-3",
    "bg-slate-950/65 text-left font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-xl",
    "transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2",
    tone === "cyan" && "border-cyan-300/40 hover:border-cyan-200 hover:shadow-[0_0_30px_rgba(34,211,238,.32)]",
    tone === "gold" && "border-amber-300/45 hover:border-amber-200 hover:shadow-[0_0_30px_rgba(251,191,36,.32)]",
    tone === "violet" && "border-violet-300/40 hover:border-violet-200 hover:shadow-[0_0_30px_rgba(167,139,250,.32)]",
  );
  const content = <>
    <span className="absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/10 transition-all duration-700 group-hover:left-[120%]" />
    <Icon className={cn("h-5 w-5", tone === "gold" ? "text-amber-300" : tone === "violet" ? "text-violet-300" : "text-cyan-300")} />
    <span className="text-xs sm:text-sm">{label}</span>
  </>;
  return href ? <Link href={href} className={className}>{content}</Link> : <button type="button" onClick={onClick} className={className}>{content}</button>;
}

export default function HomePage() {
  const { playerProfile, isLoading, isInitialSetupDone, handleTap, getUpgradeLevel, toggleCommander, toggleMusic, isMusicPlaying } = useGame();
  const { toast } = useToast();
  const [tapBurst, setTapBurst] = useState(0);
  const commanderImage = useMemo(() => {
    if (!playerProfile) return images.commanders.female_full;
    return playerProfile.commanderSex === "male" ? images.commanders.male_full : images.commanders.female_full;
  }, [playerProfile]);

  if (isLoading) return <IntroScreen />;
  if (!isInitialSetupDone || !playerProfile) return <PlayerSetup />;

  const tapCommander = () => {
    handleTap(false);
    setTapBurst(value => value + 1);
    window.setTimeout(() => setTapBurst(0), 900);
  };
  const shareAlliance = async () => {
    try {
      if (navigator.share) await navigator.share({ title: "Forgeite Frenzy", text: "Join my Alliance Forge crew!", url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Alliance link copied", description: "Ready to send to your crew." });
      }
    } catch {
      toast({ title: "Share cancelled", description: "No changes were made." });
    }
  };

  return <section className="forge-scene relative isolate min-h-[calc(100vh-120px)] w-full overflow-hidden bg-[#02030b] text-white">
    <div className="forge-galaxy absolute inset-0 scale-[1.04] bg-cover bg-center" style={{ backgroundImage: `url('${images.global.main_scene}')` }} />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,rgba(2,3,11,.18)_45%,rgba(2,3,11,.9)_100%)]" />
    <div className="forge-nebula absolute -left-[20%] top-[5%] h-[70%] w-[70%] rounded-full bg-cyan-500/10 blur-[100px]" />
    <div className="forge-nebula forge-nebula-delay absolute -right-[25%] top-[10%] h-[75%] w-[75%] rounded-full bg-violet-500/10 blur-[110px]" />
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {STARS.map(([left, top, size, delay], index) => <span key={index} className="forge-star absolute rounded-full bg-white" style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s` }} />)}
    </div>

    <header className="relative z-30 flex items-center justify-between gap-3 px-4 py-4 sm:px-7">
      <div className="rounded-xl border border-cyan-300/25 bg-slate-950/55 px-4 py-2 backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300">Command deck</p>
        <p className="font-bold tracking-wide">ARK // FORGEITE FRENZY</p>
      </div>
      <div className="hidden items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-950/35 px-3 py-2 text-xs text-emerald-200 sm:flex"><Radio className="h-4 w-4 animate-pulse" /> SYSTEMS ONLINE</div>
    </header>

    <div className="relative z-20 grid min-h-[620px] grid-cols-1 items-center gap-5 px-4 pb-36 pt-2 lg:grid-cols-[minmax(190px,1fr)_minmax(320px,1.5fr)_minmax(190px,1fr)] lg:px-8 lg:pb-32">
      <nav className="order-2 grid grid-cols-2 gap-3 lg:order-1 lg:grid-cols-1">
        <HoloAction href="/quests" label="Missions" icon={Shield} />
        <HoloAction href="/level-map" label="Star Map" icon={Map} />
        <HoloAction href="/arcade" label="Arcade" icon={Gamepad2} tone="violet" />
        <HoloAction href="/battle-pass" label="Rewards" icon={Trophy} tone="gold" />
      </nav>

      <div className="order-1 flex min-h-[420px] items-end justify-center lg:order-2 lg:min-h-[580px]">
        <motion.button type="button" aria-label="Tap commander for energy" onClick={tapCommander}
          className="forge-commander group relative h-[410px] w-[270px] outline-none sm:h-[500px] sm:w-[330px] lg:h-[570px] lg:w-[380px]"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} whileTap={{ scale: .97 }}>
          <span className="forge-commander-aura absolute inset-x-[15%] bottom-[8%] top-[15%] rounded-[45%] bg-cyan-300/15 blur-3xl" />
          <span className="absolute bottom-[2%] left-1/2 h-[8%] w-[68%] -translate-x-1/2 rounded-[50%] bg-black/80 blur-md" />
          <span className="absolute bottom-[3%] left-1/2 h-[3%] w-[48%] -translate-x-1/2 rounded-[50%] bg-cyan-300/25 blur-md" />
          <Image src={commanderImage} alt={`${playerProfile.name}, Alliance Forge commander`} fill priority unoptimized
            className="object-contain object-bottom [filter:drop-shadow(0_0_10px_rgba(103,232,249,.35))_drop-shadow(0_20px_16px_rgba(0,0,0,.8))] transition duration-500 group-hover:[filter:drop-shadow(0_0_18px_rgba(103,232,249,.65))_drop-shadow(0_24px_18px_rgba(0,0,0,.9))]" />
          <span className="absolute bottom-7 left-1/2 -translate-x-1/2 rounded-full border border-cyan-200/40 bg-slate-950/75 px-5 py-2 text-xs font-black uppercase tracking-[.22em] text-cyan-100 backdrop-blur-md sm:bottom-10">Tap for energy</span>
          <AnimatePresence>{tapBurst > 0 && <motion.span key={tapBurst} initial={{ opacity: 1, y: 0, scale: .7 }} animate={{ opacity: 0, y: -130, scale: 1.25 }} exit={{ opacity: 0 }}
            className="absolute left-1/2 top-1/3 flex -translate-x-1/2 items-center gap-1 text-2xl font-black text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,.9)]"><Zap className="fill-current" /> +{POINTS_PER_TAP + getUpgradeLevel("tapPower")}</motion.span>}</AnimatePresence>
        </motion.button>
      </div>

      <aside className="order-3 space-y-3">
        <motion.div className="forge-ark relative mx-auto aspect-square w-40 cursor-pointer sm:w-48 lg:w-full lg:max-w-[230px]" animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }} transition={{ duration: 5, repeat: Infinity }} onClick={() => handleTap(true)}>
          <span className="forge-ark-ring absolute inset-[8%] rounded-full border border-cyan-300/50" />
          <span className="absolute inset-[18%] rounded-full bg-cyan-400/20 blur-2xl" />
          <Image src={images.ark.ark} alt="ARK starship" fill unoptimized className="object-contain drop-shadow-[0_0_22px_rgba(34,211,238,.75)]" />
          <span className="forge-engine absolute bottom-[18%] left-1/2 h-[20%] w-[16%] -translate-x-1/2 rounded-full bg-cyan-200/60 blur-md" />
        </motion.div>
        <div className="rounded-xl border border-cyan-300/30 bg-slate-950/65 p-4 text-center backdrop-blur-xl">
          <div className="mb-1 flex items-center justify-center gap-2 text-cyan-200"><Sparkles className="h-4 w-4" /> ARK CORE</div><p className="text-2xl font-black">100%</p><p className="text-[10px] uppercase tracking-[.28em] text-cyan-300/75">Flight ready</p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <HoloAction label={isMusicPlaying ? "Sound on" : "Sound off"} icon={isMusicPlaying ? Music : Music2} tone="violet" onClick={toggleMusic} />
          <HoloAction label="Invite" icon={Share2} tone="gold" onClick={shareAlliance} />
        </div>
      </aside>
    </div>

    <div className="forge-deck pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 border-t border-cyan-300/30 bg-[linear-gradient(180deg,rgba(5,10,24,.25),rgba(2,4,12,.98))] shadow-[0_-24px_70px_rgba(0,0,0,.75)]">
      <div className="absolute inset-x-[8%] top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
      <div className="absolute bottom-5 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[50%] border border-cyan-300/15 bg-cyan-400/5 [transform:translateX(-50%)_perspective(280px)_rotateX(65deg)]" />
    </div>
    <button type="button" onClick={toggleCommander} className="absolute bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-amber-300/50 bg-slate-950/85 px-6 py-3 text-xs font-black uppercase tracking-[.2em] text-amber-200 shadow-[0_0_30px_rgba(251,191,36,.2)] backdrop-blur-xl transition hover:-translate-y-1"><Bot className="h-4 w-4" /> Change commander</button>
  </section>;
}
