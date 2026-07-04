
"use client";
import React, { ReactNode, useEffect, useState } from 'react';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

interface Web3ProviderProps {
    children: ReactNode;
}

// Configuración de Wagmi optimizada para evitar errores de conexión automática en desarrollo
const config = getDefaultConfig({
    appName: 'Alliance Forge',
    projectId: '2d3c8d3527e02bcb7d17675be8c07e5c',
    chains: [mainnet, polygon, optimism, arbitrum, base], 
    ssr: true, // Habilitar SSR para una hidratación más estable
});

const queryClient = new QueryClient();

const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="bg-black min-h-screen" />;

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider modalSize="compact">
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default Web3Provider;
