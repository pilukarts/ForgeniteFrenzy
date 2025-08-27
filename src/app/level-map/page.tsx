
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
            className="absolute inset-0 bg-black bg-cover bg-center animate-pan-background"
            style={{ backgroundImage: `url('${spaceImageUrl}')` }}
        />

        {/* Shooting Stars Container */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
        </div>
        
        {/* Layer 2: Game Content (z-index will put this on top) */}
        <div className="flex-grow overflow-hidden relative z-10">
            <LevelMap />
        </div>
      </div>
       <style jsx>{`
        @keyframes pan-background {
            0% { transform: scale(1.1) translateX(0%); }
            50% { transform: scale(1.1) translateX(5%); }
            100% { transform: scale(1.1) translateX(0%); }
        }
        .animate-pan-background {
            animation: pan-background 90s linear infinite;
        }

        .shooting-star {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 3px;
            height: 3px;
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
            top: 10%;
            right: 400px;
            left: initial;
            animation-delay: 1.4s;
            animation-duration: 4.5s;
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
                transform: rotate(315deg) translateX(-1500px);
                opacity: 0;
            }
        }
      `}</style>
    </AppLayout>
  );
};

export default LevelMapPage;
