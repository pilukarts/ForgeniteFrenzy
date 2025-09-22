
"use client";
import React from 'react';
import LevelMap from '@/components/game/LevelMap';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { LEVEL_STAGES } from '@/lib/gameData';
import { cn } from '@/lib/utils';
import { Buffer } from 'buffer';

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

    // Function to generate the dynamic SVG hexagon pattern
    const generateHexagonPattern = (primaryColor: string, fillColor: string) => {
      const svg = `
        <svg xmlns='http://www.w3.org/2000/svg' width='60' height='69.28'>
          <defs>
            <pattern id='hex' patternUnits='userSpaceOnUse' width='60' height='69.28' viewBox='0 -11.54 60 69.28'>
              <g id='hexagon'>
                <path 
                  stroke='hsl(${primaryColor})' 
                  stroke-width='1.5' 
                  fill='hsl(${fillColor})' 
                  d='M30 0 l30 17.32 v34.64 l-30 17.32 l-30 -17.32 v-34.64 Z' />
              </g>
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#hex)'/>
        </svg>
      `;
      // Use Buffer to handle Base64 encoding in all environments
      return `url('data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}')`;
    };

    const hexPatternUrl = generateHexagonPattern(currentStage.colors.primary, currentStage.colors.fill);

    const dynamicBackgroundStyle = {
      backgroundImage: hexPatternUrl,
      backgroundSize: 'auto', // Let the pattern repeat at its natural size
      opacity: 0.2, // Make it a subtle background
    };

  return (
    <>
      <div className="h-full w-full flex flex-col relative overflow-hidden">
        {/* Layer 1: Dynamic Hexagon Background */}
        <div 
          className="absolute inset-0 bg-background z-0 transition-all duration-1000 ease-in-out"
          style={dynamicBackgroundStyle}
        />
        
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
    </>
  );
};

export default LevelMapPage;
