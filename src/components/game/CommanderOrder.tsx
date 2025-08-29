"use client";

import React from 'react';
import Image from 'next/image';
import type { CommanderOrder } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, Timer, X } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

interface CommanderOrderProps {
  order: CommanderOrder;
  onClaim: () => void;
  onHide: () => void;
}

const formatTime = (ms: number) => {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const CommanderOrderBanner: React.FC<CommanderOrderProps> = ({ order, onClaim, onHide }) => {
  const { playerProfile } = useGame();
  const [timeLeft, setTimeLeft] = React.useState(order.endTime - Date.now());
  const [key, setKey] = React.useState(order.id);

  const commanderImgSrc = playerProfile?.commanderSex === 'male' 
    ? "https://i.imgur.com/gB3i4OQ.png"
    : "https://i.imgur.com/J3tG1e4.png";
  const commanderAlt = playerProfile?.commanderSex === 'male' ? 'Male Commander' : 'Female Commander';
  const commanderDataAiHint = playerProfile?.commanderSex === 'male' ? 'male commander headshot' : 'female commander headshot';
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [order.id]);
  
  React.useEffect(() => {
    setKey(order.id);
  }, [order.id]);

  const timeProgressPercentage = (timeLeft / (order.endTime - order.startTime)) * 100;
  const missionText = `Commander, your orders are to acquire ${order.target.toLocaleString()} points. Failure is not an option.`;

  return (
    <AnimatePresence>
      <motion.div
        key={key}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 w-full z-[50] p-1 sm:p-2 pointer-events-none"
      >
        <div className="relative pt-8 max-w-md mx-auto pointer-events-auto">
            <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 z-20"
                initial={{ scale: 0, y: 50}}
                animate={{ scale: 1, y: 0}}
                transition={{ delay: 0.2, type: 'spring' }}
            >
                <Image
                src={commanderImgSrc}
                alt={commanderAlt}
                data-ai-hint={commanderDataAiHint}
                width={100}
                height={100}
                className="object-contain drop-shadow-lg"
                />
            </motion.div>

            <div className="relative bg-card/90 backdrop-blur-lg border-t-2 border-primary/50 rounded-t-lg shadow-2xl p-3 flex flex-col items-center text-center">
                <Button onClick={onHide} variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:bg-black/20 hover:text-white z-10">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Hide Order</span>
                </Button>

                <h4 className="font-headline text-primary text-base sm:text-lg mt-4">Commander's Orders</h4>
                <p className="text-sm text-foreground/90 leading-tight px-2">
                    {missionText}
                </p>
                <div className="mt-2 space-y-1 w-full max-w-xs">
                    <div className="flex items-center justify-center gap-2 text-xs">
                        <Timer className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Time Left:</span>
                        <span className="font-mono font-semibold text-primary">{formatTime(timeLeft)}</span>
                    </div>
                    <Progress value={timeProgressPercentage} className="h-1.5" indicatorClassName="bg-primary" />
                </div>
            
                {order.isCompleted && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="mt-2"
                    >
                        <Button onClick={onClaim} size="sm" className="bg-green-600 hover:bg-green-500 text-white shadow-lg">
                        <Award className="mr-1 h-4 w-4" /> Claim Reward
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommanderOrderBanner;
