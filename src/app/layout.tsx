
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { GameProvider } from '@/contexts/GameContext';
import AppLayout from '@/components/layout/AppLayout';
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import Web3Provider from '@/contexts/Web3Provider';


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
        <Web3Provider>
          <GameProvider>
              <AppLayout>
                {children}
              </AppLayout>
            <Toaster />
          </GameProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
