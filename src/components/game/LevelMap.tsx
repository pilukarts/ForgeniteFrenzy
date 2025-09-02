
"use client";

import React, { useRef, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Hexagon, Check, Lock } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { LEVEL_STAGES } from '@/lib/gameData';

const LEVELS_BEFORE = 10; // How many past levels to show
const LEVELS_AFTER = 30; // How many upcoming levels to show
const TOTAL_LEVELS = 50000; // The total number of levels in this stage

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
  const commanderImgSrc = commanderSex === 'male' ? "https://i.imgur.com/gB3i4OQ.png" : "https://i.imgur.com/J3tG1e4.png";
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
  
  const getStageForLevel = (level: number) => {
    return LEVEL_STAGES.find(stage => level >= stage.startLevel && level <= stage.endLevel) || LEVEL_STAGES[0];
  };

  const startLevel = Math.max(1, currentPlayerLevel - LEVELS_BEFORE);
  const endLevel = Math.min(TOTAL_LEVELS, currentPlayerLevel + LEVELS_AFTER);
  
  const levelsToRender = Array.from({ length: (endLevel - startLevel) + 1 }, (_, i) => startLevel + i);

  return (
    <div ref={scrollContainerRef} className="h-full w-full overflow-y-auto relative p-4">
        {/* Spacer for levels before the rendered window, to keep scrollbar size consistent */}
        <div style={{ height: `${(startLevel - 1) * 8}rem` }} /> 
        <div className="flex flex-col items-center gap-y-4">
            {levelsToRender.slice().reverse().map((level) => {
                const isCurrent = level === currentPlayerLevel;
                const isCompleted = level < currentPlayerLevel;
                const stage = getStageForLevel(level);

                // Create a sine wave path for the levels
                const sineOffset = Math.sin(level * 0.5) * 40;

                const stageStyles = {
                  '--stage-color-primary': stage.colors.primary,
                  '--stage-color-fill': stage.colors.fill,
                } as React.CSSProperties;

                const StageEndComponent = LEVEL_STAGES.find(s => s.endLevel === level);

                return (
                  <React.Fragment key={level}>
                    <motion.div
                        ref={isCurrent ? currentPlayerRef : null}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: (level % 10) * 0.05 }}
                        className="relative w-28 h-32 flex items-center justify-center"
                        style={{ marginLeft: `${sineOffset}px`, ...stageStyles }}
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
                                "text-[hsl(var(--stage-color-primary))] fill-[hsl(var(--stage-color-fill))]",
                                isCompleted && "fill-[hsla(var(--stage-color-primary)/0.4)] text-[hsl(var(--stage-color-primary))] opacity-80"
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

                    {StageEndComponent && (
                      <div className="text-center my-8" style={{'--stage-color-primary': StageEndComponent.colors.primary} as React.CSSProperties}>
                        <h2 className="text-4xl sm:text-5xl font-headline tracking-widest text-[hsl(var(--stage-color-primary))]">
                          {StageEndComponent.name}
                        </h2>
                        <p className="text-muted-foreground text-sm">Levels {StageEndComponent.startLevel}-{StageEndComponent.endLevel}</p>
                      </div>
                    )}
                  </React.Fragment>
                );
            })}
        </div>
        {/* Spacer for levels after the rendered window */}
        <div style={{ height: `${(TOTAL_LEVELS - endLevel) * 8}rem` }} />
    </div>
  );
};

export default LevelMap;
