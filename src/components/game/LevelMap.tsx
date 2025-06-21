
"use client";

import React, { useRef, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Hexagon, Check, Lock } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const TOTAL_LEVELS_ON_MAP = 50;

// Generate a winding path for the levels
const generatePath = (numLevels: number) => {
    const coords = [];
    let x = 5;
    let y = 45;
    let direction = 1; // 1 for right, -1 for left

    for (let i = 0; i < numLevels; i++) {
        coords.push({ x, y });

        if ((i + 1) % 5 === 0) { // Every 5 levels, move down and reverse direction
            y += 20;
            direction *= -1;
        } else { // Move along the path
            x += 16 * direction;
            y = y + ((i + (Math.floor(i/5) % 2)) % 2 === 0 ? -12 : 12);
        }
    }
    return coords;
}

const pathCoords = generatePath(TOTAL_LEVELS_ON_MAP);


const LevelMap: React.FC = () => {
  const { playerProfile } = useGame();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const currentPlayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll the current player level into view
    if (mapContainerRef.current && currentPlayerRef.current) {
        const container = mapContainerRef.current;
        const playerNode = currentPlayerRef.current;
        const containerWidth = container.offsetWidth;
        const playerLeft = playerNode.offsetLeft;
        
        container.scrollLeft = playerLeft - (containerWidth / 2) + (playerNode.offsetWidth / 2);
    }
  }, [playerProfile?.level]);


  if (!playerProfile) {
    return <div className="flex items-center justify-center h-full"><p className="text-muted-foreground">Loading player data...</p></div>;
  }

  const { level: currentPlayerLevel, commanderSex } = playerProfile;
  const commanderImgSrc = commanderSex === 'male' ? "https://i.imgur.com/iuRJVBZ.png" : "https://i.imgur.com/BQHeVWp.png";
  const commanderAlt = commanderSex === 'male' ? "Male Commander" : "Female Commander";
  const commanderDataAiHint = commanderSex === 'male' ? "male soldier portrait" : "female soldier portrait";


  const levels = Array.from({ length: TOTAL_LEVELS_ON_MAP }, (_, i) => {
    const levelNumber = i + 1;
    return {
      levelNumber,
      isUnlocked: levelNumber <= currentPlayerLevel,
      isCurrent: levelNumber === currentPlayerLevel,
      isCompleted: levelNumber < currentPlayerLevel,
      coords: pathCoords[i] || {x: 0, y: 0}
    };
  });
  
  const mapWidth = Math.max(...pathCoords.map(p => p.x)) + 15;
  const mapHeight = Math.max(...pathCoords.map(p => p.y)) + 15;


  return (
    <div className="relative w-full h-full overflow-auto" ref={mapContainerRef}>
      <div className="relative" style={{ width: `${mapWidth}%`, height: `${mapHeight}%`, minHeight: '100%' }}>
        {/* Render path line */}
         <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1 }}>
            <path
                d={`M ${pathCoords[0].x + 3}% ${pathCoords[0].y + 5}% ` + pathCoords.slice(1).map(p => `L ${p.x + 3}% ${p.y + 5}%`).join(' ')}
                stroke="hsl(var(--border))"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6 6"
            />
        </svg>

        {levels.map((level) => (
          <motion.div
            key={level.levelNumber}
            ref={level.isCurrent ? currentPlayerRef : null}
            className="absolute"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: level.levelNumber * 0.05, type: 'spring', stiffness: 200, damping: 15 }}
            style={{
              left: `${level.coords.x}%`,
              top: `${level.coords.y}%`,
              zIndex: 2,
            }}
          >
            <div className={cn(
              "relative w-20 h-24 flex items-center justify-center text-white font-bold text-lg",
              !level.isUnlocked && "opacity-60"
            )}>
              <Hexagon className={cn(
                "absolute w-full h-full transition-colors duration-300",
                level.isUnlocked ? "text-primary fill-primary/20" : "text-muted-foreground/50 fill-muted/20"
              )} />

              <div className="relative z-10 flex flex-col items-center">
                {level.isCompleted ? (
                  <Check className="h-8 w-8 text-green-400" />
                ) : level.isCurrent ? (
                    <div className="relative">
                         <Image
                            src={commanderImgSrc}
                            alt={commanderAlt}
                            data-ai-hint={commanderDataAiHint}
                            width={50}
                            height={50}
                            className="rounded-full object-contain border-2 border-bright-gold animate-pulse"
                        />
                         <span className="absolute -bottom-2 -right-2 text-xs bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center border-2 border-background">
                            {level.levelNumber}
                         </span>
                    </div>
                ) : ( // Locked
                  <>
                    <Lock className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">{level.levelNumber}</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LevelMap;
