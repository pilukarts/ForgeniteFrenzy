"use client";

import Link from "next/link";
import { Crown, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";

const KOFI_PRODUCT_URL = "https://ko-fi.com/s/06de4cd2a1";

export default function FoundingCommandersPage() {
  return (
    <main className="relative min-h-[calc(100vh-120px)] overflow-hidden bg-[#02030b] px-4 py-10 text-white sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(34,211,238,.18),transparent_32%),radial-gradient(circle_at_50%_58%,rgba(251,191,36,.12),transparent_38%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(34,211,238,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.08)_1px,transparent_1px)] [background-size:32px_32px]" />

      <section className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[.35em] text-cyan-300">Mission support programme</p>
          <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-6xl">Founding Commanders</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Help Mission: Vanguard continue its journey and become part of its first credited crew.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-xl flex-col items-center rounded-[2rem] border border-amber-300/45 bg-slate-950/75 p-6 text-center shadow-[0_0_70px_rgba(251,191,36,.16)] backdrop-blur-xl sm:p-10">
          <div className="relative grid h-56 w-56 place-items-center">
            <div className="absolute inset-2 rounded-full border border-cyan-300/40 shadow-[0_0_45px_rgba(34,211,238,.3),inset_0_0_35px_rgba(34,211,238,.16)]" />
            <div className="absolute inset-7 rotate-45 rounded-3xl border-2 border-amber-300/70 bg-gradient-to-br from-amber-300/25 via-slate-900 to-cyan-400/20 shadow-[0_0_34px_rgba(251,191,36,.28)]" />
            <ShieldCheck className="relative h-28 w-28 text-amber-300 drop-shadow-[0_0_18px_rgba(251,191,36,.7)]" strokeWidth={1.4} />
            <Sparkles className="absolute right-6 top-7 h-7 w-7 text-cyan-200" />
          </div>

          <div className="-mt-2 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-950/45 px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-amber-200">
            <Crown className="h-4 w-4" /> Founding Commander
          </div>
          <h2 className="mt-5 text-2xl font-black">Founding Commander Pack</h2>
          <p className="mt-2 text-3xl font-black text-amber-300">£3+</p>

          <ul className="mt-6 w-full space-y-3 text-left text-sm text-slate-200">
            <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Permanent cosmetic Founding Commander badge</li>
            <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Your chosen Commander name in the game credits</li>
            <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Recognition as an early Mission: Vanguard supporter</li>
          </ul>

          <a href={KOFI_PRODUCT_URL} target="_blank" rel="noopener noreferrer" className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-500 to-yellow-300 px-5 py-3 text-sm font-black uppercase tracking-[.16em] text-slate-950 shadow-[0_0_28px_rgba(251,191,36,.3)] transition hover:-translate-y-1 hover:shadow-[0_0_42px_rgba(251,191,36,.5)]">
            Get the pack on Ko-fi <ExternalLink className="h-4 w-4" />
          </a>
          <p className="mt-4 text-xs leading-5 text-slate-400">
            Cosmetic supporter reward only. No competitive advantage, cryptocurrency, financial value or transferable asset. Rewards are added manually after purchase verification.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-cyan-300/20 bg-slate-950/60 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-black text-cyan-100">Founders Credits</h2>
          <p className="mt-2 text-sm text-slate-400">The first verified Commander names will appear here. Please include the exact name you want displayed in your Ko-fi order message.</p>
          <div className="mt-5 rounded-xl border border-dashed border-cyan-300/25 px-4 py-8 text-center text-sm uppercase tracking-[.2em] text-cyan-300/65">Awaiting the first Founding Commander</div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm font-bold text-cyan-300 transition hover:text-cyan-100">Return to Command Deck</Link>
        </div>
      </section>
    </main>
  );
}
