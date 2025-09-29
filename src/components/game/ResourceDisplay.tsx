
"use client";
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Hexagon, Sparkles } from 'lucide-react'; // Hexagon for points, Sparkles for Auron

interface ResourceDisplayProps {
  seasonResourceAmount: number;
  auronCount: number;
}

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ seasonResourceAmount, auronCount }) => {
  const { currentSeason } = useGame();
  const IconComponent = currentSeason.objectiveResourceIcon || Hexagon;

  return (
    <div className="flex flex-col items-end gap-1 text-right">
      <div className="flex items-center gap-1.5 p-1 px-2 rounded-md bg-primary/10 border border-primary/30">
        <IconComponent className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-primary">
          {seasonResourceAmount.toLocaleString()}
        </span>
        <span className="text-[10px] text-primary/80 hidden sm:inline">({currentSeason.objectiveResourceName})</span>
      </div>
      <div className="flex items-center gap-1.5 p-1 px-2 rounded-md bg-bright-gold/10 border border-bright-gold/30">
        <Sparkles className="h-4 w-4 text-bright-gold" />
        <span className="text-xs font-semibold text-bright-gold">
          {auronCount.toLocaleString()}
        </span>
         <span className="text-[10px] text-bright-gold/80 hidden sm:inline">Auron</span>
      </div>
    </div>
  );
};

export default ResourceDisplay;
