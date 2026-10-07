"use client";

import Link from "next/link";
import { ShieldAlert, WalletCards } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WalletBlockchainStatusPage() {
  return <main className="container mx-auto px-3 py-6 sm:px-6">
    <header className="mb-6">
      <h1 className="flex items-center text-3xl font-headline text-primary sm:text-4xl"><WalletCards className="mr-3 h-9 w-9" />Wallet & Blockchain Status</h1>
      <p className="mt-2 text-muted-foreground">Safety information for experimental wallet features.</p>
      <p className="mt-1 text-xs text-muted-foreground">Last updated: 7 October 2026</p>
    </header>
    <div className="space-y-5">
      <Card className="border-amber-300/35"><CardHeader><CardTitle className="flex items-center text-xl text-amber-300"><ShieldAlert className="mr-2 h-5 w-5" />No active smart contract</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-6 text-foreground/90 sm:text-base"><p>Mission: Vanguard has not deployed an official smart contract, cryptocurrency token or NFT collection. The project does not publish a contract address and does not ask players to send cryptocurrency.</p><p>Any old demonstration address, placeholder explorer link or prototype description must not be treated as a live contract.</p></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-xl text-accent">What wallet connection means</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-6 text-foreground/90 sm:text-base"><p>A wallet connection lets a compatible interface read the public address and network approved by the user. It does not reveal the private key, and it should not require a seed phrase.</p><p>Connecting does not create a payment, grant Vanguard Credits, issue an asset or guarantee future rewards. Review every signature request; do not sign anything you do not understand.</p></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-xl text-accent">Future development process</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-6 text-foreground/90 sm:text-base"><p>If blockchain functionality is considered later, it will first be tested on a test network. Before public release we will publish the selected network, verified contract address, functionality, risks, fees, audit status and updated legal terms.</p><p>No roadmap statement is a promise to launch a token or create financial value.</p></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-xl text-accent">Stay safe</CardTitle></CardHeader><CardContent className="space-y-3 text-sm leading-6 text-foreground/90 sm:text-base"><ul className="list-disc space-y-1 pl-5"><li>Never share your seed phrase or private key.</li><li>Do not send funds to addresses posted by strangers.</li><li>Verify announcements through the official game and Pilukarts Studio contact.</li><li>Report impersonation to pilukartsstudio@gmail.com.</li></ul><p>See our <Link className="text-primary hover:underline" href="/legal/transparency-statement">Transparency Statement</Link>.</p></CardContent></Card>
    </div>
  </main>;
}
