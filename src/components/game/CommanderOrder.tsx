
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useGame } from '@/contexts/GameContext';
import type { CommanderOrder } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, Timer, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [timeLeft, setTimeLeft] = useState(order.endTime - Date.now());
  const [key, setKey] = useState(order.id);

  const commanderImgSrc = playerProfile?.commanderSex === 'male' 
    ? "https://i.imgur.com/gB3i4OQ.png" // Headshot male
    : "https://i.imgur.com/J3tG1e4.png"; // Headshot female
  const commanderAlt = playerProfile?.commanderSex === 'male' ? 'Male Commander' : 'Female Commander';
  const commanderDataAiHint = playerProfile?.commanderSex === 'male' ? 'male commander headshot' : 'female commander headshot';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [order.id]);
  
  useEffect(() => {
    // Reset animation when a new order comes in
    setKey(order.id);
  }, [order.id]);

  const progressPercentage = (timeLeft / (order.endTime - order.startTime)) * 100;

  const missionText = `Commander, your orders are to acquire ${order.target.toLocaleString()} points. Failure is not an option.`;

  return (
    <AnimatePresence>
      <motion.div
        key={key}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto z-40 p-1 sm:p-2 pointer-events-none"
      >
        <div className="relative bg-card/80 backdrop-blur-lg border-t-2 border-primary/50 rounded-t-lg shadow-2xl p-2 flex items-center gap-2 pointer-events-auto">
           <Button onClick={onHide} variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:bg-black/20 hover:text-white z-10">
              <X className="h-4 w-4" />
              <span className="sr-only">Hide Order</span>
           </Button>

          {/* Commander Portrait */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 relative">
            <Image
              src={commanderImgSrc}
              alt={commanderAlt}
              data-ai-hint={commanderDataAiHint}
              layout="fill"
              className="object-contain"
            />
          </div>

          {/* Mission Details */}
          <div className="flex-grow min-w-0">
            <h4 className="font-headline text-primary text-base sm:text-lg">Commander's Orders</h4>
            <p className="text-sm text-foreground/90 leading-tight">
              {missionText}
            </p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <Timer className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Time Remaining:</span>
                <span className="font-mono font-semibold text-primary">{formatTime(timeLeft)}</span>
              </div>
              <Progress value={progressPercentage} className="h-1.5" indicatorClassName="bg-primary" />
            </div>
          </div>
          
           {/* Claim Button */}
           {order.isCompleted && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="ml-2" // Margin to separate from text content
              >
                <Button onClick={onClaim} size="sm" className="bg-green-600 hover:bg-green-500 text-white shadow-lg">
                  <Award className="mr-1 h-4 w-4" /> Claim
                </Button>
              </motion.div>
            )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommanderOrderBanner;
