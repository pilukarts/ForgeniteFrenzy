
"use client";

import React, { useRef, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Hexagon, Check, Lock } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const LEVELS_BEFORE = 10; // How many past levels to show
const LEVELS_AFTER = 30; // How many upcoming levels to show
const TOTAL_LEVELS = 200; // The total number of levels in this stage

const LevelMap: React.FC = () => {
  const { playerProfile } = useGame();
  const { toast } = useToast();
  const currentPlayerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentPlayerRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const playerNode = currentPlayerRef.current;

      const containerRect = container.getBoundingClientRect();
      const playerNodeTop = playerNode.offsetTop;
      
      const scrollToY = playerNodeTop - (containerRect.height / 2) + (playerNode.offsetHeight / 2);
      
      container.scrollTo({
        top: scrollToY,
        behavior: 'smooth'
      });
    }
  }, [playerProfile?.level]);

  if (!playerProfile) {
    return <div className="flex items-center justify-center h-full"><p className="text-muted-foreground">Loading player data...</p></div>;
  }

  const { level: currentPlayerLevel, commanderSex } = playerProfile;
  const commanderImgSrc = commanderSex === 'male' ? "https://i.imgur.com/iuRJVBZ.png" : "https://i.imgur.com/BQHeVWp.png";
  const commanderAlt = commanderSex === 'male' ? "Male Commander" : "Female Commander";
  const commanderDataAiHint = commanderSex === 'male' ? "male soldier portrait" : "female soldier portrait";

  const handleHexagonClick = (level: number, isUnlocked: boolean, isCurrent: boolean, isCompleted: boolean) => {
    if (isCurrent) {
        toast({ title: `C.O.R.E. Report`, description: `You are here, Commander. Mission: Level ${level}.` });
    } else if (isCompleted) {
        toast({ title: `Sector Cleared`, description: `Level ${level} has already been secured.` });
    } else {
        toast({ title: `Sector Locked`, description: `You must reach level ${level} to access this sector.`, variant: 'destructive' });
    }
  };
  
  // Calculate the window of levels to render
  const startLevel = Math.max(1, currentPlayerLevel - LEVELS_BEFORE);
  const endLevel = Math.min(TOTAL_LEVELS, currentPlayerLevel + LEVELS_AFTER);
  
  const levelsToRender = Array.from({ length: (endLevel - startLevel) + 1 }, (_, i) => startLevel + i);

  return (
    <div ref={scrollContainerRef} className="h-full w-full overflow-y-auto relative p-4">
        {/* We add a spacer to simulate the scroll position for levels before our window */}
        <div style={{ height: `${(startLevel - 1) * 8}rem` }} />
        <div className="flex flex-col items-center gap-y-4">
            {/* Render levels in reverse so level 1 is at the bottom */}
            {levelsToRender.slice().reverse().map((level) => {
                const isCurrent = level === currentPlayerLevel;
                const isCompleted = level < currentPlayerLevel;

                const sineOffset = Math.sin(level * 0.5) * 40; // Pixels of horizontal offset

                return (
                    <motion.div
                        key={level}
                        ref={isCurrent ? currentPlayerRef : null}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: (level % 10) * 0.05 }}
                        className="relative w-28 h-32 flex items-center justify-center"
                        style={{ marginLeft: `${sineOffset}px` }}
                    >
                        <button 
                            onClick={() => handleHexagonClick(level, true, isCurrent, isCompleted)}
                            className={cn(
                                "absolute w-full h-full flex items-center justify-center text-white font-bold transition-transform duration-200 group",
                                "focus:outline-none focus:ring-2 focus:ring-bright-gold focus:ring-offset-2 focus:ring-offset-background rounded-full",
                                "hover:scale-110"
                            )}
                            aria-label={`Level ${level}`}
                        >
                            <Hexagon strokeWidth={1.5} className={cn(
                                "absolute w-full h-full transition-colors duration-300",
                                "text-primary/70 fill-primary/10",
                                isCompleted && "fill-primary/20 text-primary"
                            )} />
                            <div className="relative z-10 flex flex-col items-center justify-center text-center">
                            {isCompleted ? (
                                <>
                                    <Check className="h-8 w-8 text-green-400" />
                                    <span className="text-sm font-bold text-green-400/80">{level}</span>
                                </>
                            ) : isCurrent ? (
                                <div className="relative">
                                    <Image
                                        src={commanderImgSrc}
                                        alt={commanderAlt}
                                        data-ai-hint={commanderDataAiHint}
                                        width={60}
                                        height={60}
                                        className="rounded-full object-cover border-2 border-bright-gold animate-pulse pointer-events-none"
                                        style={{ clipPath: 'circle(50% at 50% 50%)' }}
                                    />
                                    <span className="absolute -bottom-2 -right-2 text-xs bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center border-2 border-background pointer-events-none">
                                        {level}
                                    </span>
                                </div>
                            ) : ( // Upcoming
                                <>
                                    <Lock className="h-6 w-6 text-muted-foreground/50" />
                                    <span className="text-base text-muted-foreground/80 mt-1">{level}</span>
                                </>
                            )}
                            </div>
                        </button>
                    </motion.div>
                );
            })}
             {endLevel === TOTAL_LEVELS && (
                 <div className="text-center my-8">
                    <h1 className="text-4xl sm:text-5xl font-headline text-primary tracking-widest">SILVER STAGE</h1>
                    <p className="text-muted-foreground text-sm">Levels 1-200</p>
                </div>
             )}
        </div>
         {/* We add a spacer to simulate the scroll position for levels after our window */}
        <div style={{ height: `${(TOTAL_LEVELS - endLevel) * 8}rem` }} />
    </div>
  );
};

export default LevelMap;
