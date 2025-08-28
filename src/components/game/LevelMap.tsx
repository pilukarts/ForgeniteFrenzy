
"use client";

import React, { useRef, useEffect, useMemo } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Hexagon, Check, Lock } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Constants for procedural layout
const LEVELS_TO_GENERATE = 200; // Total levels for this "stage"
const HEX_WIDTH = 100;
const HEX_HEIGHT = 115;
const VERTICAL_SPACING = HEX_HEIGHT * 0.75;
const HORIZONTAL_WAVE_AMPLITUDE = 200;
const HORIZONTAL_WAVE_FREQUENCY = 0.05;

const LevelMap: React.FC = () => {
  const { playerProfile } = useGame();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const currentPlayerRef = useRef<HTMLDivElement>(null);

  // Procedurally generate the layout for the level nodes
  const { nodes, containerWidth, containerHeight } = useMemo(() => {
    const generatedNodes = [];
    for (let i = 1; i <= LEVELS_TO_GENERATE; i++) {
      const y = i * VERTICAL_SPACING;
      // Use a sine wave to create a meandering horizontal path
      const x = Math.sin(i * HORIZONTAL_WAVE_FREQUENCY) * HORIZONTAL_WAVE_AMPLITUDE;
      generatedNodes.push({
        id: i,
        level: i,
        x,
        y,
      });
    }

    const allX = generatedNodes.map(n => n.x);
    const width = Math.max(...allX) - Math.min(...allX) + HEX_WIDTH * 2 + HORIZONTAL_WAVE_AMPLITUDE;
    const height = LEVELS_TO_GENERATE * VERTICAL_SPACING + HEX_HEIGHT * 2;

    const xOffset = width / 2;
    const yOffset = HEX_HEIGHT; // Padding at the top

    const positionedNodes = generatedNodes.map(node => ({ ...node, x: node.x + xOffset, y: height - node.y + yOffset }));

    return { nodes: positionedNodes, containerWidth: width, containerHeight: height + (yOffset * 2) };
  }, []);

  // Effect to scroll to the player's current level
  useEffect(() => {
    if (mapContainerRef.current && currentPlayerRef.current) {
        const container = mapContainerRef.current;
        const playerNode = currentPlayerRef.current;
        
        const containerRect = container.getBoundingClientRect();
        const playerNodeTop = playerNode.offsetTop;
        const playerNodeHeight = playerNode.offsetHeight;

        // Scroll to position the current level node in the vertical center of the view
        const scrollToY = playerNodeTop + (playerNodeHeight / 2) - (containerRect.height / 2);
        
        container.scrollTo({
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
