
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SmartContractsPage: React.FC = () => {
  // In a real application, this would be the address of the verified contract on a blockchain explorer.
  const MOCK_CONTRACT_URL = "https://etherscan.io/address/0x0000000000000000000000000000000000000000";

  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-headline text-primary flex items-center">
            <FileText className="mr-3 h-8 w-8 sm:h-10 sm:w-10" />
            Smart Contracts
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Ensuring transparency and ownership through blockchain technology.
          </p>
        </header>

        <ScrollArea className="h-[calc(100vh-var(--app-header-h,60px)-var(--page-header-h,120px)-var(--bottom-nav-h,56px)-var(--page-padding,48px))]">
          <div className="space-y-6 text-sm sm:text-base text-foreground/90">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">What is a Smart Contract?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  A smart contract is a self-executing program with the terms of the agreement between parties directly written into code. The code and the agreements contained therein exist across a decentralized blockchain network. Smart contracts permit trusted transactions and agreements to be carried out among disparate, anonymous parties without the need for a central authority, legal system, or external enforcement mechanism.
                </p>
                <p>
                  In Alliance Forge, we use them to ensure ownership of unique assets, like the <strong>Founder's Ark NFT</strong>, is verifiable, immutable, and truly in the player's hands.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Founder's Ark Contract (AFS-ARK)</CardTitle>
                <CardDescription>
                  This contract governs the minting (creation) and ownership of the Founder's Ark NFTs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Standard:</strong> ERC-721 (Non-Fungible Token Standard)</p>
                <p><strong>Key Functionality:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Secure Minting:</strong> Only players who have fully upgraded their Ark Hangar in-game can mint a Founder's Ark NFT. This action is initiated by the player and verified by the contract.</li>
                    <li><strong>Verifiable Ownership:</strong> Each NFT has a unique owner recorded on the blockchain. You can prove your ownership at any time without relying on our servers.</li>
                    <li><strong>Transferability:</strong> As the owner, you have the freedom to sell, trade, or transfer your Founder's Ark on any compatible NFT marketplace.</li>
                </ul>
              </CardContent>
              <CardFooter>
                 <a href={MOCK_CONTRACT_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Contract on Explorer (Simulated)
                    </Button>
                </a>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Our Philosophy of Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  By publishing our smart contract addresses, we offer full transparency. Anyone can audit the code to verify that the game's rules are fair and are enforced as promised. This is our commitment to building an open and trustworthy gaming ecosystem. For more details, please see our{' '}
                  <Link href="/legal/transparency-statement" className="text-primary hover:underline">
                    Transparency Statement
                  </Link>.
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        <style jsx>{`
          :root {
            --app-header-h: 60px; 
            --page-header-h: 100px;
            --bottom-nav-h: 56px;
            --page-padding: 48px;
          }
           @media (min-width: 640px) { /* sm breakpoint */
            :root {
              --app-header-h: 68px;
              --page-header-h: 110px;
            }
          }
        `}</style>
      </div>
    </AppLayout>
  );
};

export default SmartContractsPage;
