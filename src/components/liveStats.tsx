// components/LiveStats.tsx
import { useOnlineUsers } from '../hooks/useOnlineUsers';
import { useVisitorCount } from '../hooks/useVisitorCount';

export default function LiveStats() {
  const { onlineCount } = useOnlineUsers();
  const { totalVisits, todayVisits } = useVisitorCount();

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">📊 Estadísticas en Vivo</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {onlineCount}
          </div>
          <div className="text-sm">Jugadores Online</div>
          <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mt-1 animate-pulse"></div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {todayVisits}
          </div>
          <div className="text-sm">Visitas Hoy</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {totalVisits}
          </div>
          <div className="text-sm">Total Visitas</div>
        </div>
      </div>
    </div>
  );
}