import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { GameProvider } from '@/contexts/GameContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alliance Forge: Forgeite Frenzy',
  description: 'Alliance Forge: Operation Exodus - Lead humanity\'s escape from Earth.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <GameProvider>
          {children}
          <Toaster />
        </GameProvider>
      </body>
    </html>
  );
}
