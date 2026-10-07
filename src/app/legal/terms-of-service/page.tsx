"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const updated = "7 October 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card><CardHeader><CardTitle className="text-xl text-accent">{title}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-6 text-foreground/90 sm:text-base">{children}</CardContent></Card>;
}

export default function TermsOfServicePage() {
  return <main className="container mx-auto px-3 py-6 sm:px-6">
    <header className="mb-6">
      <h1 className="flex items-center text-3xl font-headline text-primary sm:text-4xl"><FileText className="mr-3 h-9 w-9" />Terms of Service</h1>
      <p className="mt-2 text-muted-foreground">Clear rules for Mission: Vanguard players and supporters.</p>
      <p className="mt-1 text-xs text-muted-foreground">Last updated: {updated}</p>
    </header>
    <div className="space-y-5">
      <Section title="1. About these terms">
        <p>These Terms govern access to Mission: Vanguard (the “Game”), operated by Pilukarts Studio (“we”, “us” or “our”). By using the Game, you agree to these Terms and our <Link className="text-primary hover:underline" href="/legal/privacy">Privacy Notice</Link>. If you do not agree, do not use the Game.</p>
        <p>The Game is an evolving independent project. Features may be incomplete, experimental, changed or removed.</p>
      </Section>
      <Section title="2. Eligibility and player responsibility">
        <p>You must be at least 13 to use the Game. If you are under 18, a parent or guardian should approve any purchase or voluntary financial support.</p>
        <p>You are responsible for activity on your device, Telegram account and connected wallet. Do not share passwords, private keys or seed phrases with us or anyone claiming to represent us.</p>
      </Section>
      <Section title="3. Gameplay, progress and virtual items">
        <p>Vanguard Credits, Astralyte, points, energy, levels, upgrades, badges and other virtual items are game features only. They have no cash value, are not investments, cannot be withdrawn and are not transferable unless we expressly introduce a lawful transfer feature later.</p>
        <p>Game progress may currently be stored locally on your device. Clearing browser storage, changing device or technical failure may reset progress. We do not guarantee permanent availability of locally stored progress.</p>
        <p>We may rebalance, correct or remove virtual items and progress where reasonably necessary for testing, fairness, security or continued development.</p>
      </Section>
      <Section title="4. Voluntary support and the Founding Commander Pack">
        <p>Any contribution helps support the continued development of Mission: Vanguard. Support is voluntary and does not purchase equity, ownership, royalties, profit sharing, voting rights, investment returns or control of the project.</p>
        <p>The Founding Commander Pack is a low-cost supporter product sold through Ko-fi. Its stated rewards are cosmetic recognition and a chosen Commander name in the credits, added manually after payment verification. It provides no competitive advantage, cryptocurrency or transferable asset.</p>
        <p>Ko-fi and its payment processors handle payment information under their own terms and privacy notices. Contact us promptly about fulfilment or an incorrect Commander name. Refund and consumer rights required by applicable law are not limited by these Terms.</p>
      </Section>
      <Section title="5. Wallet and blockchain status">
        <p>A wallet connection may be shown as an experimental interface. Connecting a wallet does not create a token, make a payment, grant ownership or guarantee a future blockchain feature.</p>
        <p>Mission: Vanguard currently has no official cryptocurrency, active smart contract or official NFT collection. We will publish a separate notice, verified contract details and updated terms before any real blockchain functionality is offered.</p>
      </Section>
      <Section title="6. Acceptable use">
        <p>Do not cheat, automate gameplay without permission, exploit vulnerabilities, harass others, impersonate Pilukarts Studio, interfere with the service, submit unlawful content or attempt to sell accounts or virtual items for real money.</p>
        <p>Report security issues privately to <a className="text-primary hover:underline" href="mailto:pilukartsstudio@gmail.com">pilukartsstudio@gmail.com</a>.</p>
      </Section>
      <Section title="7. Intellectual property and names submitted">
        <p>The Game and its original code, artwork, writing, characters, interfaces and other content are owned by Pilukarts Studio or used under licence. Open-source and third-party materials remain subject to their respective licences.</p>
        <p>If you submit a Commander name for public credits, you confirm that it is lawful and does not impersonate or infringe another person. You give us permission to display and reasonably format that name in the Game and related project pages. We may reject or remove inappropriate names.</p>
      </Section>
      <Section title="8. Availability and liability">
        <p>The Game is provided on an evolving, as-available basis. We do not promise uninterrupted access or that every experimental feature will reach final release.</p>
        <p>Nothing in these Terms excludes legal rights or liability that cannot lawfully be excluded. Subject to that, we are not responsible for indirect losses, loss of locally stored progress, third-party platform outages or actions you take through external services.</p>
      </Section>
      <Section title="9. Changes and contact">
        <p>We may update these Terms when the Game, law or services change. We will update the date above and provide reasonable notice of material changes where practical.</p>
        <p>Questions: <a className="text-primary hover:underline" href="mailto:pilukartsstudio@gmail.com">pilukartsstudio@gmail.com</a> or our <Link className="text-primary hover:underline" href="/support">support page</Link>.</p>
      </Section>
    </div>
  </main>;
}
