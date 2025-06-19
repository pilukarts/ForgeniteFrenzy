
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShieldQuestion } from 'lucide-react';

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
            Our commitment to clarity regarding digital assets and in-game economies.
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
                  Welcome to Alliance Forge. This statement outlines key information about
                  how digital assets, including Non-Fungible Tokens (NFTs), cryptocurrencies (if applicable),
                  and virtual goods, function within our game. Our goal is to provide a clear
                  understanding of these elements to ensure a transparent and fair gaming experience.
                </p>
                <p>
                  Please read this statement carefully. By participating in Alliance Forge and interacting
                  with its digital assets, you acknowledge and agree to the terms described herein.
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
                  used to represent ownership of a specific digital or physical item. In Alliance Forge,
                  NFTs may represent items like the "Founder's Ark" or other unique collectibles.
                </p>
                <p>
                  <strong>Acquisition:</strong> NFTs within Alliance Forge are typically earned through
                  significant in-game achievements, participation in special events, or specific purchases
                  where explicitly stated.
                </p>
                <p>
                  <strong>Ownership & Blockchain:</strong> When you acquire an NFT from Alliance Forge,
                  it will be associated with your connected cryptocurrency wallet address on the [Specify Blockchain, e.g., Polygon, Ethereum] blockchain.
                  You have control over this NFT in your wallet, subject to the blockchain's network rules.
                </p>
                <p>
                  <strong>Utility:</strong> The utility of NFTs within Alliance Forge will be described
                  at the point of acquisition or in official game documentation. Utility may include
                  in-game benefits, cosmetic enhancements, access to exclusive content, or other features.
                </p>
                <p>
                  <strong>Trading:</strong> You may be able to trade Alliance Forge NFTs on third-party marketplaces
                  that support the [Specify Blockchain] blockchain and the relevant NFT standard (e.g., ERC-721, ERC-1155).
                  Alliance Forge does not operate these marketplaces and is not responsible for transactions
                  conducted on them. Applicable marketplace fees and potential royalties to the creators may apply.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Cryptocurrencies & In-Game Currency</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                <p>
                  <strong>Auron (In-Game Premium Currency):</strong> Auron is a virtual in-game currency
                  used to purchase premium items, boosts, or cosmetic enhancements within Alliance Forge.
                  Auron is primarily acquired through connecting a cryptocurrency wallet (initial bonus) or potentially
                  through direct purchase (if this feature is implemented) using real-world currency or specific cryptocurrencies.
                  Auron itself is NOT a cryptocurrency and exists only within the game's ecosystem. It does not have direct real-world monetary value outside the game and cannot be traded on external exchanges as a cryptocurrency.
                </p>
                <p>
                  <strong>Points (In-Game Standard Currency):</strong> Points are the primary standard currency earned
                  through gameplay (e.g., tapping, completing quests). Points are used for standard upgrades and progression
                  within Alliance Forge. Points are virtual items and have no value outside of the game.
                </p>
                <p>
                  <strong>Wallet Connection:</strong> Connecting a cryptocurrency wallet is required to receive
                  certain rewards like the Founder's Ark NFT and may be required for future features involving
                  blockchain interaction. We do not store your private keys.
                </p>
                <p>
                  <strong>[Future Token - Placeholder]:</strong> Alliance Forge may introduce its own cryptocurrency token in the future.
                  Details regarding any such token, including its utility, distribution (e.g., airdrop mechanics based on "Founder's Score"),
                  and relationship with in-game assets like Auron, will be provided in a separate, comprehensive whitepaper or announcement.
                  Any claims of an existing Alliance Forge token outside of official announcements should be treated with extreme caution.
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
                  revocable license to use these goods within the game, in accordance with our Terms of Service.
                  You do not own the underlying intellectual property of these virtual goods.
                </p>
                <p>
                  <strong>No Real-World Value:</strong> Unless explicitly stated (e.g., for certain NFTs that can be traded on external marketplaces),
                  virtual goods have no monetary value outside of Alliance Forge and cannot be exchanged for real money or other items of monetary value from us.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Ownership & Licensing</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                <p>
                  <strong>Game & Intellectual Property:</strong> Alliance Forge and all its associated content,
                  including software, graphics, characters, and storylines, are the property of [Your Company/Studio Name]
                  or its licensors and are protected by copyright and other intellectual property laws.
                </p>
                <p>
                  <strong>NFT Ownership:</strong> For NFTs minted by Alliance Forge, ownership of the specific token
                  on the blockchain is transferred to you upon acquisition. However, the underlying intellectual
                  property (e.g., the artwork or character design associated with the NFT) remains with [Your Company/Studio Name]
                  or its licensors, unless explicitly stated otherwise in the NFT's metadata or accompanying terms.
                  Your ownership of the NFT grants you certain rights to use and display the associated artwork,
                  typically for personal, non-commercial purposes.
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
                  can be extremely volatile and subject to market fluctuations. There is no guarantee of value
                  or liquidity for any NFT or cryptocurrency.
                </p>
                <p>
                  <strong>Regulatory Uncertainty:</strong> The regulatory landscape for NFTs, cryptocurrencies,
                  and virtual goods is evolving. Changes in regulations could impact the use, transfer, or value
                  of these assets.
                </p>
                <p>
                  <strong>Security:</strong> You are responsible for the security of your cryptocurrency wallet
                  and any digital assets stored within it. Alliance Forge is not responsible for losses due to
                  compromised wallets or user error.
                </p>
                <p>
                  <strong>No Investment Advice:</strong> Information provided by Alliance Forge regarding NFTs,
                  cryptocurrencies, or virtual goods is for informational purposes only and should not be
                  construed as financial or investment advice.
                </p>
                <p>
                  <strong>Game Development & Changes:</strong> Alliance Forge is an evolving game. Features,
                  in-game items, and economic balancing may change over time. We reserve the right to modify
                  or discontinue aspects of the game, including the utility or availability of certain virtual goods or NFTs.
                </p>
              </CardContent>
            </Card>

             <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-headline text-accent">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-foreground/90 space-y-2">
                <p>
                  If you have any questions regarding this Transparency Statement or our practices related to
                  digital assets, please contact us at [Your Support Email Address or Link to Support Page].
                </p>
                <p>
                  Last Updated: [Current Date, e.g., October 26, 2023]
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
    