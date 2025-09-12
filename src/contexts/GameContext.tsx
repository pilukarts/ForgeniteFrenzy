
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import type { PlayerProfile, Season, Upgrade, ArkUpgrade, CoreMessage, MarketplaceItem, ActiveTapBonus, DailyQuest, QuestType, LeagueName, BattlePass, BattlePassReward, RewardType, SelectableAvatar } from '@/lib/types';
import { SEASONS_DATA, UPGRADES_DATA, ARK_UPGRADES_DATA, MARKETPLACE_ITEMS_DATA, DAILY_QUESTS_POOL, INITIAL_XP_TO_NEXT_LEVEL, XP_LEVEL_MULTIPLIER, getRankTitle, POINTS_PER_TAP, AURON_PER_WALLET_CONNECT, MULE_DRONE_BASE_RATE, INITIAL_MAX_TAPS, TAP_REGEN_COOLDOWN_MILLISECONDS, AURON_COST_FOR_TAP_REFILL, getTierColorByLevel, INITIAL_TIER_COLOR, DEFAULT_LEAGUE, getLeagueByPoints, BATTLE_PASS_DATA, BATTLE_PASS_XP_PER_LEVEL, REWARDED_AD_AURON_REWARD, REWARDED_AD_COOLDOWN_MILLISECONDS, SELECTABLE_AVATARS, AF_LOGO_TAP_BONUS_MULTIPLIER } from '@/lib/gameData';
import { useToast } from '@/hooks/use-toast';
import { getCoreBriefing } from '@/ai/flows/core-briefings';
import { getCoreLoreSnippet } from '@/ai/flows/core-lore-snippets';
import { getCoreProgressUpdate } from '@/ai/flows/core-progress-updates';
import { syncPlayerProfileInFirestore } from '@/lib/firestore';

// --- Constants ---
export const NUMBER_OF_DAILY_QUESTS = 3;

// --- Context Type Definition ---
export interface GameContextType {
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
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isInitialSetupDone: boolean;
  setIsInitialSetupDone: React.Dispatch<React.SetStateAction<boolean>>;
  completeInitialSetup: (name: string, commanderSex: 'male' | 'female', country: string, referredByCode?: string) => void;
  coreMessages: CoreMessage[];
  addCoreMessage: (message: Omit<CoreMessage, 'timestamp'>) => void;
  isCoreUnlocked: boolean;
  setIsCoreUnlocked: React.Dispatch<React.SetStateAction<boolean>>;
  coreLastInteractionTime: number;
  setCoreLastInteractionTime: React.Dispatch<React.SetStateAction<number>>;
  connectWallet: () => void;
  handleTap: (isLogoTap?: boolean) => void;
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
  battlePassData: BattlePass;
  purchasePremiumPass: () => void;
  claimBattlePassReward: (level: number, track: 'free' | 'premium') => void;
  watchRewardedAd: () => void;
  rewardedAdCooldown: number;
  setRewardedAdCooldown: React.Dispatch<React.SetStateAction<number>>;
  isWatchingAd: boolean;
  updatePlayerProfile: (name: string, selectedPortraitUrl: string) => void;
  toggleCommander: () => void;
  resetGame: () => void;
  toggleMusic: () => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  isTelegramEnv: boolean;
  setIsTelegramEnv: React.Dispatch<React.SetStateAction<boolean>>;
  connectTelegramWallet: () => void;
  purchaseWithTelegramWallet: (pkg: { amount: number; price: number }) => void;
}

// --- Context Creation ---
export const GameContext = createContext<GameContextType | undefined>(undefined);

// --- Default Profile ---
export const defaultPlayerProfile: Omit<PlayerProfile, 'id' | 'name' | 'commanderSex' | 'avatarUrl' | 'portraitUrl' | 'country' | 'currentSeasonId'> = {
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
  activeDailyQuests: [],
  lastDailyQuestRefresh: 0,
  referralCode: '',
  referredByCode: '',
  currentTaps: INITIAL_MAX_TAPS,
  maxTaps: INITIAL_MAX_TAPS,
  tapsAvailableAt: Date.now(),
  currentTierColor: INITIAL_TIER_COLOR,
  league: DEFAULT_LEAGUE,
  battlePassLevel: 1,
  battlePassXp: 0,
  xpToNextBattlePassLevel: BATTLE_PASS_XP_PER_LEVEL,
  hasPremiumPass: false,
  claimedBattlePassRewards: {},
  lastRewardedAdTimestamp: 0,
  isTelegramWalletConnected: false,
};

// --- Helper Functions ---
export const generateReferralCode = (name: string): string => {
  const namePart = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${namePart}${randomPart || 'ABCDE'}`;
};

// --- Provider Component ---
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialSetupDone, setIsInitialSetupDone] = useState(false);
  const [currentSeason, setCurrentSeason] = useState<Season>(SEASONS_DATA[0]);
  const [coreMessages, setCoreMessages] = useState<CoreMessage[]>([]);
  const [isCoreUnlocked, setIsCoreUnlocked] = useState(false);
  const [coreLastInteractionTime, setCoreLastInteractionTime] = useState<number>(0);
  const [comboCount, setComboCount] = useState(0);
  const [rewardedAdCooldown, setRewardedAdCooldown] = useState(0);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isTelegramEnv, setIsTelegramEnv] = useState(false);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const tapSoundRef = useRef<HTMLAudioElement | null>(null);

  const { toast } = useToast();
  
  // Game Initialization Logic, moved here from AppLayout
  useEffect(() => {
    // This effect should only run on the client
    if (typeof window === 'undefined') {
        return;
    }

    let savedProfile: string | null = null;
    try {
        savedProfile = localStorage.getItem('playerProfile');
    } catch (e) {
        console.error("Could not access localStorage. Starting fresh.", e);
    }

    if (savedProfile) {
        let parsedProfile = JSON.parse(savedProfile) as PlayerProfile;

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

        const hydratedProfile: PlayerProfile = {
            ...defaultPlayerProfile,
            ...parsedProfile,
            lastLoginTimestamp: now,
            league: getLeagueByPoints(parsedProfile.points),
            currentTierColor: getTierColorByLevel(parsedProfile.level),
        };

        setPlayerProfile(hydratedProfile);
        const season = SEASONS_DATA.find(s => s.id === hydratedProfile.currentSeasonId) || SEASONS_DATA[0];
        const coreUnlocked = !!hydratedProfile.upgrades['coreUnlocked'] || SEASONS_DATA.slice(0, SEASONS_DATA.indexOf(season)).some(s => s.unlocksCore);
        
        setCoreMessages(prev => {
            if (offlineEarnings > 0) {
                const welcomeBackMessage = { type: 'system_alert', content: `Welcome back, Commander. Your M.U.L.E. Drones generated ${offlineEarnings.toLocaleString()} points while you were away.`, timestamp: Date.now() };
                return [welcomeBackMessage, ...prev.slice(0, 49)];
            }
            return prev;
        });

        setIsCoreUnlocked(coreUnlocked);
        setCoreLastInteractionTime(now);
        setIsInitialSetupDone(true);
    } else {
        setIsInitialSetupDone(false);
    }

    // Crucially, set loading to false AFTER attempting to load or setting up for initial creation
    setIsLoading(false);

    // Telegram Env check
    import('@twa-dev/sdk').then(twa => {
        if (twa.default.platform !== 'unknown') {
            setIsTelegramEnv(true);
        }
    }).catch(err => console.log("Not in Telegram environment or SDK failed to load."));
  }, []); // Empty dependency array ensures this runs only once on mount

  const addCoreMessage = useCallback((message: Omit<CoreMessage, 'timestamp'>) => {
    const newMessage = { ...message, timestamp: Date.now() };
    setCoreMessages(prev => [newMessage, ...prev.slice(0, 49)]); // Keep a log of last 50 messages
  }, []);
  
  const toggleMusic = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!musicRef.current) {
        try {
            const backgroundMusicUrl = 'https://firebasestorage.googleapis.com/v0/b/genkit-90196.appspot.com/o/sci-fi-background-music.mp3?alt=media&token=e16f39e3-80ae-432e-9d22-48a5717651a9';
            musicRef.current = new Audio(backgroundMusicUrl);
            musicRef.current.loop = true;
        } catch (e) {
            console.error("Could not create Audio element.", e);
            return;
        }
    }
    if (isMusicPlaying) {
        musicRef.current.pause();
    } else {
        musicRef.current.play().catch(error => {
            if (error.name === 'NotAllowedError') {
                toast({ title: 'Autoplay Blocked', description: 'Click anywhere to enable music.'});
            } else {
                console.error("Error playing music:", error);
            }
        });
    }
    setIsMusicPlaying(!isMusicPlaying);
  }, [isMusicPlaying, toast]);

  
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

    return { ...profile, activeDailyQuests: updatedQuests };
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
        addCoreMessage({ type: 'system_alert', content: `Promotion! You've reached the ${newLeague} league.` });
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
          addCoreMessage({ type: 'system_alert', content: `Battle Pass Level Up! Reached Level ${updatedProfile.battlePassLevel}.` });
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

  const handleTap = useCallback((isLogoTap: boolean = false) => {
    if (typeof window === 'undefined') return;

    if (!tapSoundRef.current) {
        try {
            const tapSoundUrl = 'https://firebasestorage.googleapis.com/v0/b/genkit-90196.appspot.com/o/sci-fi-blip.mp3?alt=media&token=c2323214-e598-4847-8147-3f36098c414d';
            tapSoundRef.current = new Audio(tapSoundUrl);
        } catch (e) {
            console.error("Could not create tap sound Audio element.", e);
        }
    }
    
    if (tapSoundRef.current) {
        tapSoundRef.current.play().catch(e => console.error("Error playing tap sound:", e));
    }
    
    setPlayerProfile(prev => {
      if (!prev) return null;
      
      let updatedProfile = { ...prev };

      if (updatedProfile.currentTaps <= 0) {
          const now = Date.now();
          if (now >= updatedProfile.tapsAvailableAt) {
              updatedProfile.currentTaps = updatedProfile.maxTaps;
          } else {
              return prev; // Still in cooldown
          }
      }

      // Consume a tap
      updatedProfile.currentTaps--;
      if (updatedProfile.currentTaps === 0) {
          updatedProfile.tapsAvailableAt = Date.now() + TAP_REGEN_COOLDOWN_MILLISECONDS;
      }
      
      // Calculate points for this tap, to be passed to addPoints
      let basePointsForTap = pointsPerTapValue;

      if (isLogoTap) {
          basePointsForTap *= AF_LOGO_TAP_BONUS_MULTIPLIER;
      }
      
      let isCritical = Math.random() < criticalTapChance;

      if (isCritical) {
          basePointsForTap *= criticalTapMultiplier;
      }
      basePointsForTap *= comboMultiplierValue;
      const finalAmount = Math.round(basePointsForTap);

      // We need to manage the profile state update within this single setPlayerProfile call
      // to avoid race conditions from using addPoints (which also calls setPlayerProfile).
      // So, let's replicate the logic of addPoints here.

      let finalPoints = finalAmount;
      let expiredBonuses: ActiveTapBonus[] = [];

      if (updatedProfile.activeTapBonuses && updatedProfile.activeTapBonuses.length > 0) {
        let totalBonusMultiplierFactor = 1;
        let stillActiveBonuses = updatedProfile.activeTapBonuses.map(bonus => {
          totalBonusMultiplierFactor *= bonus.bonusMultiplier;
          return { ...bonus, remainingTaps: bonus.remainingTaps - 1 };
        }).filter(bonus => bonus.remainingTaps > 0);

        finalPoints = Math.round(finalAmount * totalBonusMultiplierFactor);
        
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
      
      updatedProfile.points += finalPoints;
      updatedProfile.seasonProgress[currentSeason.id] = (updatedProfile.seasonProgress[currentSeason.id] || 0) + finalPoints;

      let newXp = updatedProfile.xp + finalPoints;
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
        toast({ title: 'Level Up!', description: `Congrats Commander! You passed to level ${updatedProfile.level}.` });
      }

      const previousLeague = updatedProfile.league;
      const newLeague = getLeagueByPoints(updatedProfile.points);
      if (newLeague !== previousLeague) {
        updatedProfile.league = newLeague;
        addCoreMessage({ type: 'system_alert', content: `Promotion! You've reached the ${newLeague} league.` });
      }
      
      let newBattlePassXp = updatedProfile.battlePassXp + finalPoints;
      let bpLevelledUp = false;
      while(newBattlePassXp >= updatedProfile.xpToNextBattlePassLevel) {
        newBattlePassXp -= updatedProfile.xpToNextBattlePassLevel;
        updatedProfile.battlePassLevel++;
        bpLevelledUp = true;
      }
      updatedProfile.battlePassXp = newBattlePassXp;
      if (bpLevelledUp) {
          addCoreMessage({ type: 'system_alert', content: `Battle Pass Level Up! Reached Level ${updatedProfile.battlePassLevel}.` });
      }
      
      if (isLogoTap) {
        addCoreMessage({ type: 'system_alert', content: `Precision Strike! Bonus points awarded.` });
      } else if (isCritical) {
        addCoreMessage({ type: 'system_alert', content: `Critical Tap! Power amplified.` });
      }

      // Update quests after all other calculations
      let profileWithQuestProgress = updateQuestProgress(updatedProfile, 'taps', 1);
      profileWithQuestProgress = updateQuestProgress(profileWithQuestProgress, 'points_earned', finalPoints);
      
      return profileWithQuestProgress;
    });

    setComboCount(prevCount => prevCount + 1);
    setTimeout(() => setComboCount(0), 3000);
  }, [pointsPerTapValue, criticalTapChance, criticalTapMultiplier, comboMultiplierValue, addCoreMessage, updateQuestProgress, toast, currentSeason.id]);


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
              addCoreMessage({ type: 'system_alert', content: `Promotion! You've reached the ${newLeague} league.` });
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
        addCoreMessage({ type: 'system_alert', content: 'Daily Quest objectives refreshed. New challenges await.'});
        return { ...prev, activeDailyQuests: newQuests, lastDailyQuestRefresh: now.getTime() };
    });
  }, [addCoreMessage]);

  const completeInitialSetup = useCallback(async (name: string, commanderSex: 'male' | 'female', country: string, referredByCode?: string) => {
    const now = Date.now();
    
    const selectedAvatarData = SELECTABLE_AVATARS.find(a => a.sex === commanderSex);
    if (!selectedAvatarData) {
        console.error("Selected avatar data not found during setup. This should not happen.");
        toast({ title: 'Avatar Error', description: 'Could not set selected avatar.', variant: 'destructive'});
        return; 
    }
    
    const newProfileData: PlayerProfile = {
      ...defaultPlayerProfile,
      id: `${now}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      commanderSex: selectedAvatarData.sex,
      avatarUrl: selectedAvatarData.fullBodyUrl,
      portraitUrl: selectedAvatarData.portraitUrl,
      country,
      currentSeasonId: SEASONS_DATA[0].id,
      lastLoginTimestamp: now,
      referralCode: generateReferralCode(name),
      referredByCode: referredByCode?.trim() || '',
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

    try {
        const profileForFirestore = {
            ...newProfileData,
            activeDailyQuests: newProfileData.activeDailyQuests.map(({ icon, ...rest }) => rest),
        };
        await syncPlayerProfileInFirestore(profileForFirestore);
    } catch (error) {
        console.error("Failed to sync profile on initial setup:", error);
        toast({ title: 'Sincronizacion fallo', description: `Could not save profile to server: ${error instanceof Error ? error.message : 'Unknown error'}`, variant: 'destructive' });
    }
  }, [addCoreMessage, toast]);
  

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
      addCoreMessage({ type: 'system_alert', content: `Wallet Connected! Received ${AURON_PER_WALLET_CONNECT} Auron bonus and unlocked the Ark Hangar.` });
      return {
        ...prev,
        isWalletConnected: true,
        auron: prev.auron + AURON_PER_WALLET_CONNECT,
      };
    });
  }, [addCoreMessage]);

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
        addCoreMessage({ type: 'system_alert', content: 'Premium Battle Pass unlocked! Access to premium rewards granted.' });
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
      }
      
      // Handle non-currency rewards like titles if needed in the future

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
        
        addCoreMessage({ type: 'system_alert', content: `Broadcast complete. You received ${REWARDED_AD_AURON_REWARD} Auron.` });

        return {
          ...prev,
          auron: prev.auron + REWARDED_AD_AURON_REWARD,
          lastRewardedAdTimestamp: Date.now()
        };
      });
      setIsWatchingAd(false);
    }, 3000);
  }, [rewardedAdCooldown, isWatchingAd, addCoreMessage]);

  const updatePlayerProfile = useCallback((name: string, selectedPortraitUrl: string) => {
    setPlayerProfile(prev => {
        if (!prev) return null;
        
        const selectedAvatarData = SELECTABLE_AVATARS.find(a => a.portraitUrl === selectedPortraitUrl);
        if (!selectedAvatarData) {
            console.error("Selected avatar for update not found. No changes made.");
            toast({ title: 'Error', description: 'Could not find the selected avatar data.', variant: 'destructive' });
            return prev;
        }

        const updatedProfile = { 
            ...prev, 
            name, 
            avatarUrl: selectedAvatarData.fullBodyUrl,
            portraitUrl: selectedAvatarData.portraitUrl,
            commanderSex: selectedAvatarData.sex
        };
        return updatedProfile;
    });
    addCoreMessage({ type: 'system_alert', content: 'Player profile updated.' });
    toast({ title: 'Profile Updated', description: 'Your callsign and avatar have been updated.' });
  }, [addCoreMessage, toast]);
  
  const toggleCommander = useCallback(() => {
    setPlayerProfile(prev => {
        if (!prev) return null;
        const newSex = prev.commanderSex === 'male' ? 'female' : 'male';
        
        const newAvatarData = SELECTABLE_AVATARS.find(a => a.sex === newSex);
        if (!newAvatarData) {
            console.error(`Could not find avatar data for sex: ${newSex}. Defaulting.`);
            toast({ title: 'Avatar Error', description: 'Could not switch commander.', variant: 'destructive'});
            return prev;
        }
            
        toast({ title: 'Commander Switched', description: `Now playing as the ${newSex} commander.` });
        
        return { 
            ...prev, 
            commanderSex: newSex, 
            avatarUrl: newAvatarData.fullBodyUrl,
            portraitUrl: newAvatarData.portraitUrl 
        };
    });
  }, [toast]);
  
  const getArkUpgradeById = useCallback((upgradeId: string) => {
    return ARK_UPGRADES_DATA.find(u => u.id === upgradeId);
  }, []);

  const resetGame = useCallback(() => {
    try {
        localStorage.removeItem('playerProfile');
        localStorage.removeItem('coreMessages');
        window.location.reload();
    } catch (e) {
        console.error("Failed to clear game data from localStorage", e);
        toast({
            title: "Reset Failed",
            description: "Could not clear game data. Please try clearing your browser cache.",
            variant: "destructive",
        });
    }
  }, [toast]);

  const connectTelegramWallet = useCallback(() => {
    if (!isTelegramEnv) return;
    import('@twa-dev/sdk').then(twa => {
        twa.default.requestWalletAccess((granted) => {
            if (granted) {
                setPlayerProfile(prev => {
                    if (!prev) return null;
                    toast({ title: 'Telegram Wallet Connected!', description: 'You can now purchase Auron with TON.' });
                    return { ...prev, isTelegramWalletConnected: true };
                });
            } else {
                toast({ title: 'Connection Denied', description: 'You denied wallet access.', variant: 'destructive' });
            }
        });
    });
  }, [isTelegramEnv, toast]);

  const purchaseWithTelegramWallet = useCallback((pkg: { amount: number; price: number }) => {
    if (!isTelegramEnv || !playerProfile?.isTelegramWalletConnected) {
      toast({ title: 'Wallet Not Connected', description: 'Please connect your Telegram Wallet first.', variant: 'destructive' });
      return;
    }

    import('@twa-dev/sdk').then(twa => {
        // This is a simplified example. A real implementation would generate a unique invoice
        // on a backend server and pass the link to openInvoice.
        // For this prototype, we'll use a simulated success.
        twa.default.showConfirm(`Purchase ${pkg.amount} Auron for a simulated ${pkg.price} TON?`, (confirmed) => {
            if (confirmed) {
                setPlayerProfile(prev => {
                    if (!prev) return null;
                    toast({ title: 'Purchase Successful (Simulated)', description: `You received ${pkg.amount.toLocaleString()} Auron.` });
                    return { ...prev, auron: prev.auron + pkg.amount };
                });
            } else {
                toast({ title: 'Purchase Canceled', description: 'The transaction was not completed.' });
            }
        });
    });
  }, [isTelegramEnv, playerProfile, toast]);


  // --- Save profile to localStorage on change ---
  useEffect(() => {
    if (playerProfile && isInitialSetupDone) {
      try {
        const profileToSave: PlayerProfile = {
            ...playerProfile,
            activeDailyQuests: playerProfile.activeDailyQuests.map(({ icon, ...rest }) => rest), // Remove icon before saving
        };
        localStorage.setItem('playerProfile', JSON.stringify(profileToSave));
      } catch (e) {
          console.error("Failed to save player profile to localStorage:", e);
      }
    }
  }, [playerProfile, isInitialSetupDone]);
  
   // --- Cooldown timer effect ---
  useEffect(() => {
      if (!playerProfile) return;
      const interval = setInterval(() => {
          const now = Date.now();
          const lastAdTime = playerProfile.lastRewardedAdTimestamp || 0;
          const timeSinceLastAd = now - lastAdTime;
          const newCooldown = Math.max(0, REWARDED_AD_COOLDOWN_MILLISECONDS - timeSinceLastAd);
          setRewardedAdCooldown(newCooldown);
      }, 1000);
      return () => clearInterval(interval);
  }, [playerProfile, setRewardedAdCooldown]);


  // --- Context Value ---
  const contextValue = {
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
    setIsLoading,
    isInitialSetupDone,
    setIsInitialSetupDone,
    completeInitialSetup,
    coreMessages,
    addCoreMessage,
    isCoreUnlocked,
    setIsCoreUnlocked,
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
    claimQuestReward,
    refreshDailyQuestsIfNeeded,
    refillTaps,
    battlePassData: BATTLE_PASS_DATA,
    purchasePremiumPass,
    claimBattlePassReward,
    watchRewardedAd,
    rewardedAdCooldown,
    setRewardedAdCooldown,
    isWatchingAd,
    updatePlayerProfile,
    toggleCommander,
    resetGame,
    toggleMusic,
    isMusicPlaying,
    setIsMusicPlaying,
    isTelegramEnv,
    setIsTelegramEnv,
    connectTelegramWallet,
    purchaseWithTelegramWallet,
    purchaseMarketplaceItem,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// --- Custom Hook ---
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
