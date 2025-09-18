"use client";

import React, { ReactNode } from 'react';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider, cookieToInitialState } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import type { headers } from 'next/headers';

const config = getDefaultConfig({
  appName: 'Alliance Forge',
  projectId: '2d3c8d3527e02bcb7d17675be8c07e5c',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, 
});

const queryClient = new QueryClient();

interface Web3ProviderProps {
    children: ReactNode;
    cookie?: string | null;
}

const Web3Provider: React.FC<Web3ProviderProps> = ({ children, cookie }) => {
    
    const initialState = cookieToInitialState(config, cookie);

    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default Web3Provider;
