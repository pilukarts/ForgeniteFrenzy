
"use client";

import React, { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Suggested',
      wallets: [
        injectedWallet,
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: 'Alliance Forge',
    projectId: '2d3c8d3527e02bcb7d17675be8c07e5c',
  }
);


const config = getDefaultConfig({
  appName: 'Alliance Forge',
  projectId: '2d3c8d3527e02bcb7d17675be8c07e5c',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  connectors,
  ssr: false, 
});

const queryClient = new QueryClient();

interface Web3ProviderProps {
    children: ReactNode;
}

const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

// Dynamically import the provider to avoid SSR issues
const Web3ProviderWrapper = dynamic(() => Promise.resolve(Web3Provider), {
  ssr: false,
});

export default Web3ProviderWrapper;
