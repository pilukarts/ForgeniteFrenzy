
"use client";
import React, { ReactNode, useEffect, useState } from 'react';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {
  metaMaskWallet,
  walletConnectWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';

interface Web3ProviderProps {
    children: ReactNode;
}

const config = getDefaultConfig({
    appName: 'Auron Vanguard',
    projectId: '2d3c8d3527e02bcb7d17675be8c07e5c',
    chains: [mainnet, polygon, optimism, arbitrum, base], 
    wallets: [
        {
            groupName: 'Recommended',
            wallets: [
                metaMaskWallet,
                rainbowWallet,
                walletConnectWallet,
            ]
        }
    ],
    ssr: false, 
});

const queryClient = new QueryClient();

const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }
    
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default Web3Provider;
