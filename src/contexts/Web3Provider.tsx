
"use client";
import React, { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';
// Import RainbowKit CSS
import '@rainbow-me/rainbowkit/styles.css';
interface Web3ProviderProps {
    children: ReactNode;
}
// Create the provider component
const Web3ProviderInner: React.FC<Web3ProviderProps> = ({ children }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    // Don't render anything until mounted (client-side)
    if (!mounted) {
        return null;
    }
    const config = getDefaultConfig({
        appName: 'Alliance Forge',
        projectId: '2d3c8d3527e02bcb7d17675be8c07e5c',
        chains: [mainnet, polygon, optimism, arbitrum, base], 
        ssr: false, 
    });
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: false,
            },
        },
    });
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider 
                    modalSize="compact"
                    initialChain={mainnet}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};
// Error boundary component
class Web3ErrorBoundary extends React.Component<
    { children: ReactNode },
    { hasError: boolean; error?: string }
> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error: Error) {
        return { 
            hasError: true, 
            error: error.message 
        };
    }
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Web3 Provider Error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ 
                    padding: '20px', 
                    border: '1px solid #red', 
                    borderRadius: '8px',
                    background: '#fff5f5',
                    color: '#d32f2f'
                }}>
                    <h3>Web3 Connection Error</h3>
                    <p>Failed to initialize Web3 provider: {this.state.error}</p>
                    <button 
                        onClick={() => this.setState({ hasError: false })}
                        style={{ 
                            padding: '8px 16px', 
                            background: '#d32f2f', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Retry
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
// Dynamically import with better loading states
const Web3Provider = dynamic(
    () => Promise.resolve(({ children }: Web3ProviderProps) => (
        <Web3ErrorBoundary>
            <Web3ProviderInner>{children}</Web3ProviderInner>
        </Web3ErrorBoundary>
    )),
    {
        ssr: false,
        loading: () => (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: '40px',
                color: '#666'
            }}>
                <div>
                    <div>🔄 Initializing Web3...</div>
                    <div style={{ fontSize: '12px', marginTop: '8px' }}>
                    </div>
                </div>
            </div>
        )
    }
);
export default Web3Provider;
