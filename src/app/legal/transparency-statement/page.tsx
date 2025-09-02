
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShieldQuestion } from 'lucide-react';
import Link from 'next/link';

const TransparencyStatementPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-headline text-primary flex items-center">
            <ShieldQuestion className="mr-3 h-8 w-8 sm:h-10 sm:w-10" />
            Transparency Statement
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Our commitment to clarity regarding digital assets and game economies.
          </p>
        </header>

        <ScrollArea className="h-[calc(100vh-var(--app-header-h,60px)-var(--page-header-h,120px)-var(--bottom-nav-h,56px)-var(--page-padding,48px))]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Introduction</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                <p>
                  Welcome to Alliance Forge. This statement outlines key information about how
                  digital assets, including Non-Fungible Tokens (NFTs), cryptocurrencies,
                  and virtual goods, function within our game. Our goal is to provide a
                  clear understanding of these elements to ensure a transparent and fair gameplay experience.
                </p>
                <p>
                  Please read this statement carefully. By participating in Alliance Forge and interacting
                  with its digital assets, you acknowledge and agree to the terms outlined herein and our{' '}
                  <Link href="/legal/terms-of-service" className="text-primary hover:underline">
                    Terms of Service
                  </Link>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Non-Fungible Tokens (NFTs)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                <p>
                  <strong>Definition:</strong> NFTs are unique digital identifiers recorded on a blockchain,
                  used to certify ownership of a specific digital asset. In Alliance Forge,
                  NFTs may represent items such as the "Founder's Ark" or other unique collectibles.
                </p>
                <p>
                  <strong>Acquisition:</strong> NFTs within Alliance Forge are earned through significant
                  in-game achievements, participation in special events, or specific purchases
                  where explicitly stated.
                </p>
                <p>
                  <strong>Ownership & Blockchain:</strong> When you acquire an Alliance Forge NFT,
                  it is associated with your connected cryptocurrency wallet address on the [Specify Blockchain, e.g., Polygon, Ethereum] blockchain.
                  You have control over this NFT in your wallet, subject to the rules of the blockchain network.
                </p>
                <p>
                  <strong>Utility:</strong> The utility of NFTs within Alliance Forge will be described
                  at the point of acquisition or in official game documentation. Utility may include
                  in-game benefits, cosmetic enhancements, or access to exclusive content.
                </p>
                <p>
                  <strong>Trading & Value:</strong> You are free to trade, sell, or transfer your NFTs on third-party marketplaces
                  that support the relevant blockchain and NFT standard. Alliance Forge does not operate these marketplaces
                  and is not responsible for transactions conducted on them. The value of NFTs is determined by the market and community.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Cryptocurrency & In-Game Currency</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                 <p>
                  <strong>Auron (Premium In-Game Currency):</strong> Auron is an in-game virtual currency
                  used to purchase premium items, boosts, or cosmetic content in Alliance Forge.
                  Auron is primarily acquired by connecting a crypto wallet or through direct purchases.
                  Auron is an internal virtual currency and is NOT a cryptocurrency. It exists only within the game's ecosystem.
                </p>
                <p>
                  <strong>Points (Standard In-Game Currency):</strong> Points are the primary currency earned
                  through gameplay (e.g., tapping, completing quests). They are used for standard upgrades and progression.
                  Points are a virtual good with utility only inside the game.
                </p>
                <p>
                  <strong>Future Cryptocurrency Token:</strong> Alliance Forge plans to introduce its own cryptocurrency token in the future.
                  Details about such a token, including its utility, economics (tokenomics), and distribution (e.g., airdrop mechanics based on "Founder's Score"),
                  will be provided in a separate whitepaper or official announcement. Treat any claims of an existing Alliance Forge token outside of official announcements with extreme caution.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Virtual Goods</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                <p>
                  <strong>Nature:</strong> Virtual goods in Alliance Forge include all in-game items,
                  currencies (Points, Auron), characters, upgrades, and other digital content that can be
                  acquired or used within the game.
                </p>
                <p>
                  <strong>License:</strong> When you acquire virtual goods, you are granted a limited, non-transferable,
                  revocable license to use these goods within the game, according to our{' '}
                   <Link href="/legal/terms-of-service" className="text-primary hover:underline">
                    Terms of Service
                  </Link>.
                  You do not own the underlying intellectual property of these virtual goods.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Ownership & Licensing</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                <p>
                  <strong>Game and IP:</strong> Alliance Forge and all its associated content,
                  including software, graphics, characters, and storylines, are owned by [Your Company/Studio]
                  or its licensors and are protected by copyright and other intellectual property laws.
                </p>
                <p>
                  <strong>NFT Ownership:</strong> For NFTs minted by Alliance Forge, ownership of the
                  specific token on the blockchain is transferred to you upon acquisition. However, the underlying
                  intellectual property (e.g., the art or character design associated with the NFT) remains with [Your Company/Studio]
                  or its licensors. Your ownership of the NFT grants you certain rights to use and display the associated art,
                  typically for personal, non-commercial purposes, as detailed in our{' '}
                  <Link href="/legal/terms-of-service" className="text-primary hover:underline">
                    Terms of Service
                  </Link>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Risks & Disclosures</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                <p>
                  <strong>Market Volatility (NFTs & Crypto):</strong> The value of NFTs and cryptocurrencies
                  can be extremely volatile. There is no guarantee of value or liquidity for any digital asset.
                </p>
                <p>
                  <strong>Regulatory Uncertainty:</strong> The regulatory landscape for digital assets
                  is evolving. Changes in regulation could impact the use, transfer, or value
                  of these assets.
                </p>
                <p>
                  <strong>Security:</strong> You are responsible for the security of your cryptocurrency wallet
                  and any digital assets stored within it.
                </p>
                <p>
                  <strong>Not Investment Advice:</strong> Information provided by Alliance Forge
                  should not be construed as financial or investment advice.
                </p>
                 <p>
                  <strong>Game Development:</strong> Alliance Forge is an evolving game. Features,
                  items, and economic balancing may change. We reserve the right to modify
                  or discontinue aspects of the game.
                </p>
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Contact</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                <p>
                  If you have any questions, please contact us via the{' '}
                  <Link href="/support" className="text-primary hover:underline">
                    support page
                  </Link>.
                </p>
                <p>
                  Last Updated: [Current Date]
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
        {/* CSS variables for dynamic height calculation */}
        <style jsx>{`
          :root {
            --app-header-h: 60px; 
            --page-header-h: 100px; /* Approx height of page title + desc */
            --bottom-nav-h: 56px;
            --page-padding: 48px; /* Sum of py-4/py-6 top and bottom padding for the page container */
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

export default TransparencyStatementPage;
