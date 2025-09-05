
"use client";

import type { PlayerProfile, Season, Upgrade, ArkUpgrade, CoreMessage, MarketplaceItem, ActiveTapBonus, DailyQuest, QuestType, LeagueName, BattlePass, BattlePassReward, RewardType, CommanderOrder } from '@/lib/types';
import { SEASONS_DATA, UPGRADES_DATA, ARK_UPGRADES_DATA, MARKETPLACE_ITEMS_DATA, DAILY_QUESTS_POOL, INITIAL_XP_TO_NEXT_LEVEL, XP_LEVEL_MULTIPLIER, getRankTitle, POINTS_PER_TAP, AURON_PER_WALLET_CONNECT, MULE_DRONE_BASE_RATE, INITIAL_MAX_TAPS, TAP_REGEN_COOLDOWN_MINUTES, AURON_COST_FOR_TAP_REFILL, getTierColorByLevel, INITIAL_TIER_COLOR, DEFAULT_LEAGUE, getLeagueByPoints, BATTLE_PASS_DATA, BATTLE_PASS_XP_PER_LEVEL, REWARDED_AD_AURON_REWARD, REWARDED_AD_COOLDOWN_MINUTES, UNIFORM_PIECES_ORDER, TAPS_PER_UNIFORM_PIECE } from '@/lib/gameData';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getCoreBriefing } from '@/ai/flows/core-briefings';
import { getCoreLoreSnippet } from '@/ai/flows/core-lore-snippets';
import { getCoreProgressUpdate } from '@/ai/flows/core-progress-updates';
import { syncPlayerProfileInFirestore } from '@/lib/firestore'; // Import the new Firestore function

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
  completeInitialSetup: (name: string, sex: 'male' | 'female', avatarUrl: string, country: string, referredByCode?: string) => void;
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
  // Profile editing
  updatePlayerProfile: (name: string, avatarUrl: string, commanderSex: 'male' | 'female') => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const defaultPlayerProfile: Omit<PlayerProfile, 'id' | 'name' | 'commanderSex' | 'avatarUrl' | 'country' | 'currentSeasonId'> = {
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
  
  // This effect runs once on component mount on the client side.
  // It's responsible for loading all data from localStorage and setting the initial game state.
  useEffect(() => {
    let savedProfile: string | null = null;
    let timeoutId: NodeJS.Timeout;

    try {
        savedProfile = localStorage.getItem('playerProfile');
    } catch (e) {
        console.error("Could not access localStorage. Starting fresh.", e);
    }
  
    if (savedProfile) {
        let parsedProfile = JSON.parse(savedProfile) as PlayerProfile;
        
        // ---- OFFLINE PROGRESS ----
        const now = Date.now();
        const lastLogin = parsedProfile.lastLoginTimestamp ?? now;
        const timeAwayInMinutes = Math.floor((now - lastLogin) / 60000);
        let offlineEarnings = 0;
        
        if (timeAwayInMinutes > 1 && parsedProfile.muleDrones > 0) {
            offlineEarnings = Math.floor(parsedProfile.muleDrones * MULE_DRONE_BASE_RATE * timeAwayInMinutes);
            if (offlineEarnings > 0) {
                parsedProfile.points += offlineEarnings;
            }
        }
        parsedProfile.lastLoginTimestamp = now;

        // ---- MESSAGES ----
        const savedMessages = localStorage.getItem('coreMessages');
        let currentMessages = savedMessages ? JSON.parse(savedMessages) : [];
        if (offlineEarnings > 0) {
            const offlineMessage: CoreMessage = { type: 'system_alert', content: `Welcome back, Commander. Your M.U.L.E. Drones generated ${offlineEarnings.toLocaleString()} points while you were away.`, timestamp: Date.now() };
            currentMessages = [offlineMessage, ...currentMessages.slice(0, 49)];
        }
        setCoreMessages(currentMessages);
        
        // --- PROFILE HYDRATION & DEFAULTS ---
        const hydratedProfile: PlayerProfile = {
            ...defaultPlayerProfile,
            ...parsedProfile,
            lastLoginTimestamp: now,
            muleDrones: parsedProfile.upgrades?.['muleDrone'] || 0,
            activeDailyQuests: (parsedProfile.activeDailyQuests ?? []).map(q => {
                const template = DAILY_QUESTS_POOL.find(t => t.templateId === q.templateId);
                return { ...q, icon: template?.icon };
            }),
            league: getLeagueByPoints(parsedProfile.points),
            currentTierColor: getTierColorByLevel(parsedProfile.level),
        };
        
        setPlayerProfile(hydratedProfile);
        setIsMusicPlaying(hydratedProfile.isMusicPlaying);
        setActiveCommanderOrder(hydratedProfile.activeCommanderOrder);
        
        const season = SEASONS_DATA.find(s => s.id === hydratedProfile.currentSeasonId) || SEASONS_DATA[0];
        setCurrentSeason(season);
        
        const coreUnlocked = !!hydratedProfile.upgrades['coreUnlocked'] || SEASONS_DATA.slice(0, SEASONS_DATA.indexOf(season)).some(s => s.unlocksCore);
        setIsCoreUnlocked(coreUnlocked);
        setCoreLastInteractionTime(now);
        setIsInitialSetupDone(true);
        setIsLoading(false);
    } else {
        setIsInitialSetupDone(false);
         // Fallback to ensure loading screen doesn't get stuck
        timeoutId = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2 seconds timeout
    }

    return () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };
  }, []);


  useEffect(() => {
    // This effect handles saving the player profile to localStorage whenever it changes.
    if (playerProfile && isInitialSetupDone) {
      localStorage.setItem('playerProfile', JSON.stringify(playerProfile));
      
      const profileForFirestore = {
        ...playerProfile,
        activeDailyQuests: playerProfile.activeDailyQuests.map(({ icon, ...rest }) => rest), // Remove icon for Firestore
      };
      syncPlayerProfileInFirestore(profileForFirestore);
    }
  }, [playerProfile, isInitialSetupDone]);

  useEffect(() => {
    // This effect handles saving core messages to localStorage.
    if (isInitialSetupDone) {
      localStorage.setItem('coreMessages', JSON.stringify(coreMessages));
    }
  }, [coreMessages, isInitialSetupDone]);

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

  const addPoints = useCallback((amount: number, isFromTap: boolean = false) => {
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

      while (newXp >= updatedProfile.xpToNextLevel) {
        newXp -= updatedProfile.xpToNextLevel;
        updatedProfile.level++;
        levelChanged = true;
        updatedProfile.xpToNextLevel = Math.floor(updatedProfile.xpToNextLevel * XP_LEVEL_MULTIPLIER);
        updatedProfile.rankTitle = getRankTitle(updatedProfile.level);
      }
      
      updatedProfile.xp = newXp;
      if (levelChanged) {
        updatedProfile.currentTierColor = getTierColorByLevel(updatedProfile.level);
        toast({
            title: 'Level Up!',
            description: `Congrats Commander! You passed to level ${updatedProfile.level}.`,
        });
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
      while(newBattlePassXp >= updatedProfile.xpToNextBattlePassLevel) {
        newBattlePassXp -= updatedProfile.xpToNextBattlePassLevel;
        updatedProfile.battlePassLevel++;
        bpLevelledUp = true;
      }
      updatedProfile.battlePassXp = newBattlePassXp;
      if (bpLevelledUp) {
          addCoreMessage({ type: 'system_alert', content: `Battle Pass Level Up! Reached Level ${updatedProfile.battlePassLevel}.` }, true);
      }

      return updatedProfile;
    });
  }, [currentSeason.id, addCoreMessage, updateQuestProgress, toast]);


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
    
    setPlayerProfile(prev => {
      if (!prev) return null;
      const cost = getUpgradeCost(upgradeId);
      const currentLevel = prev.upgrades[upgradeId] || 0;
      
      if(prev.points < cost) {
        toast({ title: "Insufficient Points", description: "Not enough points to purchase this upgrade.", variant: "destructive" });
        return prev;
      }
      if(upgradeInfo.maxLevel && currentLevel >= upgradeInfo.maxLevel) {
        toast({ title: "Max Level Reached", description: `${upgradeInfo.name} is already at its maximum level.`, variant: "default" });
        return prev;
      }
      
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
      
      addCoreMessage({ type: 'system_alert', content: `Upgrade complete: ${upgradeInfo.name}.`});
      return updateQuestProgress(updatedProfile, 'purchase_upgrade', 1);
    });
  }, [getUpgradeCost, toast, updateQuestProgress, addCoreMessage]);

  const purchaseArkUpgrade = useCallback((upgradeId: string) => {
    const arkUpgrade = ARK_UPGRADES_DATA.find(u => u.id === upgradeId);
    if (!arkUpgrade) return;

    setPlayerProfile(prev => {
        if (!prev) return null;

        if (prev.upgrades[upgradeId]) {
            toast({ title: "Upgrade Invalid", description: "This Ark upgrade is already purchased or does not exist.", variant: "default" });
            return prev;
        }

        if (prev.points < arkUpgrade.cost) {
            toast({ title: "Insufficient Points", description: "Not enough points for this Ark upgrade.", variant: "destructive" });
            return prev;
        }

        const newUpgrades = { ...prev.upgrades, [upgradeId]: 1 };
        const allArkUpgradesPurchased = ARK_UPGRADES_DATA.every(u => newUpgrades[u.id]);
        
        let updatedProfile = {
            ...prev,
            points: prev.points - arkUpgrade.cost,
            upgrades: newUpgrades,
            arkHangarFullyUpgraded: allArkUpgradesPurchased,
        };
        addCoreMessage({ type: 'system_alert', content: `Ark upgrade installed: ${arkUpgrade.name}.` });
        return updateQuestProgress(updatedProfile, 'purchase_upgrade', 1);
    });
  }, [toast, updateQuestProgress, addCoreMessage]);

  const purchaseMarketplaceItem = useCallback((itemId: string) => {
    const item = MARKETPLACE_ITEMS_DATA.find(i => i.id === itemId);
    if (!item) {
        toast({ title: "Item not found", variant: "destructive" });
        return;
    }

    setPlayerProfile(prev => {
        if (!prev) return null;

        if (prev.auron < item.costInAuron) {
            toast({ title: "Insufficient Auron", description: `You need ${item.costInAuron} Auron to purchase ${item.name}.`, variant: "destructive" });
            return prev;
        }

        const newBonus: ActiveTapBonus = {
            id: `${Date.now()}-${Math.random()}`, 
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
        addCoreMessage({ type: 'system_alert', content: `${item.name} activated.` });
        return updateQuestProgress(updatedProfile, 'spend_auron', item.costInAuron);
    });
  }, [toast, updateQuestProgress, addCoreMessage]);

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
    let isCritical = false;
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
            const timeLeft = Math.ceil((prev.tapsAvailableAt - Date.now()) / 1000);
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            addCoreMessage({ type: 'system_alert', content: `Out of Taps! Regeneration in ${minutes}m ${seconds}s.` });
            return updatedProfile;
        }
        
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
        
        const finalAmount = Math.round(basePointsForTap);
        
        let profileAfterPoints = { ...updatedProfile, points: updatedProfile.points + finalAmount };
        profileAfterPoints.seasonProgress[currentSeason.id] = (profileAfterPoints.seasonProgress[currentSeason.id] || 0) + finalAmount;

        let newXp = profileAfterPoints.xp + finalAmount;
        let levelChanged = false;
        while (newXp >= profileAfterPoints.xpToNextLevel) {
            newXp -= profileAfterPoints.xpToNextLevel;
            profileAfterPoints.level++;
            levelChanged = true;
            profileAfterPoints.xpToNextLevel = Math.floor(profileAfterPoints.xpToNextLevel * XP_LEVEL_MULTIPLIER);
            profileAfterPoints.rankTitle = getRankTitle(profileAfterPoints.level);
        }
        profileAfterPoints.xp = newXp;
        if (levelChanged) {
            profileAfterPoints.currentTierColor = getTierColorByLevel(profileAfterPoints.level);
            toast({ title: 'Level Up!', description: `Congrats Commander! You passed to level ${profileAfterPoints.level}.` });
        }

        const previousLeague = profileAfterPoints.league;
        const newLeague = getLeagueByPoints(profileAfterPoints.points);
        if (newLeague !== previousLeague) {
            profileAfterPoints.league = newLeague;
            addCoreMessage({ type: 'system_alert', content: `Promotion! You've reached the ${newLeague} league.` }, true);
        }

        let newBattlePassXp = profileAfterPoints.battlePassXp + finalAmount;
        let bpLevelledUp = false;
        while(newBattlePassXp >= profileAfterPoints.xpToNextBattlePassLevel) {
            newBattlePassXp -= profileAfterPoints.xpToNextBattlePassLevel;
            profileAfterPoints.battlePassLevel++;
            bpLevelledUp = true;
        }
        profileAfterPoints.battlePassXp = newBattlePassXp;
        if (bpLevelledUp) {
            addCoreMessage({ type: 'system_alert', content: `Battle Pass Level Up! Reached Level ${profileAfterPoints.battlePassLevel}.` }, true);
        }

        profileAfterPoints.totalTapsForUniform = (profileAfterPoints.totalTapsForUniform || 0) + 1;
        let newEquippedUniformPieces = [...(profileAfterPoints.equippedUniformPieces || [])];
        const currentlyEquippedCount = newEquippedUniformPieces.length;
        const targetEquippedCount = Math.floor(profileAfterPoints.totalTapsForUniform / TAPS_PER_UNIFORM_PIECE);

        if (targetEquippedCount > currentlyEquippedCount && currentlyEquippedCount < UNIFORM_PIECES_ORDER.length) {
            const piece = UNIFORM_PIECES_ORDER[currentlyEquippedCount];
            newEquippedUniformPieces.push(piece);
            newPiece = piece;
        }
        profileAfterPoints.equippedUniformPieces = newEquippedUniformPieces;
        
        let profileAfterTapQuests = updateQuestProgress(profileAfterPoints, 'taps', 1);
        profileAfterTapQuests = updateQuestProgress(profileAfterTapQuests, 'points_earned', finalAmount);


        if (isCritical) {
            addCoreMessage({ type: 'system_alert', content: `Critical Tap! Power amplified.` });
        }
        if(newPiece) {
            addCoreMessage({ type: 'system_alert', content: `New gear acquired: ${newPiece}.` }, true);
        }

        return profileAfterTapQuests;
    });

    setComboCount(prevCount => prevCount + 1);
    setTimeout(() => setComboCount(0), 3000);

  }, [pointsPerTapValue, criticalTapChance, criticalTapMultiplier, comboMultiplierValue, addCoreMessage, updateQuestProgress, toast, currentSeason.id, setPlayerProfile, setComboCount]);

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
        
        addCoreMessage({ type: 'system_alert', content: `Reward claimed for quest: ${quest.title}.` });
        return updatedProfile;
    });
  }, [addCoreMessage]);

  const refreshDailyQuestsIfNeeded = useCallback(() => {
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
                newQuests.push({
                    id: `${template.templateId}-${now.getTime()}`,
                    templateId: template.templateId,
                    title: template.title,
                    description: template.description,
                    type: template.type,
                    target: template.target,
                    progress: template.type === 'login' ? template.target : 0,
                    reward: { ...template.reward },
                    isCompleted: template.type === 'login',
                    isClaimed: false,
                    icon: template.icon,
                });
                usedTemplateIds.add(template.templateId);
            }
        }
        addCoreMessage({ type: 'system_alert', content: 'Daily Quest objectives refreshed. New challenges await.'}, true);
        return { ...prev, activeDailyQuests: newQuests, lastDailyQuestRefresh: now.getTime() };
    });
  }, [addCoreMessage]);

  const completeInitialSetup = useCallback((name: string, sex: 'male' | 'female', avatarUrl: string, country: string, referredByCode?: string) => {
    const now = Date.now();
    const newProfileData: PlayerProfile = {
      ...defaultPlayerProfile,
      id: `${now}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      commanderSex: sex,
      avatarUrl,
      country,
      currentSeasonId: SEASONS_DATA[0].id,
      lastLoginTimestamp: now,
      referralCode: generateReferralCode(name),
      referredByCode: referredByCode?.trim() || undefined,
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
    refreshDailyQuestsIfNeeded();
  }, [addCoreMessage, refreshDailyQuestsIfNeeded]);

  const refillTaps = useCallback(() => {
    setPlayerProfile(prev => {
        if (!prev) return null;
        if (prev.auron < AURON_COST_FOR_TAP_REFILL) {
            toast({ title: "Insufficient Auron", description: `You need ${AURON_COST_FOR_TAP_REFILL} Auron to refill taps.`, variant: "destructive" });
            return prev;
        }
        
        let updatedProfile = {
            ...prev,
            auron: prev.auron - AURON_COST_FOR_TAP_REFILL,
            currentTaps: prev.maxTaps,
            tapsAvailableAt: Date.now(),
        };
        addCoreMessage({ type: 'system_alert', content: `Tap energy restored for ${AURON_COST_FOR_TAP_REFILL} Auron.` });
        return updateQuestProgress(updatedProfile, 'spend_auron', AURON_COST_FOR_TAP_REFILL);
    });
  }, [toast, updateQuestProgress, addCoreMessage]);
  
  const connectWallet = useCallback(() => {
    setPlayerProfile(prev => {
      if (!prev || prev.isWalletConnected) return prev;
      addCoreMessage({ type: 'system_alert', content: `Wallet Connected! Received ${AURON_PER_WALLET_CONNECT} Auron bonus and unlocked the Ark Hangar.` }, true);
      return {
        ...prev,
        isWalletConnected: true,
        auron: prev.auron + AURON_PER_WALLET_CONNECT,
      };
    });
  }, [addCoreMessage]);
  
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
        return { ...prev, activeCommanderOrder: null, lastCommanderOrderTimestamp: Date.now() };
    });
  }, []);

  const purchasePremiumPass = useCallback(() => {
    setPlayerProfile(prev => {
        if (!prev) return null;
        if (prev.hasPremiumPass) {
            toast({ title: 'Already Unlocked', description: 'You already have the Premium Battle Pass.' });
            return prev;
        }
        if (prev.auron < BATTLE_PASS_DATA.premiumCostInAuron) {
            toast({ title: 'Insufficient Auron', description: `You need ${BATTLE_PASS_DATA.premiumCostInAuron} Auron to unlock the premium pass.`, variant: 'destructive' });
            return prev;
        }
        addCoreMessage({ type: 'system_alert', content: 'Premium Battle Pass unlocked! Access to premium rewards granted.' }, true);
        return {
            ...prev,
            auron: prev.auron - BATTLE_PASS_DATA.premiumCostInAuron,
            hasPremiumPass: true,
        };
    });
  }, [toast, addCoreMessage]);

  const claimBattlePassReward = useCallback((level: number, track: 'free' | 'premium') => {
    setPlayerProfile(prev => {
      if (!prev) return null;
      
      const rewardLevel = BATTLE_PASS_DATA.levels.find(l => l.level === level);
      if (!rewardLevel) { return prev; }

      const reward = track === 'free' ? rewardLevel.freeReward : rewardLevel.premiumReward;
      if (!reward) { return prev; }

      if (prev.claimedBattlePassRewards[level]?.includes(track)) {
        toast({ title: 'Reward Already Claimed', variant: 'default' });
        return prev;
      }
      if (prev.battlePassLevel < level) {
         toast({ title: 'Level Not Reached', description: `You must reach level ${level} to claim this reward.`, variant: 'destructive' });
         return prev;
      }
      if (track === 'premium' && !prev.hasPremiumPass) {
        toast({ title: 'Premium Pass Required', description: 'Unlock the premium pass to claim this reward.', variant: 'destructive' });
        return prev;
      }

      let updatedProfile = { ...prev };

      switch (reward.type) {
        case 'points': updatedProfile.points += reward.amount || 0; break;
        case 'auron': updatedProfile.auron += reward.amount || 0; break;
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
      
      addCoreMessage({ type: 'system_alert', content: `Battle Pass reward claimed: ${reward?.amount || ''} ${reward?.name || reward?.type}` });
      return updatedProfile;
    });
  }, [toast, addCoreMessage]);

  const watchRewardedAd = useCallback(() => {
    if (rewardedAdCooldown > 0 || isWatchingAd) return;

    setIsWatchingAd(true);
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
      const newIsMusicPlaying = !prev.isMusicPlaying;
      setIsMusicPlaying(newIsMusicPlaying);
      return { ...prev, isMusicPlaying: newIsMusicPlaying };
    });
  }, []);
  
  const updatePlayerProfile = useCallback((name: string, avatarUrl: string, commanderSex: 'male' | 'female') => {
    setPlayerProfile(prev => {
      if (!prev) return null;
      return { ...prev, name, avatarUrl, commanderSex };
    });
    addCoreMessage({type: 'system_alert', content: 'Player profile updated.'});
    toast({title: 'Profile Updated', description: 'Your callsign and avatar have been updated.'});
  }, [addCoreMessage, toast]);
  
  const getArkUpgradeById = useCallback((upgradeId: string) => {
    return ARK_UPGRADES_DATA.find(u => u.id === upgradeId);
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
        updatePlayerProfile,
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
