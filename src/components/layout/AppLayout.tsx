"use client";
import React, { ReactNode, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import BottomNavBar from "@/components/navigation/BottomNavBar";
import ResourceDisplay from "@/components/game/ResourceDisplay";
import { Button } from "@/components/ui/button";
import { useGame } from "@/contexts/GameContext";
import { CreditCard, Zap } from "lucide-react";
import CoreDisplay from "@/components/core/CoreDisplay";
import IntroScreen from "@/components/intro/IntroScreen";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import PlayerSetup from "@/components/player/PlayerSetup";
import SidebarNav from "@/components/navigation/SidebarNav";
import LiveDashboard from "@/components/game/LiveDashboard";
import PlayerProfileHeader from "@/components/player/PlayerProfileHeader";


interface AppLayoutProps {
  children: ReactNode;
}

const formatTimeLeft = (milliseconds: number): string => {
  if (milliseconds <= 0) return "00:00:00";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const TapStatusCard: React.FC = () => {
  const { playerProfile } = useGame();
  const [displayTime, setDisplayTime] = useState("00:00:00");

  useEffect(() => {
    if (!playerProfile || playerProfile.currentTaps >= playerProfile.maxTaps) {
        setDisplayTime("00:00:00");
        return;
    }

    const timer = setInterval(() => {
      const remaining = Math.max(0, (playerProfile.tapsAvailableAt || 0) - Date.now());
      setDisplayTime(formatTimeLeft(remaining));
    }, 1000);

    return () => clearInterval(timer);
  }, [playerProfile?.tapsAvailableAt, playerProfile?.currentTaps, playerProfile?.maxTaps]);

  if (!playerProfile) return null;
  const isOutOfTaps = playerProfile.currentTaps <= 0;

  return (
    <div className="w-full max-w-[150px] sm:max-w-xs">
      <div className="bg-gray-800/50 shadow-sm p-1 rounded-md text-center border border-white/5">
        <p className="text-xs sm:text-sm font-semibold text-yellow-300 flex items-center justify-center gap-1">
          <Zap className="h-3 w-3 sm:h-4 sm:w-4" /> {playerProfile.currentTaps.toLocaleString()} / {playerProfile.maxTaps.toLocaleString()}
        </p>
        {isOutOfTaps && (
          <p className="text-[10px] sm:text-xs text-orange-400 animate-pulse">Regen: {displayTime}</p>
        )}
      </div>
    </div>
  );
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { playerProfile, connectWallet, currentSeason, isLoading, isInitialSetupDone } = useGame();
  
  if (isLoading) return <IntroScreen />;
  if (!isInitialSetupDone) return <PlayerSetup />;
  if (!playerProfile) return <IntroScreen />;

  const seasonProgress = playerProfile?.seasonProgress?.[currentSeason.id] ?? 0;

  return (
    <>
      <div className="flex flex-col min-h-screen bg-black text-white items-center">
        <div className="relative flex w-full h-full max-w-7xl mx-auto bg-gray-950 shadow-2xl overflow-hidden md:h-screen">
          <SidebarNav />

          <div className="flex flex-col flex-grow min-h-screen">
            {/* HEADER */}
            <header className="sticky top-0 z-50 p-2 sm:p-3 bg-background/60 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center">
                        <PlayerProfileHeader profile={playerProfile} compact />
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                        <TapStatusCard />
                    </div>

                    <div className="flex items-center justify-end gap-2 sm:gap-3">
                        <ResourceDisplay seasonResourceAmount={seasonProgress} auronCount={playerProfile.auron ?? 0} />
                         <div className="flex items-center ml-1 pl-2 border-l border-white/10">
                            <ConnectButton.Custom>
                                {({ account, chain, openAccountModal, openConnectModal, mounted, authenticationStatus }) => {
                                const ready = mounted && authenticationStatus !== "loading";
                                const connected = ready && account && chain;
                                
                                return (
                                    <div>
                                    {!connected ? (
                                        <Button onClick={openConnectModal} variant="outline" size="sm" className="h-8 text-xs border-primary/50">
                                        Connect
                                        </Button>
                                    ) : (
                                        <div className="flex gap-2 items-center">
                                            <Button onClick={openAccountModal} variant="outline" size="sm" className="h-8 text-xs">
                                                {account.displayName}
                                            </Button>
                                        </div>
                                    )}
                                    </div>
                                );
                                }}
                            </ConnectButton.Custom>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col relative overflow-hidden">
              {children}
            </main>

            <CoreDisplay />
            <LiveDashboard />
            <BottomNavBar />
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
