import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Activity, 
  Zap, 
  Target, 
  TrendingUp, 
  Shield, 
  Star,
  X,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

interface LiveStats {
  onlineUsers: number;
  totalVisits: number;
  totalTaps: number;
  arksBuilt: number;
  newUsersToday: number;
  activeAlliances: number;
  revenue: number;
}

export const LiveDashboard: React.FC = () => {
  const { playerProfile, isInitialSetupDone } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [liveStats, setLiveStats] = useState<LiveStats>({
    onlineUsers: 1247,
    totalVisits: 985432,
    totalTaps: playerProfile?.totalTaps || 0,
    arksBuilt: 56289,
    newUsersToday: 324,
    activeAlliances: 1847,
    revenue: 124750
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Actualizar estadísticas cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        onlineUsers: Math.max(1000, prev.onlineUsers + Math.floor(Math.random() * 20) - 10),
        totalVisits: prev.totalVisits + Math.floor(Math.random() * 15) + 5,
        totalTaps: prev.totalTaps + Math.floor(Math.random() * 50) + 10,
        arksBuilt: prev.arksBuilt + Math.floor(Math.random() * 8) + 2,
        newUsersToday: prev.newUsersToday + Math.floor(Math.random() * 5) + 1,
        activeAlliances: Math.max(1800, prev.activeAlliances + Math.floor(Math.random() * 6) - 3),
        revenue: prev.revenue + Math.floor(Math.random() * 500) + 100
      }));
      setLastUpdate(new Date());
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  // Actualizar totalTaps del jugador en tiempo real
  useEffect(() => {
    if (playerProfile?.totalTaps !== undefined) {
      setLiveStats(prev => ({
        ...prev,
        totalTaps: playerProfile.totalTaps
      }));
    }
  }, [playerProfile?.totalTaps]);

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: number;
    unit?: string;
    color: string;
    trend?: number;
  }> = ({ icon, title, value, unit = '', color, trend }) => (
    <motion.div
      className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:bg-gray-800/70 transition-all duration-300"
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-xs ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp size={12} className={`mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="text-2xl font-bold text-white mb-1">
        {value.toLocaleString()}{unit}
      </div>
      
      <div className="text-gray-400 text-sm">
        {title}
      </div>
    </motion.div>
  );

  const MiniBadge: React.FC<{
    onClick: () => void;
  }> = ({ onClick }) => (
    <motion.button
      className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Users size={20} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <span className="text-sm font-semibold hidden sm:block">
          {liveStats.onlineUsers.toLocaleString()}
        </span>
      </div>
    </motion.button>
  );

  if (!isInitialSetupDone) return null;

  return (
    <>
      {/* Mini Badge */}
      <MiniBadge onClick={() => setIsOpen(true)} />

      {/* Full Dashboard Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className={`bg-gray-900 border border-gray-700 rounded-xl shadow-2xl transition-all duration-300 ${
                isExpanded ? 'w-full h-full max-w-7xl max-h-[95vh]' : 'max-w-4xl w-full max-h-[90vh]'
              }`}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                      <Activity className="mr-3" size={28} />
                      Live Dashboard
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Real-time statistics and activity feed
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-white hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-white/10"
                      title={isExpanded ? 'Minimize' : 'Expand'}
                    >
                      <Maximize2 size={20} />
                    </button>
                    
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-blue-100">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
              </div>

              {/* Content */}
              <div className={`overflow-y-auto ${isExpanded ? 'p-8' : 'p-6'} max-h-[calc(90vh-200px)]`}>
                {/* Primary Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    icon={<Users className="text-white" size={20} />}
                    title="Online Users"
                    value={liveStats.onlineUsers}
                    color="bg-green-500"
                    trend={5.2}
                  />
                  
                  <StatCard
                    icon={<Target className="text-white" size={20} />}
                    title="Total Visits"
                    value={liveStats.totalVisits}
                    color="bg-blue-500"
                    trend={12.8}
                  />
                  
                  <StatCard
                    icon={<Zap className="text-white" size={20} />}
                    title="Total Taps"
                    value={liveStats.totalTaps}
                    color="bg-yellow-500"
                    trend={8.4}
                  />
                  
                  <StatCard
                    icon={<Shield className="text-white" size={20} />}
                    title="Arks Built"
                    value={liveStats.arksBuilt}
                    color="bg-purple-500"
                    trend={3.7}
                  />
                  
                  <StatCard
                    icon={<Star className="text-white" size={20} />}
                    title="New Users Today"
                    value={liveStats.newUsersToday}
                    color="bg-indigo-500"
                    trend={15.3}
                  />
                  
                  <StatCard
                    icon={<Users className="text-white" size={20} />}
                    title="Active Alliances"
                    value={liveStats.activeAlliances}
                    color="bg-red-500"
                    trend={2.1}
                  />
                  
                  <StatCard
                    icon={<TrendingUp className="text-white" size={20} />}
                    title="Revenue (USD)"
                    value={liveStats.revenue}
                    unit="$"
                    color="bg-emerald-500"
                    trend={18.9}
                  />
                  
                  <StatCard
                    icon={<Activity className="text-white" size={20} />}
                    title="Your Taps"
                    value={playerProfile?.totalTaps || 0}
                    color="bg-orange-500"
                    trend={null}
                  />
                </div>

                {/* Secondary Section - Player Stats */}
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Star className="mr-2 text-yellow-400" size={20} />
                    Your Progress
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {playerProfile?.points?.toLocaleString() || '0'}
                      </div>
                      <div className="text-gray-400 text-sm">Total Points</div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        Level {playerProfile?.level || '1'}
                      </div>
                      <div className="text-gray-400 text-sm">{playerProfile?.rankTitle || 'Rookie'}</div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-400 mb-1">
                        {playerProfile?.auron?.toLocaleString() || '0'}
                      </div>
                      <div className="text-gray-400 text-sm">Vanguard Credits</div>
                    </div>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <RefreshCw className="mr-2 text-cyan-400" size={20} />
                    Live Activity
                  </h3>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300">New player registered from Russia</span>
                      <span className="text-gray-500 text-xs">2s ago</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300">Commander upgrade completed</span>
                      <span className="text-gray-500 text-xs">5s ago</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300">Ark construction milestone reached</span>
                      <span className="text-gray-500 text-xs">8s ago</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300">Alliance formed: Stellar Command</span>
                      <span className="text-gray-500 text-xs">12s ago</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300">Premium battle pass purchased</span>
                      <span className="text-gray-500 text-xs">15s ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveDashboard;
