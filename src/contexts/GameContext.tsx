
"use client";
import React, { createContext, useState, useEffect, useRef, useCallback, useContext } from 'react';
import type {
  CoreMessage,
  PlayerProfile,
  Season,
  Upgrade,
  ArkUpgrade,
  MarketplaceItem,
  ActiveTapBonus,
  DailyQuest,
  DailyQuestTemplate,
  LeagueName,
  BattlePass,
  BattlePassLevel,
} from '@/lib/types';
import { Buffer } from 'buffer';
// import WebApp from '@twa-dev/sdk'; // Removed from top-level import
import {
  SEASONS_DATA,
  UPGRADES_DATA,
  ARK_UPGRADES_DATA,
  INITIAL_XP_TO_NEXT_LEVEL,
  XP_LEVEL_MULTIPLIER,
  getRankTitle,
  POINTS_PER_TAP,
  AF_LOGO_TAP_BONUS_MULTIPLIER,
  AURON_PER_WALLET_CONNECT,
  getTierColorByLevel,
  INITIAL_TIER_COLOR,
  MARKETPLACE_ITEMS_DATA,
  DAILY_QUESTS_POOL,
  getLeagueByPoints,
  DEFAULT_LEAGUE,
  BATTLE_PASS_DATA,
  BATTLE_PASS_XP_PER_LEVEL,
  TAP_REGEN_COOLDOWN_MILLISECONDS,
  INITIAL_MAX_TAPS,
  AURON_COST_FOR_TAP_REFILL,
  REWARDED_AD_AURON_REWARD,
  REWARDED_AD_COOLDOWN_MILLISECONDS,
  MULE_DRONE_BASE_RATE,
  SELECTABLE_AVATARS,
} from '@/lib/gameData';
import { useToast } from '@/hooks/use-toast';
import { syncPlayerProfileInFirestore } from '@/lib/firestore';
import { askCore as askCoreAI } from '@/ai/flows/core-ask-question';
import { getCoreBriefing } from '@/ai/flows/core-briefings';
import { getCoreLoreSnippet } from '@/ai/flows/core-lore-snippets';
import { getCoreProgressUpdate } from '@/ai/flows/core-progress-updates';
import type { CoreAskInput, CoreAskOutput } from '@/ai/flows/core-ask-question';

// Local definition because `CommanderOrder` wasn't exported from '@/lib/types' per diagnostics.
// If you have this type in your central types file, remove this local definition and import it instead.
interface CommanderOrder {
  id: string;
  target: number;
  reward: number;
  startTime: number;
  endTime: number;
  isCompleted: boolean;
}

// UUID helper (uses crypto.randomUUID when available, otherwise fallback)
const uuidv4 = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // @ts-ignore - some TS lib targets may not include randomUUID in the type definitions
    return (crypto as any).randomUUID();
  }

  // Fallback RFC4122 v4 implementation (pure JS)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

interface GameContextType {
  playerProfile: PlayerProfile | null;
  isLoading: boolean;
  isInitialSetupDone: boolean;
  isPreIntroDone: boolean;
  currentSeason: Season;
  upgrades: Upgrade[];
  arkUpgrades: ArkUpgrade[];
  marketplaceItems: MarketplaceItem[];
  battlePassData: BattlePass;
  commanderOrder: CommanderOrder | null;
  coreMessages: CoreMessage[];
  isCoreUnlocked: boolean;
  isOpen: boolean;
  hasUnread: boolean;
  rewardedAdCooldown: number;
  isWatchingAd: boolean;
  isTelegramEnv: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setHasUnread: (hasUnread: boolean) => void;
  completeInitialSetup: (name: string, commanderSex: 'male' | 'female', country: string, portraitUrl: string, fullBodyUrl: string) => void;
  completePreIntro: () => void;
  handleTap: (isLogoTap: boolean) => void;
  purchaseUpgrade: (upgradeId: string) => void;
  getUpgradeLevel: (upgradeId: string) => number;
  getUpgradeCost: (upgradeId: string) => number;
  connectWallet: (address: string) => void;
  getArkUpgradeById: (id: string) => ArkUpgrade | undefined;
  purchaseArkUpgrade: (upgradeId: string) => void;
  refillTaps: () => void;
  addPoints: (amount: number) => void;
  purchaseMarketplaceItem: (itemId: string) => void;
  claimQuestReward: (questId: string) => void;
  refreshDailyQuestsIfNeeded: () => void;
  resetGame: () => void;
  toggleCommander: () => void;
  toggleMusic: () => void;
  isMusicPlaying: boolean;
  askCore: (question: string) => Promise<void>;
  purchasePremiumPass: () => void;
  claimBattlePassReward: (level: number, track: 'free' | 'premium') => void;
  claimCommanderOrder: () => void;
  hideCommanderOrder: () => void;
  watchRewardedAd: () => void;
  connectTelegramWallet: () => void;
  purchaseWithTelegramWallet: (pkg: { amount: number; price: number }) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialSetupDone, setIsInitialSetupDone] = useState(false);
  const [isPreIntroDone, setIsPreIntroDone] = useState(false);
  const { toast } = useToast();
  const currentSeason = SEASONS_DATA[0];
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const [coreMessages, setCoreMessages] = useState<CoreMessage[]>([]);
  const [isCoreUnlocked, setIsCoreUnlocked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [commanderOrder, setCommanderOrder] = useState<CommanderOrder | null>(null);
  const [rewardedAdCooldown, setRewardedAdCooldown] = useState(0);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [isTelegramEnv, setIsTelegramEnv] = useState(false);

  useEffect(() => {
    // Dynamically import and check for Telegram environment only on the client side.
    import('@twa-dev/sdk').then(WebApp => {
        setIsTelegramEnv(WebApp.default.platform !== 'unknown');
    });
  }, []);

  const addCoreMessage = (type: CoreMessage['type'], content: string) => {
    const newMessage: CoreMessage = { id: uuidv4(), type, content, timestamp: Date.now() };
    setCoreMessages(prev => [...prev, newMessage]);
    if (!isOpen) {
      setHasUnread(true);
    }
  };

  const askCore = async (question: string) => {
    if (!playerProfile) return;
    addCoreMessage('question', question);
    try {
      const input: CoreAskInput = {
        question,
        playerContext: {
          level: playerProfile.level,
          points: playerProfile.points,
          rankTitle: playerProfile.rankTitle,
          season: currentSeason.title,
          seasonObjective: currentSeason.coreBriefingObjective,
        },
      };
      const response: CoreAskOutput = await askCoreAI(input);
      addCoreMessage('answer', response.answer);
    } catch (error) {
      console.error("Error asking C.O.R.E.:", error);
      addCoreMessage('system_alert', "Apologies, Commander. My systems are experiencing interference. Please try again later.");
    }
  };

  const loadGame = () => {
    setIsLoading(true);
    try {
      const savedProfile = localStorage.getItem('playerProfile');
      const preIntroStatus = localStorage.getItem('isPreIntroDone');

      if (preIntroStatus === 'true') {
        setIsPreIntroDone(true);
      }

      if (savedProfile) {
        const profile: PlayerProfile = JSON.parse(savedProfile);
        setPlayerProfile(profile);
        setIsInitialSetupDone(true);
        setIsCoreUnlocked(profile.level >= 5 || (profile.currentSeasonId && SEASONS_DATA.find(s => s.id === profile.currentSeasonId)?.unlocksCore || false));

        const lastAdTime = profile.lastRewardedAdTimestamp || 0;
        const cooldownEndTime = lastAdTime + REWARDED_AD_COOLDOWN_MILLISECONDS;
        const remainingCooldown = Math.max(0, cooldownEndTime - Date.now());
        setRewardedAdCooldown(remainingCooldown);
      }
    } catch (error) {
      console.error("Failed to load game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGame();
  }, []);

  const saveGame = useCallback((profile: PlayerProfile | null) => {
    if (profile) {
      localStorage.setItem('playerProfile', JSON.stringify(profile));
      syncPlayerProfileInFirestore(profile).catch(error => {
        console.error("Firestore sync failed:", error);
      });
    }
  }, []);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (playerProfile) {
        saveGame(playerProfile);
      }
    }, 30000); // Auto-save every 30 seconds
    return () => clearInterval(saveInterval);
  }, [playerProfile, saveGame]);

  const completePreIntro = () => {
    setIsPreIntroDone(true);
    localStorage.setItem('isPreIntroDone', 'true');
  };

  const completeInitialSetup = (name: string, commanderSex: 'male' | 'female', country: string, portraitUrl: string, fullBodyUrl: string) => {
    const newProfile: PlayerProfile = {
      id: `player_${Date.now()}`,
      name,
      commanderSex,
      country,
      portraitUrl,
      avatarUrl: fullBodyUrl,
      points: 0,
      auron: 0,
      level: 1,
      xp: 0,
      xpToNextLevel: INITIAL_XP_TO_NEXT_LEVEL,
      rankTitle: getRankTitle(1),
      currentSeasonId: currentSeason.id,
      seasonProgress: { [currentSeason.id]: 0 },
      upgrades: {},
      muleDrones: 0,
      isWalletConnected: false,
      arkHangarFullyUpgraded: false,
      lastLoginTimestamp: Date.now(),
      activeTapBonuses: [],
      activeDailyQuests: [],
      lastDailyQuestRefresh: 0,
      referralCode: Buffer.from(name + Date.now()).toString('hex').substring(0, 8),
      coreVoiceProtocol: 'synthetic',
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
      battlePassRewardsClaimed: {},
      lastRewardedAdTimestamp: 0,
      isTelegramWalletConnected: false,
      activeTapBonusMultiplier: 1,
      tapsUsedToday: 0,
      totalLogsTapped: 0,
      totalTaps: 0,
      totalCrits: 0,
      longestTapCombo: 0,
      longestTapStreak: 0,
      tapMax: 0,
      selectedCommanderId: null,
      arkUpgrades: {},
      connectedWallets: [],
      totalTelegramWalletConnections: 0,
      totalTapRegenPurchases: 0,
      battlePassPremiumPurchased: false,
      totalAdsWatched: 0,
      totalArksLaunched: 0,
    };
    setPlayerProfile(newProfile);
    setIsInitialSetupDone(true);
    saveGame(newProfile);
    if (SEASONS_DATA.find(s => s.id === newProfile.currentSeasonId)?.unlocksCore) {
      setIsCoreUnlocked(true);
      addCoreMessage('briefing', `Welcome to the Alliance, Commander ${name}. I am C.O.R.E., your Combat and Operations AI. Our objective is to ${currentSeason.coreBriefingObjective}. Your command begins now.`);
    }
  };

  const getUpgradeLevel = useCallback((upgradeId: string) => {
    return playerProfile?.upgrades[upgradeId] || 0;
  }, [playerProfile]);

  const getUpgradeCost = useCallback((upgradeId: string) => {
    const upgrade = UPGRADES_DATA.find(u => u.id === upgradeId);
    if (!upgrade) return Infinity;
    const level = getUpgradeLevel(upgradeId);
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
  }, [getUpgradeLevel]);

  const handleTap = useCallback((isLogoTap: boolean) => {
    if (!playerProfile || playerProfile.currentTaps <= 0) return;

    let pointsPerBaseTap = getUpgradeLevel('tapPower') + POINTS_PER_TAP;
    if (isLogoTap) {
      pointsPerBaseTap *= AF_LOGO_TAP_BONUS_MULTIPLIER;
    }

    let critChance = 0.05 + getUpgradeLevel('critChance') * 0.005;
    let isCrit = Math.random() < critChance;

    let critMultiplier = 1.5 + getUpgradeLevel('critMultiplier') * 0.1;
    let totalMultiplier = isCrit ? critMultiplier : 1;

    let comboBonus = 1 + getUpgradeLevel('comboBonus') * 0.02;
    totalMultiplier *= comboBonus;

    const activeBonusMultiplier = playerProfile.activeTapBonuses.reduce((acc, bonus) => acc * bonus.bonusMultiplier, 1);
    totalMultiplier *= activeBonusMultiplier;

    const earnedPoints = Math.round(pointsPerBaseTap * totalMultiplier);

    setPlayerProfile(prev => {
      if (!prev) return null;
      let newXp = prev.xp + earnedPoints;
      let newLevel = prev.level;
      let newXpToNextLevel = prev.xpToNextLevel;
      let newRankTitle = prev.rankTitle;
      let newTierColor = prev.currentTierColor;

      while (newXp >= newXpToNextLevel) {
        newXp -= newXpToNextLevel;
        newLevel++;
        newXpToNextLevel = Math.floor(newXpToNextLevel * XP_LEVEL_MULTIPLIER);
        newRankTitle = getRankTitle(newLevel);
        newTierColor = getTierColorByLevel(newLevel);
        toast({ title: "Rank Up!", description: `Congratulations, you are now Level ${newLevel} - ${newRankTitle}!` });
      }

      const newPoints = prev.points + earnedPoints;
      const newLeague = getLeagueByPoints(newPoints);

      let newBattlePassLevel = prev.battlePassLevel;
      let newBattlePassXp = prev.battlePassXp + earnedPoints;
      let newXpToNextBattlePassLevel = prev.xpToNextBattlePassLevel;

      while (newBattlePassXp >= newXpToNextBattlePassLevel) {
        newBattlePassXp -= newXpToNextBattlePassLevel;
        newBattlePassLevel++;
        toast({ title: "Battle Pass Level Up!", description: `You've reached level ${newBattlePassLevel}!` });
      }

      const updatedBonuses = prev.activeTapBonuses.map(bonus => ({
        ...bonus,
        remainingTaps: bonus.remainingTaps - 1,
      })).filter(bonus => bonus.remainingTaps > 0);

      if (prev.activeTapBonuses.length > 0 && updatedBonuses.length < prev.activeTapBonuses.length) {
        toast({ title: "Boost Expired", description: "One of your tap boosts has worn off." });
      }

      const newDailyQuests = prev.activeDailyQuests.map(q => {
        if (q.type === 'taps' && !q.isCompleted) {
          const newProgress = q.progress + 1;
          return { ...q, progress: newProgress, isCompleted: newProgress >= q.target };
        }
        if (q.type === 'points_earned' && !q.isCompleted) {
          const newProgress = q.progress + earnedPoints;
          return { ...q, progress: newProgress, isCompleted: newProgress >= q.target };
        }
        return q;
      });

      // Check if any quest was just completed
      newDailyQuests.forEach((quest, i) => {
        if (quest.isCompleted && !prev.activeDailyQuests[i].isCompleted) {
          toast({ title: "Quest Complete!", description: `You've completed: ${quest.title}` });
        }
      });

      return {
        ...prev,
        points: newPoints,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNextLevel,
        rankTitle: newRankTitle,
        currentTierColor: newTierColor,
        league: newLeague,
        currentTaps: prev.currentTaps - 1,
        activeTapBonuses: updatedBonuses,
        activeDailyQuests: newDailyQuests,
        battlePassLevel: newBattlePassLevel,
        battlePassXp: newBattlePassXp,
      };
    });
  }, [playerProfile, toast, getUpgradeLevel]);

  const purchaseUpgrade = (upgradeId: string) => {
    if (!playerProfile) return;
    const upgrade = UPGRADES_DATA.find(u => u.id === upgradeId);
    if (!upgrade) return;

    const level = getUpgradeLevel(upgradeId);
    if (upgrade.maxLevel && level >= upgrade.maxLevel) {
      toast({ title: "Max Level", description: "This upgrade is already at its maximum level.", variant: 'destructive' });
      return;
    }

    const cost = getUpgradeCost(upgradeId);

    if (playerProfile.points >= cost) {
      setPlayerProfile(prev => {
        if (!prev) return null;
        const newLevel = (prev.upgrades[upgradeId] || 0) + 1;

        const newDailyQuests = prev.activeDailyQuests.map(q => {
          if (q.type === 'purchase_upgrade' && !q.isCompleted) {
            const newProgress = q.progress + 1;
            const isCompleted = newProgress >= q.target;
            if (isCompleted && !q.isCompleted) toast({ title: "Quest Complete!", description: `You've completed: ${q.title}` });
            return { ...q, progress: newProgress, isCompleted };
          }
          return q;
        });

        return {
          ...prev,
          points: prev.points - cost,
          upgrades: { ...prev.upgrades, [upgradeId]: newLevel },
          activeDailyQuests: newDailyQuests,
        };
      });
      toast({ title: "Upgrade Successful!", description: `Upgraded ${upgrade.name} to Level ${level + 1}.` });
    } else {
      toast({ title: "Insufficient Points", description: `You need ${cost.toLocaleString()} points to purchase this upgrade.`, variant: 'destructive' });
    }
  };

  const connectWallet = (address: string) => {
    if (!playerProfile || playerProfile.isWalletConnected) return;
    setPlayerProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        isWalletConnected: true,
        walletAddress: address,
        auron: prev.auron + AURON_PER_WALLET_CONNECT
      };
    });
    toast({ title: "Wallet Connected!", description: `You've earned ${AURON_PER_WALLET_CONNECT} Auron as a bonus!` });
  };

  const purchaseArkUpgrade = (upgradeId: string) => {
    if (!playerProfile) return;
    const upgrade = ARK_UPGRADES_DATA.find(u => u.id === upgradeId);
    if (!upgrade || playerProfile.upgrades[upgradeId]) return;

    if (playerProfile.points >= upgrade.cost) {
      setPlayerProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          points: prev.points - upgrade.cost,
          upgrades: { ...prev.upgrades, [upgradeId]: 1 },
        };
      });
      toast({ title: 'Ark Upgrade Installed!', description: `Successfully installed ${upgrade.name}.` });
    } else {
      toast({ title: 'Insufficient Points', description: 'Not enough points for this Ark upgrade.', variant: 'destructive' });
    }
  };

  const getArkUpgradeById = (id: string) => {
    return ARK_UPGRADES_DATA.find(u => u.id === id);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setPlayerProfile(p => {
        if (!p) return null;

        // Only check for regen if taps are not full
        if (p.currentTaps < p.maxTaps) {
          const now = Date.now();
          if (now >= p.tapsAvailableAt) {
            // Time to regenerate
            return { 
              ...p, 
              currentTaps: p.maxTaps, 
              tapsAvailableAt: now + TAP_REGEN_COOLDOWN_MILLISECONDS 
            };
          }
        }
        
        // No change needed
        return p;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Run only once on mount

  const refillTaps = () => {
    setPlayerProfile(p => {
      if (!p) return null;
      if (p.auron >= AURON_COST_FOR_TAP_REFILL) {
        toast({ title: "Taps Refilled!", description: `Your energy has been replenished.` });
        return {
          ...p,
          auron: p.auron - AURON_COST_FOR_TAP_REFILL,
          currentTaps: p.maxTaps,
          tapsAvailableAt: Date.now() + TAP_REGEN_COOLDOWN_MILLISECONDS,
        };
      } else {
        toast({ title: "Insufficient Auron", description: `You need ${AURON_COST_FOR_TAP_REFILL} Auron to refill your taps.`, variant: 'destructive' });
        return p;
      }
    });
  };

  const addPoints = (amount: number) => {
    setPlayerProfile(p => p ? { ...p, points: p.points + amount } : null);
  };

  const purchaseMarketplaceItem = (itemId: string) => {
    if (!playerProfile) return;
    const item = MARKETPLACE_ITEMS_DATA.find(i => i.id === itemId);
    if (!item) return;

    if (playerProfile.auron >= item.costInAuron) {
      setPlayerProfile(prev => {
        if (!prev) return null;

        const newBonus: ActiveTapBonus = {
          id: `${item.id}-${Date.now()}`,
          marketItemId: item.id,
          name: item.name,
          remainingTaps: item.bonusEffect.durationTaps,
          bonusMultiplier: item.bonusEffect.multiplier,
          originalDurationTaps: item.bonusEffect.durationTaps,
        };

        const newDailyQuests = prev.activeDailyQuests.map(q => {
          if (q.type === 'spend_auron' && !q.isCompleted) {
            const newProgress = q.progress + item.costInAuron;
            const isCompleted = newProgress >= q.target;
            if (isCompleted && !q.isCompleted) toast({ title: "Quest Complete!", description: `You've completed: ${q.title}` });
            return { ...q, progress: newProgress, isCompleted };
          }
          return q;
        });

        return {
          ...prev,
          auron: prev.auron - item.costInAuron,
          activeTapBonuses: [...prev.activeTapBonuses, newBonus],
          activeDailyQuests: newDailyQuests,
        };
      });
      toast({ title: "Purchase Successful!", description: `You've activated ${item.name}.` });
    } else {
      toast({ title: "Insufficient Auron", description: `You need ${item.costInAuron} Auron to buy this item.`, variant: 'destructive' });
    }
  };

  const refreshDailyQuestsIfNeeded = useCallback(() => {
    if (!playerProfile) return;

    const now = Date.now();
    const lastRefresh = playerProfile.lastDailyQuestRefresh || 0;
    const oneDay = 24 * 60 * 60 * 1000;

    if (now - lastRefresh > oneDay) {
      const shuffledQuests = [...DAILY_QUESTS_POOL].sort(() => 0.5 - Math.random());
      const newQuests = shuffledQuests.slice(0, 3).map((template): DailyQuest => ({
        id: `${template.templateId}-${now}`,
        templateId: template.templateId,
        title: template.title,
        description: template.description,
        type: template.type,
        target: template.target,
        progress: 0,
        reward: template.reward,
        isCompleted: false,
        isClaimed: false,
        icon: template.icon,
      }));

      setPlayerProfile(p => p ? { ...p, activeDailyQuests: newQuests, lastDailyQuestRefresh: now } : null);
      toast({ title: "New Daily Quests", description: "Your daily assignments have been updated." });
    }
  }, [playerProfile, toast]);

  useEffect(() => {
    if (playerProfile && isInitialSetupDone) {
      refreshDailyQuestsIfNeeded();
    }
  }, [playerProfile, isInitialSetupDone, refreshDailyQuestsIfNeeded]);

  const claimQuestReward = (questId: string) => {
    if (!playerProfile) return;

    const quest = playerProfile.activeDailyQuests.find(q => q.id === questId);
    if (!quest || !quest.isCompleted || quest.isClaimed) return;

    setPlayerProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        points: prev.points + (quest.reward.points || 0),
        auron: prev.auron + (quest.reward.auron || 0),
        activeDailyQuests: prev.activeDailyQuests.map(q =>
          q.id === questId ? { ...q, isClaimed: true } : q
        ),
      };
    });

    toast({
      title: "Reward Claimed!",
      description: `You received ${quest.reward.points || 0} points and ${quest.reward.auron || 0} Auron.`
    });
  };

  const resetGame = () => {
    localStorage.removeItem('playerProfile');
    localStorage.removeItem('isPreIntroDone');
    setPlayerProfile(null);
    setIsInitialSetupDone(false);
    setIsPreIntroDone(false);
    setCoreMessages([]);
    window.location.reload();
  };

  const toggleCommander = () => {
    if (!playerProfile) return;
    const newSex = playerProfile.commanderSex === 'male' ? 'female' : 'male';
    const newAvatar = SELECTABLE_AVATARS.find(avatar => avatar.sex === newSex);
    if (newAvatar) {
        setPlayerProfile(p => p ? { 
            ...p, 
            commanderSex: newSex,
            portraitUrl: newAvatar.portraitUrl,
            avatarUrl: newAvatar.fullBodyUrl
        } : null);
    }
  };

  const toggleMusic = () => {
    if (!musicAudioRef.current) {
      musicAudioRef.current = new Audio('/audio/alliance-forge-theme.mp3');
      musicAudioRef.current.loop = true;
    }
    if (isMusicPlaying) {
      musicAudioRef.current.pause();
    } else {
      musicAudioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const purchasePremiumPass = () => {
    if (!playerProfile) return;
    if (playerProfile.auron >= BATTLE_PASS_DATA.premiumCostInAuron) {
      setPlayerProfile(prev => prev ? {
        ...prev,
        auron: prev.auron - BATTLE_PASS_DATA.premiumCostInAuron,
        hasPremiumPass: true
      } : null);
      toast({ title: "Premium Pass Unlocked!", description: "You now have access to the premium reward track." });
    } else {
      toast({ title: "Insufficient Auron", description: `You need ${BATTLE_PASS_DATA.premiumCostInAuron} Auron.`, variant: 'destructive' });
    }
  };

  const claimBattlePassReward = (level: number, track: 'free' | 'premium') => {
    if (!playerProfile || playerProfile.battlePassLevel < level) return;
    if (track === 'premium' && !playerProfile.hasPremiumPass) return;

    const levelData = BATTLE_PASS_DATA.levels.find(l => l.level === level);
    const reward = track === 'free' ? levelData?.freeReward : levelData?.premiumReward;
    if (!reward) return;

    const alreadyClaimed = playerProfile.claimedBattlePassRewards[level]?.includes(track);
    if (alreadyClaimed) return;

    setPlayerProfile(prev => {
      if (!prev) return null;
      let newPoints = prev.points;
      let newAuron = prev.auron;
      if (reward.type === 'points' && reward.amount) newPoints += reward.amount;
      if (reward.type === 'auron' && reward.amount) newAuron += reward.amount;

      const newClaims = { ...prev.claimedBattlePassRewards };
      if (!newClaims[level]) newClaims[level] = [];
      newClaims[level].push(track);

      return { ...prev, points: newPoints, auron: newAuron, claimedBattlePassRewards: newClaims };
    });
    toast({ title: "Reward Claimed!", description: `You claimed the Level ${level} ${track} reward.` });
  };

  const claimCommanderOrder = () => {
    if (commanderOrder && commanderOrder.isCompleted) {
      addPoints(commanderOrder.reward);
      toast({ title: "Order Complete!", description: `+${commanderOrder.reward.toLocaleString()} points rewarded!` });
      setCommanderOrder(null);
    }
  };

  const hideCommanderOrder = () => {
    setCommanderOrder(null);
  };

  useEffect(() => {
    if (playerProfile && !commanderOrder && playerProfile.level > 2) {
      const shouldCreateOrder = Math.random() < 0.1; // 10% chance per render cycle after level 2
      if (shouldCreateOrder) {
        const target = Math.floor(playerProfile.xpToNextLevel * (0.5 + Math.random() * 0.5));
        const reward = Math.floor(target * 0.2);
        const duration = 5 * 60 * 1000; // 5 minutes
        setCommanderOrder({
          id: `order-${Date.now()}`,
          target: target,
          reward: reward,
          startTime: Date.now(),
          endTime: Date.now() + duration,
          isCompleted: playerProfile.points >= target,
        });
      }
    }
  }, [playerProfile, commanderOrder]);

  useEffect(() => {
    if (commanderOrder && !commanderOrder.isCompleted && playerProfile && playerProfile.points >= commanderOrder.target) {
      setCommanderOrder(prev => prev ? { ...prev, isCompleted: true } : null);
      toast({ title: "Objective Met!", description: "You have met the requirements of the Commander's Order." });
    }
    if (commanderOrder && Date.now() > commanderOrder.endTime && !commanderOrder.isCompleted) {
      toast({ title: "Order Expired", description: "You failed to complete the Commander's Order in time.", variant: "destructive" });
      setCommanderOrder(null);
    }
  }, [playerProfile?.points, commanderOrder, toast]);

  const watchRewardedAd = () => {
    if (rewardedAdCooldown > 0 || isWatchingAd) return;
    setIsWatchingAd(true);
    toast({ title: "Broadcast starting...", description: "Please wait while we connect to the Alliance broadcast network." });

    setTimeout(() => {
      setIsWatchingAd(false);
      setPlayerProfile(prev => {
        if (!prev) return null;
        const now = Date.now();
        setRewardedAdCooldown(REWARDED_AD_COOLDOWN_MILLISECONDS);
        return {
          ...prev,
          auron: prev.auron + REWARDED_AD_AURON_REWARD,
          lastRewardedAdTimestamp: now,
        };
      });
      toast({ title: "Reward Received!", description: `You earned ${REWARDED_AD_AURON_REWARD} Auron.` });
    }, 5000); // Simulate 5 second ad
  };

  useEffect(() => {
    if (rewardedAdCooldown > 0) {
      const timer = setInterval(() => {
        setRewardedAdCooldown(prev => Math.max(0, prev - 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [rewardedAdCooldown]);

  // --- Telegram Wallet ---
  const connectTelegramWallet = () => {
    if (!isTelegramEnv || !playerProfile) return;
    import('@twa-dev/sdk').then(WebApp => {
        WebApp.default.CloudStorage.setItem('isWalletConnected', 'true', (error, success) => {
            if (success) {
                setPlayerProfile(p => p ? { ...p, isTelegramWalletConnected: true } : null);
                toast({ title: 'Telegram Wallet Connected!', description: 'You can now use your wallet for purchases.' });
            } else {
                toast({ title: 'Connection Failed', description: 'Could not connect to Telegram Wallet.', variant: 'destructive' });
            }
        });
    });
  };

  const purchaseWithTelegramWallet = (pkg: { amount: number; price: number }) => {
    if (!isTelegramEnv) return;
    toast({
      title: 'Telegram Purchase (Simulated)',
      description: `A prompt would open to buy ${pkg.amount} Auron for ${pkg.price} TON. Adding Auron directly for now.`,
    });
    setPlayerProfile(p => p ? { ...p, auron: p.auron + pkg.amount } : null);
  };

  return (
    <GameContext.Provider value={{
      playerProfile,
      isLoading,
      isInitialSetupDone,
      isPreIntroDone,
      currentSeason,
      upgrades: UPGRADES_DATA,
      arkUpgrades: ARK_UPGRADES_DATA,
      marketplaceItems: MARKETPLACE_ITEMS_DATA,
      battlePassData: BATTLE_PASS_DATA,
      commanderOrder,
      coreMessages,
      isCoreUnlocked,
      isOpen,
      hasUnread,
      rewardedAdCooldown,
      isWatchingAd,
      isTelegramEnv,
      setIsOpen,
      setHasUnread,
      completeInitialSetup,
      completePreIntro,
      handleTap,
      purchaseUpgrade,
      getUpgradeLevel,
      getUpgradeCost,
      connectWallet,
      getArkUpgradeById,
      purchaseArkUpgrade,
      refillTaps,
      addPoints,
      purchaseMarketplaceItem,
      claimQuestReward,
      refreshDailyQuestsIfNeeded,
      resetGame,
      toggleCommander,
      toggleMusic,
      isMusicPlaying,
      askCore,
      purchasePremiumPass,
      claimBattlePassReward,
      claimCommanderOrder,
      hideCommanderOrder,
      watchRewardedAd,
      connectTelegramWallet,
      purchaseWithTelegramWallet,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === null) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
