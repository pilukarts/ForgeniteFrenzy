'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const queryClient = new QueryClient();

// Your project ID from WalletConnect Cloud
const projectId = "c8f0e54cbe5722049d569f104b68e983";

if (!projectId) {
  // This will prevent the app from building if the project ID is missing.
  throw new Error("WalletConnect Project ID is not defined. Please check your environment variables for NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID");
}

const config = getDefaultConfig({
  appName: 'Alliance Forge: Forgeite Frenzy',
  projectId: projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  ssr: true, 
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
