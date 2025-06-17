
"use client";

import type { PlayerProfile, Season, Upgrade, ArkUpgrade, CoreMessage, MarketplaceItem, ActiveTapBonus, DailyQuest, QuestType } from '@/lib/types';
import { SEASONS_DATA, UPGRADES_DATA, ARK_UPGRADES_DATA, MARKETPLACE_ITEMS_DATA, DAILY_QUESTS_POOL, INITIAL_XP_TO_NEXT_LEVEL, XP_LEVEL_MULTIPLIER, getRankTitle, POINTS_PER_TAP, AURON_PER_WALLET_CONNECT, MULE_DRONE_BASE_RATE } from '@/lib/gameData';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getCoreBriefing } from '@/ai/flows/core-briefings';
import { getCoreLoreSnippet } from '@/ai/flows/core-lore-snippets';
import { getCoreProgressUpdate } from '@/ai/flows/core-progress-updates';

const TAPS_PER_UNIFORM_PIECE = 2000;
const UNIFORM_PIECES_ORDER = ["Tactical Gloves", "Combat Boots", "Utility Belt", "Chest Rig", "Stealth Helmet"];
const NUMBER_OF_DAILY_QUESTS = 3;

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
  connectWallet: () => void;
  handleTap: () => void;
  criticalTapChance: number;
  criticalTapMultiplier: number;
  comboMultiplier: number;
  comboCount: number;
  setComboCount: React.Dispatch<React.SetStateAction<number>>;
  marketplaceItems: MarketplaceItem[];
  purchaseMarketplaceItem: (itemId: string) => void;
  switchCommanderSex: () => void;
  claimQuestReward: (questId: string) => void;
  refreshDailyQuestsIfNeeded: () => void;
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
  totalTapsForUniform: 0,
  equippedUniformPieces: [],
  activeDailyQuests: [],
  lastDailyQuestRefresh: 0,
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
  const [isAICallInProgress, setIsAICallInProgress] = useState(false);

  const { toast } = useToast();

  const updateQuestProgress = useCallback((profile: PlayerProfile, type: QuestType, value: number): PlayerProfile => {
    if (!profile.activeDailyQuests) return profile;

    const updatedQuests = profile.activeDailyQuests.map(quest => {
      if (quest.type === type && !quest.isClaimed && !quest.isCompleted) {
        const newProgress = quest.progress + value;
        const isCompleted = newProgress >= quest.target;
        if (isCompleted && !quest.isCompleted) {
            setTimeout(() => {
                toast({ title: "Quest Objective Met!", description: `You've met the objective for: ${quest.title}`});
            }, 0);
        }
        return { ...quest, progress: Math.min(newProgress, quest.target), isCompleted };
      }
      return quest;
    });
    return { ...profile, activeDailyQuests: updatedQuests };
  }, [toast]);
  
  const refreshDailyQuestsIfNeeded = useCallback(() => {
    setPlayerProfile(prev => {
        if (!prev) return null;

        const now = new Date();
        const lastRefreshDate = new Date(prev.lastDailyQuestRefresh);
        const isNewDay = now.getFullYear() > lastRefreshDate.getFullYear() ||
                         now.getMonth() > lastRefreshDate.getMonth() ||
                         now.getDate() > lastRefreshDate.getDate();

        if (!isNewDay && prev.activeDailyQuests && prev.activeDailyQuests.length > 0) {
            return prev; // No need to refresh if quests exist and it's not a new day
        }
        
        // If it's a new day or no quests, generate new ones
        const availableQuestTemplates = [...DAILY_QUESTS_POOL];
        const newQuests: DailyQuest[] = [];
        const usedTemplateIds = new Set<string>();

        while (newQuests.length < NUMBER_OF_DAILY_QUESTS && availableQuestTemplates.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableQuestTemplates.length);
            const template = availableQuestTemplates.splice(randomIndex, 1)[0];

            if (!usedTemplateIds.has(template.templateId)) {
                let progress = 0;
                let isCompleted = false;
                if (template.type === 'login') {
                    progress = 1;
                    isCompleted = progress >= template.target;
                }
                newQuests.push({
                    id: `${template.templateId}-${now.getTime()}`,
                    templateId: template.templateId,
                    title: template.title,
                    description: template.description,
                    type: template.type,
                    target: template.target,
                    progress: progress,
                    reward: { ...template.reward },
                    isCompleted: isCompleted,
                    isClaimed: false,
                    icon: template.icon,
                });
                usedTemplateIds.add(template.templateId);
            }
        }
        setTimeout(() => {
          toast({ title: "Daily Quests Refreshed!", description: "New challenges await you, Commander." });
        }, 500); // Delay slightly so it doesn't overlap with other initial toasts
        return { ...prev, activeDailyQuests: newQuests, lastDailyQuestRefresh: now.getTime() };
    });
  }, [toast]);

  useEffect(() => {
    const savedProfile = localStorage.getItem('playerProfile');
    if (savedProfile) {
      let parsedProfile = JSON.parse(savedProfile) as PlayerProfile;
      // Initialize new fields if they don't exist
      parsedProfile.activeTapBonuses = parsedProfile.activeTapBonuses ?? [];
      parsedProfile.totalTapsForUniform = parsedProfile.totalTapsForUniform ?? 0;
      parsedProfile.equippedUniformPieces = parsedProfile.equippedUniformPieces ?? [];
      parsedProfile.activeDailyQuests = parsedProfile.activeDailyQuests ?? [];
      parsedProfile.lastDailyQuestRefresh = parsedProfile.lastDailyQuestRefresh ?? 0;

      setPlayerProfile(parsedProfile);
      setIsInitialSetupDone(true);
      const season = SEASONS_DATA.find(s => s.id === parsedProfile.currentSeasonId) || SEASONS_DATA[0];
      setCurrentSeason(season);
      setIsCoreUnlocked(!!parsedProfile.upgrades['coreUnlocked'] || SEASONS_DATA.slice(0, SEASONS_DATA.indexOf(season)).some(s => s.unlocksCore));
      setCoreLastInteractionTime(parsedProfile.lastLoginTimestamp || Date.now());
    } else {
        setIsLoading(false); // If no profile, not loading a profile
    }
    const savedCoreMessages = localStorage.getItem('coreMessages');
    if (savedCoreMessages) {
        setCoreMessages(JSON.parse(savedCoreMessages));
    }
  }, []);

  // This effect should run after the profile is loaded from localStorage or newly created
  useEffect(() => {
    if (playerProfile && isInitialSetupDone) {
      refreshDailyQuestsIfNeeded();
    }
    if (!savedProfile && !isLoading) { // If no profile was saved and we are not in initial loading anymore
        setIsLoading(false); // Stop global loading for new users after setup screen is ready
    } else if (savedProfile) {
        setIsLoading(false); // Stop global loading if profile was loaded
    }
  }, [playerProfile, isInitialSetupDone, refreshDailyQuestsIfNeeded]);
  const savedProfile = typeof window !== "undefined" ? localStorage.getItem('playerProfile') : null;


  useEffect(() => {
    if (playerProfile) {
      localStorage.setItem('playerProfile', JSON.stringify(playerProfile));
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
    const now = Date.now();
    const newProfileData: PlayerProfile = {
      ...defaultPlayerProfile,
      id: crypto.randomUUID(),
      name,
      commanderSex: sex,
      country,
      currentSeasonId: SEASONS_DATA[0].id,
      rankTitle: getRankTitle(1),
      lastLoginTimestamp: now,
      lastDailyQuestRefresh: 0, // Will be set by refreshDailyQuestsIfNeeded
      activeDailyQuests: [], // Will be populated by refreshDailyQuestsIfNeeded
    };
    setPlayerProfile(newProfileData); // Set profile first
    setIsInitialSetupDone(true); // Then mark setup as done
    setCurrentSeason(SEASONS_DATA[0]);
    addCoreMessage({ type: 'briefing', content: `Welcome, Commander ${name}! Your mission begins now.`});
    setCoreLastInteractionTime(now);
    // refreshDailyQuestsIfNeeded will be called by the useEffect that watches playerProfile and isInitialSetupDone
  };
  
  const addCoreMessage = useCallback((message: Omit<CoreMessage, 'timestamp'>) => {
    setCoreMessages(prev => [{ ...message, timestamp: Date.now() }, ...prev.slice(0, 19)]);
  }, []);

  const addPoints = useCallback((amount: number, isTap: boolean = false) => {
    setPlayerProfile(prev => {
      if (!prev) return null;

      let finalAmount = amount;
      let updatedProfile = { ...prev };

      if (isTap && updatedProfile.activeTapBonuses.length > 0) {
        let totalBonusMultiplierFactor = 0;
        let stillActiveBonuses = updatedProfile.activeTapBonuses.map(bonus => {
          totalBonusMultiplierFactor += (bonus.bonusMultiplier - 1);
          return { ...bonus, remainingTaps: bonus.remainingTaps - 1 };
        }).filter(bonus => bonus.remainingTaps > 0);
        
        finalAmount = amount * (1 + totalBonusMultiplierFactor);

        updatedProfile.activeTapBonuses.forEach(oldBonus => {
            if (!stillActiveBonuses.find(b => b.id === oldBonus.id)) {
                setTimeout(() => {
                    toast({ title: "Bonus Expired", description: `${oldBonus.name} has worn off.` });
                }, 0);
            }
        });
        updatedProfile.activeTapBonuses = stillActiveBonuses;
      }
      
      finalAmount = Math.round(finalAmount);

      updatedProfile.points += finalAmount;
      updatedProfile.seasonProgress[currentSeason.id] = (updatedProfile.seasonProgress[currentSeason.id] || 0) + finalAmount;
      
      let newXp = updatedProfile.xp + finalAmount;
      while (newXp >= updatedProfile.xpToNextLevel) {
        newXp -= updatedProfile.xpToNextLevel;
        updatedProfile.level++;
        updatedProfile.xpToNextLevel = Math.floor(updatedProfile.xpToNextLevel * XP_LEVEL_MULTIPLIER);
        updatedProfile.rankTitle = getRankTitle(updatedProfile.level);
        const levelUpMessage = `Congratulations Commander, you've reached Level ${updatedProfile.level} - ${updatedProfile.rankTitle}!`;
        setTimeout(() => {
            toast({ title: "Rank Up!", description: levelUpMessage });
        }, 0);
      }
      updatedProfile.xp = newXp;

      // Update points_earned quests
      updatedProfile = updateQuestProgress(updatedProfile, 'points_earned', finalAmount);
      
      return updatedProfile;
    });
  }, [currentSeason, toast, updateQuestProgress]);

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
      const upgradeInfo = UPGRADES_DATA.find(u => u.id === upgradeId);

      if (prev.points >= cost) {
        const currentLevel = prev.upgrades[upgradeId] || 0;
        
        if (upgradeInfo?.maxLevel && currentLevel >= upgradeInfo.maxLevel) {
          setTimeout(() => {
            toast({ title: "Max Level Reached", description: `${upgradeInfo.name} is already at its maximum level.`, variant: "default" });
          }, 0);
          return prev;
        }
        setTimeout(() => {
          toast({ title: "Upgrade Purchased!", description: `Successfully upgraded ${upgradeInfo?.name}.` });
        }, 0);
        
        let updatedProfile = {
          ...prev,
          points: prev.points - cost,
          upgrades: {
            ...prev.upgrades,
            [upgradeId]: (prev.upgrades[upgradeId] || 0) + 1,
          }
        };
        updatedProfile = updateQuestProgress(updatedProfile, 'purchase_upgrade', 1);
        return updatedProfile;

      } else {
        setTimeout(() => {
          toast({ title: "Insufficient Points", description: "Not enough points to purchase this upgrade.", variant: "destructive" });
        }, 0);
        return prev;
      }
    });
  }, [getUpgradeCost, toast, updateQuestProgress]);

  const getArkUpgradeById = useCallback((upgradeId: string) => {
    return ARK_UPGRADES_DATA.find(u => u.id === upgradeId);
  }, []);

  const purchaseArkUpgrade = useCallback((upgradeId: string) => {
    setPlayerProfile(prev => {
      if (!prev) return null;
      const arkUpgrade = ARK_UPGRADES_DATA.find(u => u.id === upgradeId);
      if (!arkUpgrade || prev.upgrades[upgradeId]) { 
        setTimeout(() => {
          toast({ title: "Upgrade Invalid", description: "This Ark upgrade is already purchased or does not exist.", variant: "default" });
        }, 0);
        return prev;
      }
      if (prev.points >= arkUpgrade.cost) {
        setTimeout(() => {
          toast({ title: "Ark Upgrade Complete!", description: `${arkUpgrade.name} installed on your StarForge Ark.` });
        }, 0);
        const newUpgrades = { ...prev.upgrades, [upgradeId]: 1 }; 
        const allArkUpgradesPurchased = ARK_UPGRADES_DATA.every(u => newUpgrades[u.id]);
        
        let updatedProfile = {
          ...prev,
          points: prev.points - arkUpgrade.cost,
          upgrades: newUpgrades,
          arkHangarFullyUpgraded: allArkUpgradesPurchased,
        };
        // Assuming Ark upgrades also count for 'purchase_upgrade' quests
        updatedProfile = updateQuestProgress(updatedProfile, 'purchase_upgrade', 1);
        return updatedProfile;
      } else {
        setTimeout(() => {
          toast({ title: "Insufficient Points", description: "Not enough points for this Ark upgrade.", variant: "destructive" });
        }, 0);
        return prev;
      }
    });
  }, [toast, updateQuestProgress]);

  const purchaseMarketplaceItem = useCallback((itemId: string) => {
    setPlayerProfile(prev => {
      if (!prev) return null;
      const item = MARKETPLACE_ITEMS_DATA.find(i => i.id === itemId);
      if (!item) {
        setTimeout(() => {
          toast({ title: "Item not found", variant: "destructive" });
        }, 0);
        return prev;
      }

      if (prev.auron < item.costInAuron) {
        setTimeout(() => {
          toast({ title: "Insufficient Auron", description: `You need ${item.costInAuron} Auron to purchase ${item.name}.`, variant: "destructive" });
        }, 0);
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
      
      setTimeout(() => {
        toast({ title: "Purchase Successful!", description: `${item.name} activated.` });
      }, 0);

      let updatedProfile = {
        ...prev,
        auron: prev.auron - item.costInAuron,
        activeTapBonuses: [...(prev.activeTapBonuses || []), newBonus],
      };
      updatedProfile = updateQuestProgress(updatedProfile, 'spend_auron', item.costInAuron);
      return updatedProfile;
    });
  }, [toast, updateQuestProgress]);

  const connectWallet = useCallback(() => {
    setPlayerProfile(prev => {
      if (!prev || prev.isWalletConnected) return prev;
      setTimeout(() => {
        toast({ title: "Wallet Connected!", description: `You've received ${AURON_PER_WALLET_CONNECT} Auron bonus and unlocked the Ark Hangar!` });
      }, 0);
      return {
        ...prev,
        isWalletConnected: true,
        auron: prev.auron + AURON_PER_WALLET_CONNECT,
      };
    });
  }, [toast]);

  const baseTapPower = POINTS_PER_TAP;
  const tapPowerUpgradeLevel = getUpgradeLevel('tapPower');
  const pointsPerTapValue = baseTapPower + tapPowerUpgradeLevel;

  const critChanceUpgradeLevel = getUpgradeLevel('critChance');
  const criticalTapChance = critChanceUpgradeLevel * 0.005; 

  const critMultiplierUpgradeLevel = getUpgradeLevel('critMultiplier');
  const criticalTapMultiplier = 1 + (critMultiplierUpgradeLevel * 0.1); 

  const comboBonusUpgradeLevel = getUpgradeLevel('comboBonus');
  const comboMultiplierValue = 1 + (comboBonusUpgradeLevel * 0.02) + (comboCount * 0.01);

  const handleTap = useCallback(() => {
    setPlayerProfile(prev => {
        if (!prev) return null;

        let updatedProfile = {...prev};
        let pointsToEarn = pointsPerTapValue; 
        const isCritical = Math.random() < criticalTapChance;
        
        let finalAmount = pointsToEarn; 
        let currentActiveTapBonuses = [...(updatedProfile.activeTapBonuses || [])];
  
        if (currentActiveTapBonuses.length > 0) { 
          let totalBonusMultiplierFactor = 0; 
  
          currentActiveTapBonuses = currentActiveTapBonuses.map(bonus => {
            totalBonusMultiplierFactor += (bonus.bonusMultiplier - 1);
            return { ...bonus, remainingTaps: bonus.remainingTaps - 1 };
          }).filter(bonus => bonus.remainingTaps > 0);
          
          finalAmount = finalAmount * (1 + totalBonusMultiplierFactor); 
  
          (updatedProfile.activeTapBonuses || []).forEach(oldBonus => {
              if (!currentActiveTapBonuses.find(b => b.id === oldBonus.id)) {
                  setTimeout(() => {
                      toast({ title: "Bonus Expired", description: `${oldBonus.name} has worn off.` });
                  }, 0);
              }
          });
          updatedProfile.activeTapBonuses = currentActiveTapBonuses;
        }
        
        if (isCritical) {
            finalAmount *= criticalTapMultiplier; 
            setTimeout(() => {
                 toast({ title: "Critical Tap!", description: `+${Math.round(finalAmount * comboMultiplierValue)} points!`, duration: 1500 });
            },0);
        }

        finalAmount *= comboMultiplierValue; 
        finalAmount = Math.round(finalAmount);

        updatedProfile.totalTapsForUniform = (updatedProfile.totalTapsForUniform || 0) + 1;
        let newEquippedUniformPieces = [...(updatedProfile.equippedUniformPieces || [])];
        const currentlyEquippedCount = newEquippedUniformPieces.length;
        const targetEquippedCount = Math.floor(updatedProfile.totalTapsForUniform / TAPS_PER_UNIFORM_PIECE);

        if (targetEquippedCount > currentlyEquippedCount && currentlyEquippedCount < UNIFORM_PIECES_ORDER.length) {
            const newPiece = UNIFORM_PIECES_ORDER[currentlyEquippedCount];
            newEquippedUniformPieces.push(newPiece);
            setTimeout(() => {
                toast({ title: "Uniform Piece Unlocked!", description: `Acquired: ${newPiece}`});
                addCoreMessage({ type: 'system_alert', content: `Commander, your combat readiness has increased. New gear acquired: ${newPiece}.` });
            }, 0);
        }
        updatedProfile.equippedUniformPieces = newEquippedUniformPieces;
        
        updatedProfile.points += finalAmount;
        updatedProfile.seasonProgress[currentSeason.id] = (updatedProfile.seasonProgress[currentSeason.id] || 0) + finalAmount;
        
        let newXp = updatedProfile.xp + finalAmount; 
        while (newXp >= updatedProfile.xpToNextLevel) {
          newXp -= updatedProfile.xpToNextLevel;
          updatedProfile.level++;
          updatedProfile.xpToNextLevel = Math.floor(updatedProfile.xpToNextLevel * XP_LEVEL_MULTIPLIER);
          updatedProfile.rankTitle = getRankTitle(updatedProfile.level);
          const levelUpMessage = `Congratulations Commander, you've reached Level ${updatedProfile.level} - ${updatedProfile.rankTitle}!`;
          setTimeout(() => {
              toast({ title: "Rank Up!", description: levelUpMessage });
          }, 0);
        }
        updatedProfile.xp = newXp;

        // Update quest progress
        updatedProfile = updateQuestProgress(updatedProfile, 'taps', 1);
        updatedProfile = updateQuestProgress(updatedProfile, 'points_earned', finalAmount);

        return updatedProfile;
    });

    setComboCount(prevCount => prevCount + 1);
    setTimeout(() => setComboCount(0), 3000); 

  }, [pointsPerTapValue, criticalTapChance, criticalTapMultiplier, comboMultiplierValue, toast, addCoreMessage, currentSeason.id, updateQuestProgress]);

  const switchCommanderSex = useCallback(() => {
    setPlayerProfile(prev => {
      if (!prev) return null;
      const newSex = prev.commanderSex === 'male' ? 'female' : 'male';
      setTimeout(() => {
        toast({ title: "Commander Profile Updated", description: `Switched to ${newSex === 'male' ? 'Male' : 'Female'} Commander.` });
      }, 0);
      return {
        ...prev,
        commanderSex: newSex,
      };
    });
  }, [toast]);

  const claimQuestReward = useCallback((questId: string) => {
    setPlayerProfile(prev => {
        if (!prev) return null;
        const questIndex = prev.activeDailyQuests.findIndex(q => q.id === questId);
        if (questIndex === -1) return prev;

        const quest = prev.activeDailyQuests[questIndex];
        if (!quest.isCompleted || quest.isClaimed) return prev;

        let updatedProfile = { ...prev };
        if (quest.reward.points) {
            updatedProfile.points += quest.reward.points;
        }
        if (quest.reward.auron) {
            updatedProfile.auron += quest.reward.auron;
        }

        const updatedQuests = [...updatedProfile.activeDailyQuests];
        updatedQuests[questIndex] = { ...quest, isClaimed: true };
        updatedProfile.activeDailyQuests = updatedQuests;
        
        setTimeout(() => {
            toast({ title: "Quest Reward Claimed!", description: `You received rewards for: ${quest.title}` });
        }, 0);
        
        return updatedProfile;
    });
  }, [toast]);

  // AI Interactions
  useEffect(() => {
    if (isInitialSetupDone && playerProfile && isCoreUnlocked && !isAICallInProgress && Date.now() - coreLastInteractionTime > 300000) { // 5 minutes
      setIsAICallInProgress(true);
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
          if (progressUpdate.loreSnippet) { 
            addCoreMessage({ type: 'lore_snippet', content: progressUpdate.loreSnippet });
          }
          
          if(playerProfile.lastLoginTimestamp) {
            const timeAwayMinutes = Math.floor((Date.now() - playerProfile.lastLoginTimestamp) / 60000);
            if (timeAwayMinutes > 5) { 
                const resourcesGained = playerProfile.muleDrones * MULE_DRONE_BASE_RATE * timeAwayMinutes;
                if (resourcesGained > 0) addPoints(resourcesGained);
                
                const loreSnippetInput = {
                    timeAway: timeAwayMinutes,
                    resourcesGained,
                };
                const loreSnippet = await getCoreLoreSnippet(loreSnippetInput);
                 if (loreSnippet.snippet) { 
                    addCoreMessage({ type: 'lore_snippet', content: loreSnippet.snippet });
                 }
            }
          }
          setPlayerProfile(p => p ? {...p, lastLoginTimestamp: Date.now()} : null);
        } catch (error: any) {
          console.error("C.O.R.E. API Error:", error);
          let errorMessage = "C.O.R.E. systems experiencing interference. Stand by, Commander.";
          const errorString = error.message ? error.message.toLowerCase() : (error.toString ? error.toString().toLowerCase() : "");

           if (errorString.includes("503") || errorString.includes("service unavailable") || errorString.includes("overloaded")) {
            errorMessage = "C.O.R.E. uplink temporarily disrupted due to high traffic. Systems recalibrating. Please stand by, Commander.";
          } else if (errorString.includes("429") || errorString.includes("too many requests")) {
            errorMessage = "C.O.R.E. communication channels are currently saturated. Please allow a moment for recalibration, Commander.";
          }
          addCoreMessage({ type: 'system_alert', content: errorMessage });
        } finally {
            setCoreLastInteractionTime(Date.now()); 
            setIsAICallInProgress(false);
        }
      })();
    }
  }, [isInitialSetupDone, playerProfile, currentSeason, isCoreUnlocked, coreLastInteractionTime, addCoreMessage, getUpgradeCost, addPoints, isAICallInProgress]);


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
        connectWallet,
        handleTap,
        criticalTapChance,
        criticalTapMultiplier,
        comboMultiplier: comboMultiplierValue,
        comboCount,
        setComboCount,
        marketplaceItems: MARKETPLACE_ITEMS_DATA,
        purchaseMarketplaceItem,
        switchCommanderSex,
        claimQuestReward,
        refreshDailyQuestsIfNeeded,
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
