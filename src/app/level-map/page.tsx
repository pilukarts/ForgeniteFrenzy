
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import LevelMap from '@/components/game/LevelMap';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';

const LevelMapPage: React.FC = () => {
    const { isLoading, isInitialSetupDone } = useGame();
    const spaceImageUrl = "https://i.imgur.com/foWm9FG.jpeg";
    const circuitPlatformUrl = "https://i.imgur.com/qD89qQX.jpeg";

    if (isLoading) {
        return <IntroScreen />;
    }

    if (!isInitialSetupDone) {
        return <PlayerSetup />;
    }

  return (
    <AppLayout>
      <div className="h-full w-full flex flex-col relative overflow-hidden">
        {/* Layer 1: Animated Space Background */}
        <div 
            className="absolute inset-0 bg-black bg-cover bg-no-repeat animate-pan-background"
            style={{
                backgroundImage: `url('${spaceImageUrl}')`,
                backgroundPosition: 'center center',
            }}
        />

        {/* Shooting Stars Container */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
        </div>
        
        {/* Layer 2: Circuit Platform with Gradient */}
         <div 
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-contain bg-bottom bg-no-repeat pointer-events-none"
            style={{
                backgroundImage: `url('${circuitPlatformUrl}')`,
                backgroundBlendMode: 'lighten',
                WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 100%)',
                maskImage: 'linear-gradient(to top, black 20%, transparent 100%)',
            }}
        />

        {/* Layer 3: Game Content (z-index will put this on top) */}
        <div className="flex-grow overflow-hidden relative z-10">
            <LevelMap />
        </div>
      </div>
       <style jsx>{`
        @keyframes pan-background {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-pan-background {
            animation: pan-background 90s linear infinite;
        }

        .shooting-star {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 4px;
            height: 4px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 0 0 4px rgba(255,255,255,0.1), 0 0 0 8px rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255,1);
            animation: animate-star 3s linear infinite;
        }
        .shooting-star::before {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 300px;
            height: 1px;
            background: linear-gradient(90deg, #fff, transparent);
        }
        
        .shooting-star:nth-child(1) {
            top: 0;
            right: 0;
            left: initial;
            animation-delay: 0s;
            animation-duration: 5s;
        }
        .shooting-star:nth-child(2) {
            top: 0;
            right: 800px;
            left: initial;
            animation-delay: 1.4s;
            animation-duration: 4s;
        }
        .shooting-star:nth-child(3) {
            top: 80px;
            right: 0;
            left: initial;
            animation-delay: 2.8s;
            animation-duration: 6s;
        }


        @keyframes animate-star {
            0% {
                transform: rotate(315deg) translateX(0);
                opacity: 1;
            }
            70% {
                opacity: 1;
            }
            100% {
                transform: rotate(315deg) translateX(-1000px);
                opacity: 0;
            }
        }
      `}</style>
    </AppLayout>
  );
};

export default LevelMapPage;
