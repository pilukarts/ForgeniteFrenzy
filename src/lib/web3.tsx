
'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const queryClient = new QueryClient();

// Your project ID from WalletConnect Cloud
const projectId = "c8f0e54cbe5722049d569f104b68e983";

if (!projectId) {
  throw new Error("WalletConnect Project ID is not defined. Please check your .env.local file for NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID");
}

const config = getDefaultConfig({
  appName: 'Alliance Forge: Forgeite Frenzy',
  projectId: projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // Required for Next.js App Router
});

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
