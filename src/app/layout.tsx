
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { GameProvider } from '@/contexts/GameContext';
import AppLayout from '@/components/layout/AppLayout';
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { getDefaultConfig } from '@rainbow-me/rainbowkit/config';


const config = getDefaultConfig({
  appName: 'Alliance Forge',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: 'Alliance Forge: Forgeite Frenzy',
  description: 'Alliance Forge: Forgeite Frenzy - Lead humanity\'s escape from Earth.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#1a202c" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <GameProvider>
                  <AppLayout>
                    {children}
                  </AppLayout>
                <Toaster />
              </GameProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
