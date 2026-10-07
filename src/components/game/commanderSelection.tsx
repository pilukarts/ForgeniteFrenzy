"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Lock } from "lucide-react";

export interface Commander {
  id: string;
  name: string;
  title: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockRequirement: number; // Required level to unlock
  tapPower: number;
  passiveIncome: number;
  avatar: string;
  color: string;
  borderColor: string;
  glowColor: string;
  abilities: string[];
}

export const AVAILABLE_COMMANDERS: Commander[] = [
  {
    id: "valkyr",
    name: "Valkyr",
    title: "Commander of the Forge",
    description: "Pioneer of the Vanguard Expedition. Master of industrial warfare and resource extraction.",
    rarity: "common",
    unlockRequirement: 1,
    tapPower: 1,
    passiveIncome: 0,
    avatar: "🛡️",
    color: "text-gray-600",
    borderColor: "border-gray-300",
    glowColor: "shadow-gray-300",
    abilities: ["Basic Tap Power", "Leadership Bonus"]
  },
  {
    id: "zenith",
    name: "Zenith",
    title: "Supreme Forge Architect",
    description: "Architect of victory. Designs the most efficient forge operations in the galaxy.",
    rarity: "rare",
    unlockRequirement: 10,
    tapPower: 2,
    passiveIncome: 1,
    avatar: "👑",
    color: "text-blue-600",
    borderColor: "border-blue-400",
    glowColor: "shadow-blue-300",
    abilities: ["Enhanced Tap Power", "Forge Efficiency", "Passive Income Generation"]
  },
  {
    id: "nova",
    name: "Nova",
    title: "Stellar Strategist",
    description: "Master of stellar engineering. Turns cosmic phenomena into powerful manufacturing tools.",
    rarity: "epic",
    unlockRequirement: 25,
    tapPower: 4,
    passiveIncome: 3,
    avatar: "⭐",
    color: "text-purple-600",
    borderColor: "border-purple-400",
    glowColor: "shadow-purple-300",
    abilities: ["Stellar Taps", "Quantum Efficiency", "Cosmic Income"]
  },
  {
    id: "forge",
    name: "Forge",
    title: "Master of Creation",
    description: "Legendary creator of civilizations. Can forge entire star systems with a single command.",
    rarity: "legendary",
    unlockRequirement: 50,
    tapPower: 8,
    passiveIncome: 8,
    avatar: "🌟",
    color: "text-yellow-600",
    borderColor: "border-yellow-400",
    glowColor: "shadow-yellow-300",
    abilities: ["Master Creator", "Legendary Taps", "Divine Income", "Cosmic Leadership"]
  }
];

interface CommanderSelectionProps {
  selectedCommander: Commander | null;
  onCommanderSelect: (commander: Commander) => void;
  currentLevel: number;
}

const rarityColors = {
  common: "bg-gray-100 text-gray-800 border-gray-300",
  rare: "bg-blue-100 text-blue-800 border-blue-300",
  epic: "bg-purple-100 text-purple-800 border-purple-300",
  legendary: "bg-yellow-100 text-yellow-800 border-yellow-300"
};

export default function CommanderSelection({ 
  selectedCommander, 
  onCommanderSelect, 
  currentLevel 
}: CommanderSelectionProps) {
  const [hoveredCommander, setHoveredCommander] = useState<string | null>(null);

  const isCommanderUnlocked = (commander: Commander) => {
    return currentLevel >= commander.unlockRequirement;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Select Your Commander
        </h2>
        <p className="text-gray-400">
          Choose your leader to begin the Vanguard Expedition
        </p>
        <div className="mt-4 text-sm text-gray-500">
          Current Level: {currentLevel}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {AVAILABLE_COMMANDERS.map((commander) => {
          const isUnlocked = isCommanderUnlocked(commander);
          const isSelected = selectedCommander?.id === commander.id;
          const isHovered = hoveredCommander === commander.id;

          return (
            <Card
              key={commander.id}
              className={`
                relative overflow-hidden transition-all duration-300 cursor-pointer
                ${commander.borderColor}
                ${isUnlocked ? 'hover:shadow-lg hover:scale-105' : 'opacity-60'}
                ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
                ${isHovered && isUnlocked ? commander.glowColor : ''}
                bg-gray-900 border-gray-700
              `}
              onClick={() => isUnlocked && onCommanderSelect(commander)}
              onMouseEnter={() => setHoveredCommander(commander.id)}
              onMouseLeave={() => setHoveredCommander(null)}
            >
              <CardHeader className="text-center pb-2">
                <div className="relative mb-4">
                  <div className={`
                    text-6xl mx-auto mb-2 transition-all duration-300
                    ${isUnlocked ? commander.color : 'text-gray-500 grayscale'}
                    ${isHovered && isUnlocked ? 'scale-110' : ''}
                  `}>
                    {commander.avatar}
                  </div>
                  
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                      <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="absolute -top-2 -right-2">
                      <Check className="w-6 h-6 text-green-500 bg-white rounded-full" />
                    </div>
                  )}
                </div>

                <CardTitle className={`text-xl font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                  {commander.name}
                </CardTitle>
                <p className={`text-sm ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                  {commander.title}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className={`text-xs ${isUnlocked ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                  {commander.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                      Tap Power:
                    </span>
                    <span className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                      {commander.tapPower}x
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                      Passive Income:
                    </span>
                    <span className={`font-bold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                      {commander.passiveIncome}/sec
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {commander.abilities.map((ability, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`text-xs ${isUnlocked ? rarityColors[commander.rarity] : 'bg-gray-700 text-gray-500 border-gray-600'}`}
                      >
                        {ability}
                      </Badge>
                    ))}
                  </div>
                </div>

                {!isUnlocked && (
                  <div className="text-center">
                    <Badge variant="destructive" className="text-xs">
                      Level {commander.unlockRequirement} Required
                    </Badge>
                  </div>
                )}

                {isUnlocked && !isSelected && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCommanderSelect(commander);
                    }}
                  >
                    Select Commander
                  </Button>
                )}

                {isSelected && (
                  <Button 
                    size="sm" 
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    disabled
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Selected
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
