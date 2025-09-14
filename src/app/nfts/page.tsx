
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GalleryHorizontal, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { placeholderNfts } from '@/lib/nfts';
import Image from 'next/image';

const NftsPage: React.FC = () => {
  const { isLoading, isInitialSetupDone } = useGame();

  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col p-2 sm:p-4">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-headline text-primary flex items-center">
            <GalleryHorizontal className="mr-3 h-7 w-7" />
            Founder's Ark NFTs
          </h1>
          <p className="text-base text-muted-foreground mt-1">
            Own a piece of the Alliance. These exclusive, limited-edition ship blueprints offer unique in-game perks and true digital ownership.
          </p>
        </header>

        <ScrollArea className="flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {placeholderNfts.map((nft) => (
              <Card key={nft.id} className="bg-card text-card-foreground shadow-lg flex flex-col">
                <CardHeader>
                  <div className="aspect-video relative w-full rounded-t-lg overflow-hidden border-b border-primary/20">
                    {/* Image removed as requested */}
                  </div>
                  <CardTitle className="pt-4 text-xl font-headline text-accent">{nft.name}</CardTitle>
                  <CardDescription className="text-sm">{nft.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p><strong>Collection:</strong> {nft.collection}</p>
                    <p><strong>Rarity:</strong> {nft.rarity}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <a href={nft.purchaseUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Crypto.com
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </AppLayout>
  );
};

export default NftsPage;
