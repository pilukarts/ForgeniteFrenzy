
"use client";

import type { PlayerProfile, Season, Upgrade, ArkUpgrade, CoreMessage, MarketplaceItem, ActiveTapBonus } from '@/lib/types';
import { SEASONS_DATA, UPGRADES_DATA, ARK_UPGRADES_DATA, MARKETPLACE_ITEMS_DATA, INITIAL_XP_TO_NEXT_LEVEL, XP_LEVEL_MULTIPLIER, getRankTitle, POINTS_PER_TAP, AURON_PER_WALLET_CONNECT, MULE_DRONE_BASE_RATE } from '@/lib/gameData';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getCoreBriefing } from '@/ai/flows/core-briefings';
import { getCoreLoreSnippet } from '@/ai/flows/core-lore-snippets';
import { getCoreProgressUpdate } from '@/ai/flows/core-progress-updates';


interface GameContextType {
  playerProfile: PlayerProfile | null;
  setPlayerProfile: React.Dispatch<React.SetStateAction<PlayerProfile | null>>;
  currentSeason: Season;
  seasons: Season[];
  getUpgradeLevel: (upgradeId: string) => number;
  purchaseUpgrade: (upgradeId: string) => void;
  getUpgradeCost: (upgradeId: string) => number;
  upgrades: Upgrade[];
  arkUpgrades: ArkUpgrade[];
  purchaseArkUpgrade: (upgradeId: string) => void;
  getArkUpgradeById: (upgradeId: string) => ArkUpgrade | undefined;
  addPoints: (amount: number, isTap?: boolean) => void;
  isLoading: boolean;
  isInitialSetupDone: boolean;
  completeInitialSetup: (name: string, sex: 'male' | 'female', country: string) => void;
  coreMessages: CoreMessage[];
  addCoreMessage: (message: Omit<CoreMessage, 'timestamp'>) => void;
  isCoreUnlocked: boolean;
  coreLastInteractionTime: number;
  setCoreLastInteractionTime: (time: number) => void;
  connectWallet: () => void;
  handleTap: () => void;
  criticalTapChance: number;
  criticalTapMultiplier: number;
  comboMultiplier: number;
  comboCount: number;
  setComboCount: React.Dispatch<React.SetStateAction<number>>;
  marketplaceItems: MarketplaceItem[];
  purchaseMarketplaceItem: (itemId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const defaultPlayerProfile: Omit<PlayerProfile, 'id' | 'name' | 'commanderSex' | 'country' | 'currentSeasonId'> = {
  points: 0,
  auron: 0,
  level: 1,
  xp: 0,
  xpToNextLevel: INITIAL_XP_TO_NEXT_LEVEL,
  rankTitle: getRankTitle(1),
  seasonProgress: {},
  upgrades: {},
  muleDrones: 0,
  coreVoiceProtocol: 'synthetic',
  isWalletConnected: false,
  arkHangarFullyUpgraded: false,
  lastLoginTimestamp: Date.now(),
  activeTapBonuses: [],
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialSetupDone, setIsInitialSetupDone] = useState(false);
  const [currentSeason, setCurrentSeason] = useState<Season>(SEASONS_DATA[0]);
  const [coreMessages, setCoreMessages] = useState<CoreMessage[]>([]);
  const [isCoreUnlocked, setIsCoreUnlocked] = useState(false);
  const [coreLastInteractionTime, setCoreLastInteractionTime] = useState<number>(0);
  const [comboCount, setComboCount] = useState(0);


  const { toast } = useToast();

  useEffect(() => {
    const savedProfile = localStorage.getItem('playerProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile) as PlayerProfile;
      // Ensure activeTapBonuses is initialized if it's not in saved data
      if (!parsedProfile.activeTapBonuses) {
        parsedProfile.activeTapBonuses = [];
      }
      setPlayerProfile(parsedProfile);
      setIsInitialSetupDone(true);
      const season = SEASONS_DATA.find(s => s.id === parsedProfile.currentSeasonId) || SEASONS_DATA[0];
      setCurrentSeason(season);
      setIsCoreUnlocked(!!parsedProfile.upgrades['coreUnlocked'] || SEASONS_DATA.slice(0, SEASONS_DATA.indexOf(season)).some(s => s.unlocksCore));
    }
    const savedCoreMessages = localStorage.getItem('coreMessages');
    if (savedCoreMessages) {
        setCoreMessages(JSON.parse(savedCoreMessages));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (playerProfile) {
      localStorage.setItem('playerProfile', JSON.stringify(playerProfile));
      // Update current season based on profile, could be more complex if seasons progress
      const season = SEASONS_DATA.find(s => s.id === playerProfile.currentSeasonId) || SEASONS_DATA[0];
      setCurrentSeason(season);
      const coreIsNowUnlocked = SEASONS_DATA.slice(0, SEASONS_DATA.findIndex(s => s.id === season.id) + 1).some(s => s.unlocksCore);
      setIsCoreUnlocked(coreIsNowUnlocked);

    }
  }, [playerProfile]);

  useEffect(() => {
    localStorage.setItem('coreMessages', JSON.stringify(coreMessages));
  }, [coreMessages]);

  const completeInitialSetup = (name: string, sex: 'male' | 'female', country: string) => {
    const newProfile: PlayerProfile = {
      ...defaultPlayerProfile,
      id: crypto.randomUUID(),
      name,
      commanderSex: sex,
      country,
      currentSeasonId: SEASONS_DATA[0].id,
      rankTitle: getRankTitle(1),
      lastLoginTimestamp: Date.now(),
      activeTapBonuses: [], // Initialize activeTapBonuses
    };
    setPlayerProfile(newProfile);
    setIsInitialSetupDone(true);
    setCurrentSeason(SEASONS_DATA[0]);
    addCoreMessage({ type: 'briefing', content: `Welcome, Commander ${name}! Your mission begins now.`});
  };
  
  const addCoreMessage = useCallback((message: Omit<CoreMessage, 'timestamp'>) => {
    setCoreMessages(prev => [{ ...message, timestamp: Date.now() }, ...prev.slice(0, 19)]); // Keep last 20 messages
  }, []);


  const addPoints = useCallback((amount: number, isTap: boolean = false) => {
    setPlayerProfile(prev => {
      if (!prev) return null;

      let finalAmount = amount;
      let updatedActiveTapBonuses = [...(prev.activeTapBonuses || [])];

      if (isTap && updatedActiveTapBonuses.length > 0) {
        let totalBonusMultiplierFactor = 0; 

        updatedActiveTapBonuses = updatedActiveTapBonuses.map(bonus => {
          totalBonusMultiplierFactor += (bonus.bonusMultiplier - 1);
          return { ...bonus, remainingTaps: bonus.remainingTaps - 1 };
        }).filter(bonus => bonus.remainingTaps > 0);
        
        finalAmount = amount * (1 + totalBonusMultiplierFactor);

        (prev.activeTapBonuses || []).forEach(oldBonus => {
            if (!updatedActiveTapBonuses.find(b => b.id === oldBonus.id)) {
                setTimeout(() => {
                    toast({ title: "Bonus Expired", description: `${oldBonus.name} has worn off.` });
                }, 0);
            }
        });
      }
      
      finalAmount = Math.round(finalAmount);

      const newPoints = prev.points + finalAmount;
      const newSeasonProgress = (prev.seasonProgress[currentSeason.id] || 0) + finalAmount;
      
      let newXp = prev.xp + finalAmount; 
      let newLevel = prev.level;
      let newXpToNextLevel = prev.xpToNextLevel;
      let newRankTitle = prev.rankTitle;

      while (newXp >= newXpToNextLevel) {
        newXp -= newXpToNextLevel;
        newLevel++;
        newXpToNextLevel = Math.floor(newXpToNextLevel * XP_LEVEL_MULTIPLIER);
        newRankTitle = getRankTitle(newLevel);
        const levelUpMessage = `Congratulations Commander, you've reached Level ${newLevel} - ${newRankTitle}!`;
        setTimeout(() => {
            toast({ title: "Rank Up!", description: levelUpMessage });
        }, 0);
      }
      
      return {
        ...prev,
        points: newPoints,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNextLevel,
        rankTitle: newRankTitle,
        seasonProgress: {
          ...prev.seasonProgress,
          [currentSeason.id]: newSeasonProgress,
        },
        activeTapBonuses: updatedActiveTapBonuses,
      };
    });
  }, [currentSeason, toast]);

  const getUpgradeLevel = useCallback((upgradeId: string) => {
    return playerProfile?.upgrades[upgradeId] || 0;
  }, [playerProfile]);

  const getUpgradeCost = useCallback((upgradeId: string) => {
    const upgrade = UPGRADES_DATA.find(u => u.id === upgradeId);
    if (!upgrade) return Infinity;
    const level = getUpgradeLevel(upgradeId);
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
  }, [getUpgradeLevel]);

  const purchaseUpgrade = useCallback((upgradeId: string) => {
    setPlayerProfile(prev => {
      if (!prev) return null;
      const cost = getUpgradeCost(upgradeId);
      if (prev.points >= cost) {
        const currentLevel = prev.upgrades[upgradeId] || 0;
        const upgradeInfo = UPGRADES_DATA.find(u => u.id === upgradeId);
        if (upgradeInfo?.maxLevel && currentLevel >= upgradeInfo.maxLevel) {
          toast({ title: "Max Level Reached", description: `${upgradeInfo.name} is already at its maximum level.`, variant: "default" });
          return prev;
        }
        toast({ title: "Upgrade Purchased!", description: `Successfully upgraded ${UPGRADES_DATA.find(u=>u.id===upgradeId)?.name}.` });
        return {
          ...prev,
          points: prev.points - cost,
          upgrades: {
            ...prev.upgrades,
            [upgradeId]: (prev.upgrades[upgradeId] || 0) + 1,
          }
        };
      } else {
        toast({ title: "Insufficient Points", description: "Not enough points to purchase this upgrade.", variant: "destructive" });
        return prev;
      }
    });
  }, [getUpgradeCost, toast]);

  const getArkUpgradeById = useCallback((upgradeId: string) => {
    return ARK_UPGRADES_DATA.find(u => u.id === upgradeId);
  }, []);

  const purchaseArkUpgrade = useCallback((upgradeId: string) => {
    setPlayerProfile(prev => {
      if (!prev) return null;
      const arkUpgrade = ARK_UPGRADES_DATA.find(u => u.id === upgradeId);
      if (!arkUpgrade || prev.upgrades[upgradeId]) { // Already purchased
        toast({ title: "Upgrade Invalid", description: "This Ark upgrade is already purchased or does not exist.", variant: "default" });
        return prev;
      }
      if (prev.points >= arkUpgrade.cost) {
        toast({ title: "Ark Upgrade Complete!", description: `${arkUpgrade.name} installed on your StarForge Ark.` });
        const newUpgrades = { ...prev.upgrades, [upgradeId]: 1 }; // Mark as purchased
        const allArkUpgradesPurchased = ARK_UPGRADES_DATA.every(u => newUpgrades[u.id]);
        
        return {
          ...prev,
          points: prev.points - arkUpgrade.cost,
          upgrades: newUpgrades,
          arkHangarFullyUpgraded: allArkUpgradesPurchased,
        };
      } else {
        toast({ title: "Insufficient Points", description: "Not enough points for this Ark upgrade.", variant: "destructive" });
        return prev;
      }
    });
  }, [toast]);

  const purchaseMarketplaceItem = useCallback((itemId: string) => {
    setPlayerProfile(prev => {
      if (!prev) return null;
      const item = MARKETPLACE_ITEMS_DATA.find(i => i.id === itemId);
      if (!item) {
        toast({ title: "Item not found", variant: "destructive" });
        return prev;
      }

      if (prev.auron < item.costInAuron) {
        toast({ title: "Insufficient Auron", description: `You need ${item.costInAuron} Auron to purchase ${item.name}.`, variant: "destructive" });
        return prev;
      }

      const newBonus: ActiveTapBonus = {
        id: crypto.randomUUID(),
        marketItemId: item.id,
        name: item.name,
        remainingTaps: item.bonusEffect.durationTaps,
        bonusMultiplier: item.bonusEffect.multiplier,
        originalDurationTaps: item.bonusEffect.durationTaps,
      };
      
      toast({ title: "Purchase Successful!", description: `${item.name} activated.` });
      return {
        ...prev,
        auron: prev.auron - item.costInAuron,
        activeTapBonuses: [...(prev.activeTapBonuses || []), newBonus],
      };
    });
  }, [toast]);


  const connectWallet = useCallback(() => {
    setPlayerProfile(prev => {
      if (!prev || prev.isWalletConnected) return prev;
      toast({ title: "Wallet Connected!", description: `You've received ${AURON_PER_WALLET_CONNECT} Auron bonus and unlocked the Ark Hangar!` });
      return {
        ...prev,
        isWalletConnected: true,
        auron: prev.auron + AURON_PER_WALLET_CONNECT,
      };
    });
  }, [toast]);

  const baseTapPower = POINTS_PER_TAP;
  const tapPowerUpgradeLevel = getUpgradeLevel('tapPower');
  const pointsPerTap = baseTapPower + tapPowerUpgradeLevel;

  const critChanceUpgradeLevel = getUpgradeLevel('critChance');
  const criticalTapChance = critChanceUpgradeLevel * 0.005; // 0.5% per level

  const critMultiplierUpgradeLevel = getUpgradeLevel('critMultiplier');
  const criticalTapMultiplier = 1 + (critMultiplierUpgradeLevel * 0.1); // Base crit is 2x, +10% per level from base (e.g. 2.1x, 2.2x)

  const comboBonusUpgradeLevel = getUpgradeLevel('comboBonus');
  const comboMultiplierValue = 1 + (comboBonusUpgradeLevel * 0.02) + (comboCount * 0.01); // +2% per upgrade level, +1% per combo hit


  const handleTap = useCallback(() => {
    let pointsToEarn = pointsPerTap;
    const isCritical = Math.random() < criticalTapChance;
    if (isCritical) {
      pointsToEarn *= criticalTapMultiplier;
       setTimeout(() => {
          toast({ title: "Critical Tap!", description: `+${Math.round(pointsToEarn * comboMultiplierValue)} points!`, duration: 1500 });
       }, 0);
    }
    
    pointsToEarn *= comboMultiplierValue;
    
    setComboCount(prev => prev + 1);
    setTimeout(() => setComboCount(0), 3000); // Reset combo after 3s of inactivity

    addPoints(pointsPerTap, true); 
  }, [addPoints, pointsPerTap, criticalTapChance, criticalTapMultiplier, comboMultiplierValue, toast]);


  // AI Interactions
  useEffect(() => {
    if (isInitialSetupDone && playerProfile && isCoreUnlocked && Date.now() - coreLastInteractionTime > 300000) { // 5 minutes
      (async () => {
        try {
          const briefingInput = {
            season: currentSeason.title,
            playerProgress: `Level ${playerProfile.level}, Objective Progress: ${playerProfile.seasonProgress[currentSeason.id] || 0}`,
          };
          const briefing = await getCoreBriefing(briefingInput);
          addCoreMessage({ type: 'briefing', content: briefing.briefing });

          const progressUpdateInput = {
            seasonObjective: currentSeason.coreBriefingObjective,
            playerProgress: playerProfile.points,
            playerLevel: playerProfile.level,
            availableUpgrades: UPGRADES_DATA.map(u => `${u.name} (Cost: ${getUpgradeCost(u.id)})`).join(', '),
          };
          const progressUpdate = await getCoreProgressUpdate(progressUpdateInput);
          addCoreMessage({ type: 'advice', content: progressUpdate.advice });
          addCoreMessage({ type: 'lore_snippet', content: progressUpdate.loreSnippet });
          
          if(playerProfile.lastLoginTimestamp) {
            const timeAwayMinutes = Math.floor((Date.now() - playerProfile.lastLoginTimestamp) / 60000);
            if (timeAwayMinutes > 5) { // If away for more than 5 minutes
                const resourcesGained = playerProfile.muleDrones * MULE_DRONE_BASE_RATE * timeAwayMinutes;
                if (resourcesGained > 0) addPoints(resourcesGained); // Add passively gained points
                
                const loreSnippetInput = {
                    timeAway: timeAwayMinutes,
                    resourcesGained,
                };
                const loreSnippet = await getCoreLoreSnippet(loreSnippetInput);
                addCoreMessage({ type: 'lore_snippet', content: loreSnippet.snippet });
            }
          }
          setPlayerProfile(p => p ? {...p, lastLoginTimestamp: Date.now()} : null);
          setCoreLastInteractionTime(Date.now());
        } catch (error) {
          console.error("C.O.R.E. API Error:", error);
          let errorMessage = "C.O.R.E. systems experiencing interference. Stand by, Commander.";
          if (error instanceof Error && error.message.includes("429")) {
            errorMessage = "C.O.R.E. uplink temporarily disrupted due to high traffic. Recalibrating. Please stand by.";
          }
          addCoreMessage({ type: 'briefing', content: errorMessage });
          // Optionally, set a shorter retry or indicate a longer cooldown if 429 specifically.
           setCoreLastInteractionTime(Date.now()); // Still update time to prevent immediate retry
        }
      })();
    }
  }, [isInitialSetupDone, playerProfile, currentSeason, isCoreUnlocked, coreLastInteractionTime, addCoreMessage, getUpgradeCost, addPoints]);


  return (
    <GameContext.Provider value={{ 
        playerProfile, 
        setPlayerProfile, 
        currentSeason, 
        seasons: SEASONS_DATA,
        getUpgradeLevel, 
        purchaseUpgrade, 
        getUpgradeCost,
        upgrades: UPGRADES_DATA,
        arkUpgrades: ARK_UPGRADES_DATA,
        purchaseArkUpgrade,
        getArkUpgradeById,
        addPoints, 
        isLoading, 
        isInitialSetupDone, 
        completeInitialSetup,
        coreMessages,
        addCoreMessage,
        isCoreUnlocked,
        coreLastInteractionTime,
        setCoreLastInteractionTime,
        connectWallet,
        handleTap,
        criticalTapChance,
        criticalTapMultiplier,
        comboMultiplier: comboMultiplierValue,
        comboCount,
        setComboCount,
        marketplaceItems: MARKETPLACE_ITEMS_DATA,
        purchaseMarketplaceItem,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

