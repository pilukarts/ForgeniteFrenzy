
"use client";

import React, { useRef, useEffect, useMemo } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Hexagon, Check, Lock } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Layout data based on the provided "Silver Stage" image
const stageLayout: Array<Array<{ level: number }>> = [
  [{ level: 1 }],
  [{ level: 4 }, { level: 5 }],
  [{ level: 6 }, { level: 8 }, { level: 10 }],
  [{ level: 11 }, { level: 13 }, { level: 15 }, { level: 16 }],
  [{ level: 21 }, { level: 22 }, { level: 23 }, { level: 24 }, { level: 29 }],
  [{ level: 31 }, { level: 37 }, { level: 38 }, { level: 39 }, { level: 40 }, { level: 42 }],
  [{ level: 51 }, { level: 52 }, { level: 53 }, { level: 54 }, { level: 65 }, { level: 66 }, { level: 68 }],
  [{ level: 61 }, { level: 60 }, { level: 71 }, { level: 78 }, { level: 81 }, { level: 86 }],
  [{ level: 81 }, { level: 82 }, { level: 83 }, { level: 84 }, { level: 85 }],
  [{ level: 91 }, { level: 92 }, { level: 93 }, { level: 98 }],
  [{ level: 191 }, { level: 192 }, { level: 193 }],
  [{ level: 194 }, { level: 195 }],
  [{ level: 100 }],
];

// Constants for layout calculation
const HEX_WIDTH = 100;
const HEX_HEIGHT = 115; // Slightly taller for better visual separation
const CONTAINER_PADDING_Y = 120; // More space at the top for title

const LevelMap: React.FC = () => {
  const { playerProfile } = useGame();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const currentPlayerRef = useRef<HTMLDivElement>(null);

  const { nodes, containerWidth, containerHeight } = useMemo(() => {
    const flatNodes: any[] = [];
    
    stageLayout.forEach((row, rowIndex) => {
        const numItems = row.length;
        const yPos = CONTAINER_PADDING_Y + rowIndex * HEX_HEIGHT * 0.75;
        const rowStartX = -( (numItems - 1) * HEX_WIDTH ) / 2;

        row.forEach((node, colIndex) => {
            // Check for the duplicate '81' and give it a unique key
            const isDuplicate81 = node.level === 81 && rowIndex === 8;
            const uniqueId = isDuplicate81 ? `81-dupe` : `${node.level}`;
            
            flatNodes.push({
                ...node,
                id: uniqueId,
                x: rowStartX + colIndex * HEX_WIDTH,
                y: yPos,
            });
        });
    });

    const allX = flatNodes.map(n => n.x);
    const allY = flatNodes.map(n => n.y);
    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    
    const width = maxX - minX + HEX_WIDTH * 2;
    const height = maxY - minY + HEX_HEIGHT * 2;

    const xOffset = width / 2;
    const yOffset = 0;

    const positionedNodes = flatNodes.map(node => ({ ...node, x: node.x + xOffset, y: node.y + yOffset }));

    return { nodes: positionedNodes, containerWidth: width, containerHeight: height };
  }, []);

  useEffect(() => {
    if (mapContainerRef.current && currentPlayerRef.current) {
        const container = mapContainerRef.current;
        const playerNode = currentPlayerRef.current;
        
        const containerRect = container.getBoundingClientRect();
        const playerRect = playerNode.getBoundingClientRect();

        const scrollToX = playerNode.offsetLeft + (playerRect.width / 2) - (containerRect.width / 2);
        const scrollToY = playerNode.offsetTop + (playerRect.height / 2) - (containerRect.height / 2);
        
        container.scrollTo({
            left: scrollToX,
            top: scrollToY,
            behavior: 'smooth'
        });
    }
  }, [playerProfile?.level, nodes]);

  if (!playerProfile) {
    return <div className="flex items-center justify-center h-full"><p className="text-muted-foreground">Loading player data...</p></div>;
  }

  const { level: currentPlayerLevel, commanderSex } = playerProfile;
  const commanderImgSrc = commanderSex === 'male' ? "https://i.imgur.com/iuRJVBZ.png" : "https://i.imgur.com/BQHeVWp.png";
  const commanderAlt = commanderSex === 'male' ? "Male Commander" : "Female Commander";
  const commanderDataAiHint = commanderSex === 'male' ? "male soldier portrait" : "female soldier portrait";

  return (
    <div className="relative w-full h-full overflow-auto" ref={mapContainerRef}>
      <div className="absolute" style={{ width: containerWidth, height: containerHeight }}>
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center z-20">
             <h1 className="text-4xl sm:text-5xl font-headline text-primary tracking-widest">SILVER STAGE</h1>
             <p className="text-muted-foreground text-sm">Levels 1-200</p>
        </div>

        {nodes.map((node, index) => {
          const isUnlocked = node.level <= currentPlayerLevel;
          const isCurrent = node.level === currentPlayerLevel;
          const isCompleted = node.level < currentPlayerLevel;
          
          return (
             <motion.div
                key={node.id}
                ref={isCurrent ? currentPlayerRef : null}
                className="absolute"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.02, type: 'spring', stiffness: 150, damping: 20 }}
                style={{
                  left: node.x,
                  top: node.y,
                  width: HEX_WIDTH,
                  height: HEX_HEIGHT,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isCurrent ? 10 : 1,
                }}
             >
                <div className={cn(
                    "relative w-full h-full flex items-center justify-center text-white font-bold",
                    !isUnlocked && "opacity-50"
                )}>
                    <Hexagon strokeWidth={1.5} className={cn(
                        "absolute w-full h-full transition-colors duration-300",
                        isUnlocked ? "text-primary/70 fill-primary/10" : "text-muted-foreground/30 fill-muted/10"
                    )} />
                    <div className="relative z-10 flex flex-col items-center justify-center text-center">
                       {isCompleted ? (
                           <Check className="h-8 w-8 text-green-400" />
                       ) : isCurrent ? (
                           <div className="relative group">
                                <Image
                                    src={commanderImgSrc}
                                    alt={commanderAlt}
                                    data-ai-hint={commanderDataAiHint}
                                    width={60}
                                    height={60}
                                    className="rounded-full object-cover border-2 border-bright-gold animate-pulse"
                                    style={{ clipPath: 'circle(50% at 50% 50%)' }}
                                />
                                <span className="absolute -bottom-2 -right-2 text-xs bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center border-2 border-background">
                                    {node.level}
                                </span>
                           </div>
                       ) : ( // Locked
                           <>
                               <Lock className="h-6 w-6 text-muted-foreground/50" />
                               <span className="text-base text-muted-foreground/80 mt-1">{node.level}</span>
                           </>
                       )}
                    </div>
                </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
};

export default LevelMap;
