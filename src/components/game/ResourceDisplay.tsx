
"use client";
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Hexagon, Sparkles } from 'lucide-react'; // Hexagon for points, Sparkles for Auron

interface ResourceDisplayProps {
  seasonResourceName: string;
  auronCount: number;
}

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ seasonResourceName, auronCount }) => {
  const { currentSeason } = useGame();
  const IconComponent = currentSeason.objectiveResourceIcon || Hexagon;

  return (
    <div className="flex flex-col items-end gap-1 text-right">
      <div className="flex items-center gap-2 p-1.5 px-2.5 rounded-md bg-primary/10 border border-primary/30">
        <IconComponent className="h-5 w-5 text-primary" />
        <span className="text-sm font-semibold text-primary">
          {seasonResourceName}
        </span>
        <span className="text-xs text-primary/80 hidden sm:inline">({currentSeason.objectiveResourceName})</span>
      </div>
      <div className="flex items-center gap-2 p-1.5 px-2.5 rounded-md bg-bright-gold/10 border border-bright-gold/30">
        <Sparkles className="h-5 w-5 text-bright-gold" />
        <span className="text-sm font-semibold text-bright-gold">
          {auronCount}
        </span>
         <span className="text-xs text-bright-gold/80 hidden sm:inline">Auron</span>
      </div>
    </div>
  );
};

export default ResourceDisplay;
