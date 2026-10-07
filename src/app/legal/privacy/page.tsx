"use client";

import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card><CardHeader><CardTitle className="text-xl text-accent">{title}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-6 text-foreground/90 sm:text-base">{children}</CardContent></Card>;
}

export default function PrivacyNoticePage() {
  return <main className="container mx-auto px-3 py-6 sm:px-6">
    <header className="mb-6">
      <h1 className="flex items-center text-3xl font-headline text-primary sm:text-4xl"><LockKeyhole className="mr-3 h-9 w-9" />Privacy Notice</h1>
      <p className="mt-2 text-muted-foreground">How Mission: Vanguard handles information in the current release.</p>
      <p className="mt-1 text-xs text-muted-foreground">Last updated: 7 October 2026</p>
    </header>
    <div className="space-y-5">
      <Section title="1. Who is responsible"><p>Pilukarts Studio is responsible for the project. Privacy questions and requests can be sent to <a className="text-primary hover:underline" href="mailto:pilukartsstudio@gmail.com">pilukartsstudio@gmail.com</a>.</p></Section>
      <Section title="2. Information used by the current Game">
        <ul className="list-disc space-y-1 pl-5"><li>Player name, Commander choice, settings, progress, scores and virtual balances stored in the browser on your device.</li><li>A public wallet address and selected network if you voluntarily connect a wallet.</li><li>Name, email, subject and message when you choose to contact us. The support form opens your own email application and does not silently submit the form to a game database.</li><li>Commander name and order information made available through Ko-fi when you purchase the Founding Commander Pack.</li><li>Basic technical or request information that hosting and platform providers may process to deliver their services.</li></ul>
      </Section>
      <Section title="3. Why information is used"><p>We use information to operate the Game, remember local progress, provide requested support, fulfil supporter rewards, protect the project from abuse and improve reliability. Depending on the context, these purposes rely on performance of a request or purchase, legitimate interests in operating and securing the project, legal obligations, or consent where required.</p></Section>
      <Section title="4. Local storage and cookies"><p>The current Game uses browser local storage for player progress, settings and countdowns. This information normally remains on your device until you clear site data or the Game replaces it. We do not currently use advertising cookies or a game-operated advertising analytics profile.</p></Section>
      <Section title="5. Telegram, Ko-fi, GitHub and wallet providers"><p>When you use the Game through Telegram, support the project through Ko-fi, visit the GitHub-hosted site or connect an external wallet, those services may process information under their own privacy notices. We do not receive your wallet private key or seed phrase, and Ko-fi/payment processors handle payment-card information.</p></Section>
      <Section title="6. Sharing and international processing"><p>We do not sell personal information. Information may be handled by service providers needed for hosting, email, Telegram operation, payments, security or legal compliance. These providers may process data in other countries under their own safeguards and terms.</p></Section>
      <Section title="7. Retention and security"><p>Local progress remains until browser storage is cleared or reset. Support emails and fulfilment records are kept only as long as reasonably needed to answer requests, deliver rewards, maintain necessary records and meet legal obligations. We use reasonable safeguards, but no online service is completely secure.</p></Section>
      <Section title="8. Children"><p>The Game is not intended for children under 13. We do not knowingly request personal information from children under 13. A parent or guardian should contact us if they believe a child has supplied information.</p></Section>
      <Section title="9. Your choices and rights"><p>You can clear local game data through your browser, disconnect a wallet through the wallet provider and contact us to request access, correction or deletion of personal information we hold, subject to applicable law. UK users may also complain to the Information Commissioner’s Office.</p></Section>
      <Section title="10. Changes"><p>We will update this notice when data practices materially change. See also the <Link className="text-primary hover:underline" href="/legal/terms-of-service">Terms of Service</Link> and <Link className="text-primary hover:underline" href="/legal/transparency-statement">Transparency Statement</Link>.</p></Section>
    </div>
  </main>;
}
