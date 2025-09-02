
"use client";

import type { PlayerProfile, Season, Upgrade, ArkUpgrade, CoreMessage, MarketplaceItem, ActiveTapBonus, DailyQuest, QuestType, LeagueName, BattlePass, BattlePassReward, RewardType, CommanderOrder } from '@/lib/types';
import { SEASONS_DATA, UPGRADES_DATA, ARK_UPGRADES_DATA, MARKETPLACE_ITEMS_DATA, DAILY_QUESTS_POOL, INITIAL_XP_TO_NEXT_LEVEL, XP_LEVEL_MULTIPLIER, getRankTitle, POINTS_PER_TAP, AURON_PER_WALLET_CONNECT, MULE_DRONE_BASE_RATE, INITIAL_MAX_TAPS, TAP_REGEN_COOLDOWN_MINUTES, AURON_COST_FOR_TAP_REFILL, getTierColorByLevel, INITIAL_TIER_COLOR, DEFAULT_LEAGUE, getLeagueByPoints, BATTLE_PASS_DATA, BATTLE_PASS_XP_PER_LEVEL, REWARDED_AD_AURON_REWARD, REWARDED_AD_COOLDOWN_MINUTES } from '@/lib/gameData';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getCoreBriefing } from '@/ai/flows/core-briefings';
import { getCoreLoreSnippet } from '@/ai/flows/core-lore-snippets';
import { getCoreProgressUpdate } from '@/ai/flows/core-progress-updates';

const TAPS_PER_UNIFORM_PIECE = 2000;
const UNIFORM_PIECES_ORDER = ["Tactical Gloves", "Combat Boots", "Utility Belt", "Chest Rig", "Stealth Helmet"];
const NUMBER_OF_DAILY_QUESTS = 3;
const TAP_REGEN_COOLDOWN_MILLISECONDS = TAP_REGEN_COOLDOWN_MINUTES * 60 * 1000;
const COMMANDER_ORDER_COOLDOWN_HOURS = 1;
const REWARDED_AD_COOLDOWN_MILLISECONDS = REWARDED_AD_COOLDOWN_MINUTES * 60 * 1000;


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
  addPoints: (amount: number, isFromTap?: boolean) => void;
  isLoading: boolean;
  isInitialSetupDone: boolean;
  completeInitialSetup: (name: string, sex: 'male' | 'female', country: string, referredByCode?: string) => void;
  coreMessages: CoreMessage[];
  addCoreMessage: (message: Omit<CoreMessage, 'timestamp'>, isHighPriority?: boolean) => void;
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
  refillTaps: () => void;
  // Battle Pass
  battlePassData: BattlePass;
  purchasePremiumPass: () => void;
  claimBattlePassReward: (level: number, track: 'free' | 'premium') => void;
  // Commander Order
  activeCommanderOrder: CommanderOrder | null;
  claimCommanderOrderReward: () => void;
  hideCommanderOrder: () => void;
  // Rewarded Ad
  watchRewardedAd: () => void;
  rewardedAdCooldown: number;
  isWatchingAd: boolean;
  // Music
  isMusicPlaying: boolean;
  toggleMusic: () => void;
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
  referralCode: undefined,
  referredByCode: undefined,
  currentTaps: INITIAL_MAX_TAPS,
  maxTaps: INITIAL_MAX_TAPS,
  tapsAvailableAt: Date.now(),
  currentTierColor: INITIAL_TIER_COLOR,
  league: DEFAULT_LEAGUE,
  // Battle Pass
  battlePassLevel: 1,
  battlePassXp: 0,
  xpToNextBattlePassLevel: BATTLE_PASS_XP_PER_LEVEL,
  hasPremiumPass: false,
  claimedBattlePassRewards: {},
  // Commander Order
  activeCommanderOrder: null,
  lastCommanderOrderTimestamp: 0,
  // Rewarded Ad
  lastRewardedAdTimestamp: 0,
  isMusicPlaying: false,
};

const generateReferralCode = (name: string): string => {
  const namePart = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${namePart}${randomPart || 'ABCDE'}`;
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
  const [activeCommanderOrder, setActiveCommanderOrder] = useState<CommanderOrder | null>(null);
  const [rewardedAdCooldown, setRewardedAdCooldown] = useState(0);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);


  const { toast } = useToast();

  const addCoreMessage = useCallback((message: Omit<CoreMessage, 'timestamp'>, isHighPriority: boolean = false) => {
    const newMessage = { ...message, timestamp: Date.now() };
    setCoreMessages(prev => [newMessage, ...prev.slice(0, 49)]); // Keep a log of last 50 messages
    if(isHighPriority) {
        toast({ title: message.type.replace('_', ' ').toUpperCase(), description: message.content});
    }
  }, [toast]);

  // Rewarded Ad Cooldown Timer
  useEffect(() => {
    if (!playerProfile) return;

    const updateCooldown = () => {
      const now = Date.now();
      const lastAdTime = playerProfile.lastRewardedAdTimestamp || 0;
      const timeSinceLastAd = now - lastAdTime;
      const newCooldown = Math.max(0, REWARDED_AD_COOLDOWN_MILLISECONDS - timeSinceLastAd);
      setRewardedAdCooldown(newCooldown);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [playerProfile]);
  

  // Handle Commander Order logic
  useEffect(() => {
    if (!playerProfile || !isInitialSetupDone) return;

    const now = Date.now();
    const lastOrderTimestamp = playerProfile.activeCommanderOrder?.startTime ?? playerProfile.lastCommanderOrderTimestamp;
    const cooldown = COMMANDER_ORDER_COOLDOWN_HOURS * 60 * 60 * 1000;

    // Check if current order is expired
    if (playerProfile.activeCommanderOrder && now > playerProfile.activeCommanderOrder.endTime) {
      addCoreMessage({ type: 'system_alert', content: "Commander, you've run out of time to complete the special order." }, true);
      setPlayerProfile(prev => {
        if (!prev) return null;
        return { ...prev, activeCommanderOrder: null, lastCommanderOrderTimestamp: now };
      });
      setActiveCommanderOrder(null);
    }
    // Check if it's time for a new order
    else if (!playerProfile.activeCommanderOrder && now - lastOrderTimestamp > cooldown) {
      const newOrder: CommanderOrder = {
        id: `order-${now}`,
        objectiveType: 'points',
        target: 3000 * playerProfile.level, // Scale with player level
        reward: { auron: 20 + Math.floor(playerProfile.level / 5) }, // Scale with player level
        startTime: now,
        endTime: now + (2 * 24 * 60 * 60 * 1000), // 2 days from now
        progress: 0,
        isCompleted: false,
      };
      setPlayerProfile(prev => prev ? { ...prev, activeCommanderOrder: newOrder } : null);
      setActiveCommanderOrder(newOrder);
      addCoreMessage({ type: 'briefing', content: `New special order received! Acquire ${newOrder.target.toLocaleString()} points.`}, true);
    } else {
        // Sync state if it's different
        if (playerProfile.activeCommanderOrder !== activeCommanderOrder) {
            setActiveCommanderOrder(playerProfile.activeCommanderOrder);
        }
    }
  }, [playerProfile, isInitialSetupDone, addCoreMessage, activeCommanderOrder]);
  
  const claimCommanderOrderReward = useCallback(() => {
    setPlayerProfile(prev => {
      if (!prev || !prev.activeCommanderOrder || !prev.activeCommanderOrder.isCompleted) {
        return prev;
      }
      
      const order = prev.activeCommanderOrder;
      
      addCoreMessage({
        type: 'system_alert',
        content: `Excellent work, Commander. You've earned a reward of ${order.reward.auron} Auron.`
      }, true);

      return {
        ...prev,
        auron: prev.auron + (order.reward.auron || 0),
        points: prev.points + (order.reward.points || 0),
        activeCommanderOrder: null,
        lastCommanderOrderTimestamp: Date.now(),
      };
    });
  }, [addCoreMessage]);

  const hideCommanderOrder = useCallback(() => {
    setPlayerProfile(prev => {
        if (!prev) return null;
        // Sets the order to null, effectively dismissing it until the next cooldown cycle.
        return {
            ...prev,
            activeCommanderOrder: null,
            lastCommanderOrderTimestamp: Date.now(),
        }
    });
  }, []);

  const updateQuestProgress = useCallback((profile: PlayerProfile, type: QuestType, value: number): PlayerProfile => {
    if (!profile.activeDailyQuests) return profile;

    const updatedQuests = profile.activeDailyQuests.map(quest => {
      if (quest.type === type && !quest.isClaimed && !quest.isCompleted) {
        const newProgress = quest.progress + value;
        const isCompleted = newProgress >= quest.target;
        if (isCompleted && !quest.isCompleted) {
            addCoreMessage({ type: 'system_alert', content: `Quest Objective Met: ${quest.title}`});
        }
        return { ...quest, progress: Math.min(newProgress, quest.target), isCompleted };
      }
      return quest;
    });

    let updatedOrder = profile.activeCommanderOrder;
    if (updatedOrder && !updatedOrder.isCompleted && type === updatedOrder.objectiveType) {
        const newProgress = updatedOrder.progress + value;
        const isCompleted = newProgress >= updatedOrder.target;
        if (isCompleted) {
            addCoreMessage({ type: 'system_alert', content: "Special Order Objective Met! Report back to claim your reward, Commander."});
        }
        updatedOrder = { ...updatedOrder, progress: newProgress, isCompleted };
    }


    return { ...profile, activeDailyQuests: updatedQuests, activeCommanderOrder: updatedOrder };
  }, [addCoreMessage]);

  const refreshDailyQuestsIfNeeded = useCallback(() => {
    let shouldToast = false;
    setPlayerProfile(prev => {
        if (!prev) return null;

        const now = new Date();
        const lastRefreshDate = new Date(prev.lastDailyQuestRefresh);
        const isNewDay = now.getFullYear() > lastRefreshDate.getFullYear() ||
                         now.getMonth() > lastRefreshDate.getMonth() ||
                         now.getDate() > lastRefreshDate.getDate();

        if (!isNewDay && prev.activeDailyQuests && prev.activeDailyQuests.length > 0) {
            return prev;
        }

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
        shouldToast = true;
        return { ...prev, activeDailyQuests: newQuests, lastDailyQuestRefresh: now.getTime() };
    });

    if (shouldToast) {
       setTimeout(() => {
          addCoreMessage({ type: 'system_alert', content: 'Daily Quest objectives refreshed. New challenges await.'}, true);
        }, 500);
    }
  }, [addCoreMessage]);

  useEffect(() => {
    const savedProfile = localStorage.getItem('playerProfile');
    if (savedProfile) {
      let parsedProfile = JSON.parse(savedProfile) as PlayerProfile;
      let offlineEarnings = 0;

      // Initialize new fields for backward compatibility
      parsedProfile.country = parsedProfile.country ?? ''; // Handle country
      parsedProfile.lastLoginTimestamp = parsedProfile.lastLoginTimestamp ?? Date.now();
      parsedProfile.muleDrones = parsedProfile.upgrades['muleDrone'] || 0; // Sync muleDrones with upgrade level

      // Calculate offline earnings
      const now = Date.now();
      const timeAwayInMinutes = Math.floor((now - parsedProfile.lastLoginTimestamp) / 60000);
      let pointsGained = 0;
      if (timeAwayInMinutes > 1 && parsedProfile.muleDrones > 0) {
        pointsGained = Math.floor(parsedProfile.muleDrones * MULE_DRONE_BASE_RATE * timeAwayInMinutes);
        if (pointsGained > 0) {
          parsedProfile.points += pointsGained;
          offlineEarnings = pointsGained;
        }
      }
      parsedProfile.lastLoginTimestamp = now; // Update timestamp for the current session
      
      if (offlineEarnings > 0) {
        addCoreMessage({ type: 'system_alert', content: `Welcome back, Commander. Your M.U.L.E. Drones generated ${offlineEarnings.toLocaleString()} points while you were away.`}, true);
      }


      // Standard initializations
      parsedProfile.maxTaps = parsedProfile.maxTaps ?? INITIAL_MAX_TAPS;
      parsedProfile.currentTaps = parsedProfile.currentTaps ?? parsedProfile.maxTaps;
      parsedProfile.tapsAvailableAt = parsedProfile.tapsAvailableAt ?? Date.now();
      parsedProfile.activeTapBonuses = parsedProfile.activeTapBonuses ?? [];
      parsedProfile.totalTapsForUniform = parsedProfile.totalTapsForUniform ?? 0;
      parsedProfile.equippedUniformPieces = parsedProfile.equippedUniformPieces ?? [];
      
      parsedProfile.activeDailyQuests = parsedProfile.activeDailyQuests ?? [];
      if (parsedProfile.activeDailyQuests) {
        parsedProfile.activeDailyQuests = parsedProfile.activeDailyQuests.map(q => {
          const template = DAILY_QUESTS_POOL.find(t => t.templateId === q.templateId);
          return { ...q, icon: template ? template.icon : undefined };
        });
      }
      
      parsedProfile.lastDailyQuestRefresh = parsedProfile.lastDailyQuestRefresh ?? 0;
      parsedProfile.referralCode = parsedProfile.referralCode ?? undefined;
      parsedProfile.referredByCode = parsedProfile.referredByCode ?? undefined;
      parsedProfile.currentTierColor = parsedProfile.currentTierColor ?? getTierColorByLevel(parsedProfile.level);
      parsedProfile.league = parsedProfile.league ?? getLeagueByPoints(parsedProfile.points);
      
      // Battle Pass initialization
      parsedProfile.battlePassLevel = parsedProfile.battlePassLevel ?? 1;
      parsedProfile.battlePassXp = parsedProfile.battlePassXp ?? 0;
      parsedProfile.xpToNextBattlePassLevel = parsedProfile.xpToNextBattlePassLevel ?? BATTLE_PASS_XP_PER_LEVEL;
      parsedProfile.hasPremiumPass = parsedProfile.hasPremiumPass ?? false;
      parsedProfile.claimedBattlePassRewards = parsedProfile.claimedBattlePassRewards ?? {};
      
      // Commander Order initialization
      parsedProfile.activeCommanderOrder = parsedProfile.activeCommanderOrder ?? null;
      parsedProfile.lastCommanderOrderTimestamp = parsedProfile.lastCommanderOrderTimestamp ?? 0;
      setActiveCommanderOrder(parsedProfile.activeCommanderOrder);
      
      // Rewarded Ad initialization
      parsedProfile.lastRewardedAdTimestamp = parsedProfile.lastRewardedAdTimestamp ?? 0;
      
      // Music State
      parsedProfile.isMusicPlaying = parsedProfile.isMusicPlaying ?? false;
      setIsMusicPlaying(parsedProfile.isMusicPlaying);


      setPlayerProfile(parsedProfile);
      setIsInitialSetupDone(true);
      const season = SEASONS_DATA.find(s => s.id === parsedProfile.currentSeasonId) || SEASONS_DATA[0];
      setCurrentSeason(season);
      setIsCoreUnlocked(!!parsedProfile.upgrades['coreUnlocked'] || SEASONS_DATA.slice(0, SEASONS_DATA.indexOf(season)).some(s => s.unlocksCore));
      setCoreLastInteractionTime(parsedProfile.lastLoginTimestamp || Date.now());
    } else {
        setIsLoading(false);
    }
    const savedCoreMessages = localStorage.getItem('coreMessages');
    if (savedCoreMessages) {
        setCoreMessages(JSON.parse(savedCoreMessages));
    }
  }, []);

  useEffect(() => {
    if (playerProfile && isInitialSetupDone) {
      refreshDailyQuestsIfNeeded();
    }
    const localSavedProfile = typeof window !== "undefined" ? localStorage.getItem('playerProfile') : null;
    if (!localSavedProfile && !isLoading) {
        setIsLoading(false);
    } else if (localSavedProfile) {
        setIsLoading(false);
    }
  }, [playerProfile, isInitialSetupDone, refreshDailyQuestsIfNeeded, isLoading]);


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

  const completeInitialSetup = (name: string, sex: 'male' | 'female', country: string, referredByCode?: string) => {
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
      lastDailyQuestRefresh: 0,
      activeDailyQuests: [],
      referralCode: generateReferralCode(name),
      referredByCode: referredByCode?.trim() || undefined,
      maxTaps: INITIAL_MAX_TAPS,
      currentTaps: INITIAL_MAX_TAPS,
      tapsAvailableAt: now,
      currentTierColor: getTierColorByLevel(1),
      league: DEFAULT_LEAGUE,
      activeTapBonuses: [],
      // Battle Pass
      battlePassLevel: 1,
      battlePassXp: 0,
      xpToNextBattlePassLevel: BATTLE_PASS_XP_PER_LEVEL,
      hasPremiumPass: false,
      claimedBattlePassRewards: {},
      // Commander Order
      activeCommanderOrder: null,
      lastCommanderOrderTimestamp: 0,
       // Rewarded Ad
      lastRewardedAdTimestamp: 0,
      // Music
      isMusicPlaying: false,
    };
    setPlayerProfile(newProfileData);
    setIsInitialSetupDone(true);
    setCurrentSeason(SEASONS_DATA[0]);
    let welcomeMessage = `Welcome, Commander ${name}! Your mission begins now. Your unique referral code is ${newProfileData.referralCode}. Share it with allies!`;
    if (referredByCode) {
        welcomeMessage += ` We acknowledge Commander ${referredByCode} for recruiting you.`
    }
    addCoreMessage({ type: 'briefing', content: welcomeMessage});
    setCoreLastInteractionTime(now);
  };

  const addPoints = useCallback((amount: number, isFromTap: boolean = false) => {
    let levelUpOccurred = false;
    let newLevel = 0;
    
    setPlayerProfile(prev => {
      if (!prev) return null;

      let finalAmount = amount;
      let updatedProfile = { ...prev };
      
      let expiredBonuses: ActiveTapBonus[] = [];

      if (isFromTap && updatedProfile.activeTapBonuses && updatedProfile.activeTapBonuses.length > 0) {
        let totalBonusMultiplierFactor = 0; 
        let stillActiveBonuses = updatedProfile.activeTapBonuses.map(bonus => {
          totalBonusMultiplierFactor += (bonus.bonusMultiplier - 1);
          return { ...bonus, remainingTaps: bonus.remainingTaps - 1 };
        }).filter(bonus => bonus.remainingTaps > 0);

        
        finalAmount = amount * (1 + totalBonusMultiplierFactor);

        updatedProfile.activeTapBonuses.forEach(oldBonus => {
            if (!stillActiveBonuses.find(b => b.id === oldBonus.id)) {
                expiredBonuses.push(oldBonus);
            }
        });
        updatedProfile.activeTapBonuses = stillActiveBonuses;
      }
      
      if (expiredBonuses.length > 0) {
        expiredBonuses.forEach(b => {
            addCoreMessage({ type: 'system_alert', content: `Power boost from ${b.name} has expired.` });
        });
      }

      finalAmount = Math.round(finalAmount);

      updatedProfile.points += finalAmount;
      updatedProfile.seasonProgress[currentSeason.id] = (updatedProfile.seasonProgress[currentSeason.id] || 0) + finalAmount;

      let newXp = updatedProfile.xp + finalAmount;
      let levelChanged = false;
      let tempLevel = updatedProfile.level;

      while (newXp >= updatedProfile.xpToNextLevel) {
        newXp -= updatedProfile.xpToNextLevel;
        tempLevel++;
        levelChanged = true;
        updatedProfile.xpToNextLevel = Math.floor(updatedProfile.xpToNextLevel * XP_LEVEL_MULTIPLIER);
        updatedProfile.rankTitle = getRankTitle(tempLevel);
      }
      
      if (levelChanged) {
          updatedProfile.level = tempLevel;
          levelUpOccurred = true;
          newLevel = tempLevel;
      }

      updatedProfile.xp = newXp;
      if (levelChanged) {
        updatedProfile.currentTierColor = getTierColorByLevel(updatedProfile.level);
      }
      
      const previousLeague = updatedProfile.league;
      const newLeague = getLeagueByPoints(updatedProfile.points);
      if (newLeague !== previousLeague) {
        updatedProfile.league = newLeague;
        addCoreMessage({ type: 'system_alert', content: `Promotion! You've reached the ${newLeague} league.` }, true);
      }

      updatedProfile = updateQuestProgress(updatedProfile, 'points_earned', finalAmount);

      // Battle Pass XP Gain
      let newBattlePassXp = updatedProfile.battlePassXp + finalAmount; // 1 point = 1 BP XP for simplicity
      let bpLevelledUp = false;
      let tempBpLevel = updatedProfile.battlePassLevel;
      while(newBattlePassXp >= updatedProfile.xpToNextBattlePassLevel) {
        newBattlePassXp -= updatedProfile.xpToNextBattlePassLevel;
        tempBpLevel++;
        bpLevelledUp = true;
      }
      updatedProfile.battlePassXp = newBattlePassXp;
      if (bpLevelledUp) {
          updatedProfile.battlePassLevel = tempBpLevel;
          addCoreMessage({ type: 'system_alert', content: `Battle Pass Level Up! Reached Level ${updatedProfile.battlePassLevel}.` }, true);
      }


      return updatedProfile;
    });

    if (levelUpOccurred) {
        toast({
            title: 'Level Up!',
            description: `Congrats Commander! You passed to level ${newLevel}.`,
        });
    }
  }, [currentSeason, addCoreMessage, updateQuestProgress, toast]);


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
    const upgradeInfo = UPGRADES_DATA.find(u => u.id === upgradeId);
    if (!upgradeInfo) return;
    
    let canAfford = false;
    let isMaxLevel = false;
    let success = false;

    setPlayerProfile(prev => {
      if (!prev) return null;
      const cost = getUpgradeCost(upgradeId);
      const currentLevel = prev.upgrades[upgradeId] || 0;
      
      canAfford = prev.points >= cost;
      isMaxLevel = !!(upgradeInfo.maxLevel && currentLevel >= upgradeInfo.maxLevel);

      if (!canAfford || isMaxLevel) {
        return prev;
      }
      success = true;
      let updatedProfile = {
        ...prev,
        points: prev.points - cost,
        upgrades: {
          ...prev.upgrades,
          [upgradeId]: currentLevel + 1,
        }
      };

      if (upgradeId === 'muleDrone') {
        updatedProfile.muleDrones = (updatedProfile.upgrades[upgradeId] || 0);
      }

      return updateQuestProgress(updatedProfile, 'purchase_upgrade', 1);
    });

    if (success) {
      addCoreMessage({ type: 'system_alert', content: `Upgrade complete: ${upgradeInfo.name}.`});
    } else if (isMaxLevel) {
        toast({ title: "Max Level Reached", description: `${upgradeInfo.name} is already at its maximum level.`, variant: "default" });
    } else {
        toast({ title: "Insufficient Points", description: "Not enough points to purchase this upgrade.", variant: "destructive" });
    }
  }, [getUpgradeCost, toast, updateQuestProgress, addCoreMessage]);

  const getArkUpgradeById = useCallback((upgradeId: string) => {
    return ARK_UPGRADES_DATA.find(u => u.id === upgradeId);
  }, []);

  const purchaseArkUpgrade = useCallback((upgradeId: string) => {
    const arkUpgrade = ARK_UPGRADES_DATA.find(u => u.id === upgradeId);
    if (!arkUpgrade) return;

    let success = false;
    let alreadyPurchased = false;
    let insufficientPoints = false;
    
    setPlayerProfile(prev => {
        if (!prev) return null;

        if (prev.upgrades[upgradeId]) {
            alreadyPurchased = true;
            return prev;
        }

        if (prev.points < arkUpgrade.cost) {
            insufficientPoints = true;
            return prev;
        }

        success = true;
        const newUpgrades = { ...prev.upgrades, [upgradeId]: 1 };
        const allArkUpgradesPurchased = ARK_UPGRADES_DATA.every(u => newUpgrades[u.id]);
        
        let updatedProfile = {
            ...prev,
            points: prev.points - arkUpgrade.cost,
            upgrades: newUpgrades,
            arkHangarFullyUpgraded: allArkUpgradesPurchased,
        };
        return updateQuestProgress(updatedProfile, 'purchase_upgrade', 1);
    });

    if (success) {
      addCoreMessage({ type: 'system_alert', content: `Ark upgrade installed: ${arkUpgrade.name}.` });
    } else if (alreadyPurchased) {
      toast({ title: "Upgrade Invalid", description: "This Ark upgrade is already purchased or does not exist.", variant: "default" });
    } else if (insufficientPoints) {
      toast({ title: "Insufficient Points", description: "Not enough points for this Ark upgrade.", variant: "destructive" });
    }
  }, [toast, updateQuestProgress, addCoreMessage]);

  const purchaseMarketplaceItem = useCallback((itemId: string) => {
    const item = MARKETPLACE_ITEMS_DATA.find(i => i.id === itemId);
    if (!item) {
        toast({ title: "Item not found", variant: "destructive" });
        return;
    }

    let success = false;
    let insufficientAuron = false;

    setPlayerProfile(prev => {
        if (!prev) return null;

        if (prev.auron < item.costInAuron) {
            insufficientAuron = true;
            return prev;
        }
        success = true;
        const newBonus: ActiveTapBonus = {
            id: crypto.randomUUID(), 
            marketItemId: item.id,
            name: item.name,
            remainingTaps: item.bonusEffect.durationTaps,
            bonusMultiplier: item.bonusEffect.multiplier,
            originalDurationTaps: item.bonusEffect.durationTaps,
        };

        let updatedProfile = {
            ...prev,
            auron: prev.auron - item.costInAuron,
            activeTapBonuses: [...(prev.activeTapBonuses || []), newBonus],
        };
        return updateQuestProgress(updatedProfile, 'spend_auron', item.costInAuron);
    });

    if (success) {
      addCoreMessage({ type: 'system_alert', content: `${item.name} activated.` });
    } else if (insufficientAuron) {
       toast({ title: "Insufficient Auron", description: `You need ${item.costInAuron} Auron to purchase ${item.name}.`, variant: "destructive" });
    }
  }, [toast, updateQuestProgress, addCoreMessage]);

  const connectWallet = useCallback(() => {
    setPlayerProfile(prev => {
      if (!prev || prev.isWalletConnected) return prev;
      return {
        ...prev,
        isWalletConnected: true,
        auron: prev.auron + AURON_PER_WALLET_CONNECT,
      };
    });
    addCoreMessage({ type: 'system_alert', content: `Wallet Connected! Received ${AURON_PER_WALLET_CONNECT} Auron bonus and unlocked the Ark Hangar.` }, true);
  }, [addCoreMessage]);

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
    let wasTapped = false;
    let isCritical = false;
    let isOutOfTaps = false;
    let newPiece = '';

    setPlayerProfile(prev => {
        if (!prev) return null;
        
        let updatedProfile = {...prev};
        const now = Date.now();

        if (updatedProfile.currentTaps === 0 && now >= updatedProfile.tapsAvailableAt) {
            updatedProfile.currentTaps = updatedProfile.maxTaps;
            updatedProfile.tapsAvailableAt = now;
            addCoreMessage({ type: 'system_alert', content: "Tap energy recharged." });
        }

        if (updatedProfile.currentTaps <= 0) {
            isOutOfTaps = true;
            return updatedProfile;
        }
        
        wasTapped = true;
        updatedProfile.currentTaps--;
        if (updatedProfile.currentTaps === 0) {
            updatedProfile.tapsAvailableAt = now + TAP_REGEN_COOLDOWN_MILLISECONDS;
        }

        let basePointsForTap = pointsPerTapValue;
        isCritical = Math.random() < criticalTapChance;

        if (isCritical) {
            basePointsForTap *= criticalTapMultiplier;
        }

        basePointsForTap *= comboMultiplierValue;
        basePointsForTap = Math.round(basePointsForTap);

        addPoints(basePointsForTap, true); 

        updatedProfile.totalTapsForUniform = (updatedProfile.totalTapsForUniform || 0) + 1;
        let newEquippedUniformPieces = [...(updatedProfile.equippedUniformPieces || [])];
        const currentlyEquippedCount = newEquippedUniformPieces.length;
        const targetEquippedCount = Math.floor(updatedProfile.totalTapsForUniform / TAPS_PER_UNIFORM_PIECE);

        if (targetEquippedCount > currentlyEquippedCount && currentlyEquippedCount < UNIFORM_PIECES_ORDER.length) {
            const piece = UNIFORM_PIECES_ORDER[currentlyEquippedCount];
            newEquippedUniformPieces.push(piece);
            newPiece = piece;
        }
        updatedProfile.equippedUniformPieces = newEquippedUniformPieces;
        
        return updateQuestProgress(updatedProfile, 'taps', 1);
    });

    setComboCount(prevCount => prevCount + 1);
    setTimeout(() => setComboCount(0), 3000);

    if (isOutOfTaps && playerProfile) {
        const timeLeft = Math.ceil((playerProfile.tapsAvailableAt - Date.now()) / 1000);
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        addCoreMessage({ type: 'system_alert', content: `Out of Taps! Regeneration in ${minutes}m ${seconds}s.` });
    }
    
    if(isCritical) {
        addCoreMessage({ type: 'system_alert', content: `Critical Tap! Power amplified.` });
    }

    if(newPiece) {
        addCoreMessage({ type: 'system_alert', content: `New gear acquired: ${newPiece}.` }, true);
    }

  }, [pointsPerTapValue, criticalTapChance, criticalTapMultiplier, comboMultiplierValue, addCoreMessage, updateQuestProgress, addPoints, playerProfile]);


  const switchCommanderSex = useCallback(() => {
    setPlayerProfile(prev => {
      if (!prev) return null;
      const newSex = prev.commanderSex === 'male' ? 'female' : 'male';
      addCoreMessage({ type: 'system_alert', content: `Commander profile switched to ${newSex}.` });
       return { ...prev, commanderSex: newSex };
    });
  }, [addCoreMessage]);

  const claimQuestReward = useCallback((questId: string) => {
    let claimedQuest: DailyQuest | null = null;
    let success = false;

    setPlayerProfile(prev => {
        if (!prev) return null;
        const questIndex = prev.activeDailyQuests.findIndex(q => q.id === questId);
        if (questIndex === -1) return prev;

        const quest = prev.activeDailyQuests[questIndex];
        if (!quest.isCompleted || quest.isClaimed) return prev;
        
        claimedQuest = quest;
        success = true;
        let updatedProfile = { ...prev };
        if (quest.reward.points) {
            updatedProfile.points += quest.reward.points;
            const previousLeague = updatedProfile.league;
            const newLeague = getLeagueByPoints(updatedProfile.points);
            if (newLeague !== previousLeague) {
              updatedProfile.league = newLeague;
              addCoreMessage({ type: 'system_alert', content: `Promotion! You've reached the ${newLeague} league.` }, true);
            }
        }
        if (quest.reward.auron) {
            updatedProfile.auron += quest.reward.auron;
        }

        const updatedQuests = [...updatedProfile.activeDailyQuests];
        updatedQuests[questIndex] = { ...quest, isClaimed: true };
        updatedProfile.activeDailyQuests = updatedQuests;

        return updatedProfile;
    });

    if (success && claimedQuest) {
        addCoreMessage({ type: 'system_alert', content: `Reward claimed for quest: ${claimedQuest.title}.` });
    }
  }, [addCoreMessage]);

  const refillTaps = useCallback(() => {
    let success = false;
    let insufficientAuron = false;

    setPlayerProfile(prev => {
        if (!prev) return null;
        if (prev.auron < AURON_COST_FOR_TAP_REFILL) {
            insufficientAuron = true;
            return prev;
        }
        success = true;
        let updatedProfile = {
            ...prev,
            auron: prev.auron - AURON_COST_FOR_TAP_REFILL,
            currentTaps: prev.maxTaps,
            tapsAvailableAt: Date.now(),
        };
        return updateQuestProgress(updatedProfile, 'spend_auron', AURON_COST_FOR_TAP_REFILL);
    });

    if (success) {
        addCoreMessage({ type: 'system_alert', content: `Tap energy restored for ${AURON_COST_FOR_TAP_REFILL} Auron.` });
    } else if (insufficientAuron) {
        toast({ title: "Insufficient Auron", description: `You need ${AURON_COST_FOR_TAP_REFILL} Auron to refill taps.`, variant: "destructive" });
    }
  }, [toast, updateQuestProgress, addCoreMessage]);


  useEffect(() => {
    if (isInitialSetupDone && playerProfile && isCoreUnlocked && !isAICallInProgress && Date.now() - coreLastInteractionTime > 300000) {
      setIsAICallInProgress(true);
      (async () => {
        try {
          const briefingInput = {
            season: currentSeason.title,
            playerProgress: `Level ${playerProfile.level}, League: ${playerProfile.league}, Objective Progress: ${playerProfile.seasonProgress[currentSeason.id] || 0}`,
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
          setPlayerProfile(p => p ? {...p, lastLoginTimestamp: Date.now(), currentTierColor: getTierColorByLevel(p.level), league: getLeagueByPoints(p.points) } : null);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialSetupDone, playerProfile, currentSeason.id, isCoreUnlocked, coreLastInteractionTime, addCoreMessage, getUpgradeCost, addPoints, isAICallInProgress]);

  const purchasePremiumPass = useCallback(() => {
    let canAfford = false;
    let alreadyHas = false;
    let success = false;

    setPlayerProfile(prev => {
        if (!prev) return null;
        if (prev.hasPremiumPass) {
            alreadyHas = true;
            return prev;
        }
        if (prev.auron < BATTLE_PASS_DATA.premiumCostInAuron) {
            canAfford = false;
            return prev;
        }
        success = true;
        canAfford = true;
        return {
            ...prev,
            auron: prev.auron - BATTLE_PASS_DATA.premiumCostInAuron,
            hasPremiumPass: true,
        };
    });

    if(alreadyHas) {
        toast({ title: 'Already Unlocked', description: 'You already have the Premium Battle Pass.' });
    } else if (!canAfford) {
        toast({ title: 'Insufficient Auron', description: `You need ${BATTLE_PASS_DATA.premiumCostInAuron} Auron to unlock the premium pass.`, variant: 'destructive' });
    } else if (success) {
        addCoreMessage({ type: 'system_alert', content: 'Premium Battle Pass unlocked! Access to premium rewards granted.' }, true);
    }
  }, [toast, addCoreMessage]);

  const claimBattlePassReward = useCallback((level: number, track: 'free' | 'premium') => {
    let rewardToClaim: BattlePassReward | null = null;
    let result = 'fail'; // 'fail', 'claimed', 'not_reached', 'premium_locked', 'success'

    setPlayerProfile(prev => {
      if (!prev) return null;
      
      const rewardLevel = BATTLE_PASS_DATA.levels.find(l => l.level === level);
      if (!rewardLevel) { result='fail'; return prev; }

      const reward = track === 'free' ? rewardLevel.freeReward : rewardLevel.premiumReward;
      if (!reward) { result='fail'; return prev; }

      if (prev.claimedBattlePassRewards[level]?.includes(track)) {
        result='claimed';
        return prev;
      }

      if (prev.battlePassLevel < level) {
         result='not_reached';
         return prev;
      }
      
      if (track === 'premium' && !prev.hasPremiumPass) {
        result='premium_locked';
        return prev;
      }

      result = 'success';
      rewardToClaim = reward;
      let updatedProfile = { ...prev };

      switch (reward.type) {
        case 'points':
          updatedProfile.points += reward.amount || 0;
          break;
        case 'auron':
          updatedProfile.auron += reward.amount || 0;
          break;
        case 'uniform_piece':
           if (reward.name && !updatedProfile.equippedUniformPieces.includes(reward.name)) {
             updatedProfile.equippedUniformPieces.push(reward.name);
           }
          break;
        case 'title':
          updatedProfile.rankTitle = reward.name || updatedProfile.rankTitle;
          break;
      }

      const claimedForLevel = updatedProfile.claimedBattlePassRewards[level] || [];
      updatedProfile.claimedBattlePassRewards = {
        ...updatedProfile.claimedBattlePassRewards,
        [level]: [...claimedForLevel, track],
      };
      
      return updatedProfile;
    });

    if (result === 'success' && rewardToClaim) {
        addCoreMessage({ type: 'system_alert', content: `Battle Pass reward claimed: ${rewardToClaim?.amount || ''} ${rewardToClaim?.name || rewardToClaim?.type}` });
    } else if (result === 'claimed') {
        toast({ title: 'Reward Already Claimed', variant: 'default' });
    } else if (result === 'not_reached') {
        toast({ title: 'Level Not Reached', description: `You must reach level ${level} to claim this reward.`, variant: 'destructive' });
    } else if (result === 'premium_locked') {
        toast({ title: 'Premium Pass Required', description: 'Unlock the premium pass to claim this reward.', variant: 'destructive' });
    }
  }, [toast, addCoreMessage]);

  const watchRewardedAd = useCallback(() => {
    if (rewardedAdCooldown > 0 || isWatchingAd) return;

    setIsWatchingAd(true);
    // Simulate watching an ad for 3 seconds
    setTimeout(() => {
      setPlayerProfile(prev => {
        if (!prev) return null;
        
        addCoreMessage({ type: 'system_alert', content: `Broadcast complete. You received ${REWARDED_AD_AURON_REWARD} Auron.` }, true);

        return {
          ...prev,
          auron: prev.auron + REWARDED_AD_AURON_REWARD,
          lastRewardedAdTimestamp: Date.now()
        };
      });
      setIsWatchingAd(false);
    }, 3000);
  }, [rewardedAdCooldown, isWatchingAd, addCoreMessage]);

  const toggleMusic = useCallback(() => {
    setPlayerProfile(prev => {
      if (!prev) return null;
      setIsMusicPlaying(!prev.isMusicPlaying);
      return { ...prev, isMusicPlaying: !prev.isMusicPlaying };
    });
  }, []);

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
        refillTaps,
        battlePassData: BATTLE_PASS_DATA,
        purchasePremiumPass,
        claimBattlePassReward,
        activeCommanderOrder,
        claimCommanderOrderReward,
        hideCommanderOrder,
        watchRewardedAd,
        rewardedAdCooldown,
        isWatchingAd,
        isMusicPlaying,
        toggleMusic,
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
