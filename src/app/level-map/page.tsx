
"use client";
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import LevelMap from '@/components/game/LevelMap';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { LEVEL_STAGES } from '@/lib/gameData';
import { cn } from '@/lib/utils';

const LevelMapPage: React.FC = () => {
    const { isLoading, isInitialSetupDone, playerProfile } = useGame();

    if (isLoading) {
        return <IntroScreen />;
    }

    if (!isInitialSetupDone || !playerProfile) {
        return <PlayerSetup />;
    }

    const getStageForLevel = (level: number) => {
        return LEVEL_STAGES.find(stage => level >= stage.startLevel && level <= stage.endLevel) || LEVEL_STAGES[0];
    };
    
    const currentStage = getStageForLevel(playerProfile.level);

  return (
    <AppLayout>
      <div className="h-full w-full flex flex-col relative overflow-hidden">
        {/* Layer 1: Dynamic Backgrounds Container */}
        <div className="absolute inset-0 bg-black z-0">
          {LEVEL_STAGES.map((stage, index) => (
            <div
              key={stage.name}
              className={cn(
                "absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out animate-pan-background",
                currentStage.name === stage.name ? "opacity-100" : "opacity-0"
              )}
              style={{ backgroundImage: `url('${stage.backgroundImageUrl}')`, animationDelay: `${index * 10}s` }}
              data-ai-hint={stage.aiHint}
            />
          ))}
        </div>

        {/* Layer 2: Shooting Stars Container */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
        </div>

        {/* Layer 3: Cockpit Floor & Frame */}
        <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-20" />
        
        {/* Layer 4: Game Content (z-index will put this on top) */}
        <div className="flex-grow overflow-hidden relative z-10">
            <LevelMap />
        </div>
      </div>
       <style jsx>{`
        @keyframes pan-background {
            0% { transform: scale(1.1) translateX(0%) translateY(0%); }
            50% { transform: scale(1.1) translateX(2%) translateY(1%); }
            100% { transform: scale(1.1) translateX(0%) translateY(0%); }
        }
        .animate-pan-background {
            animation: pan-background 120s linear infinite;
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
