// components/FloatingStats.tsx
import React from 'react';
import { useOnlineUsers } from '../hooks/useOnlineUsers';

export default function FloatingStats() {
  const { onlineCount } = useOnlineUsers();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg backdrop-blur z-50">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">{onlineCount} online</span>
      </div>
    </div>
  );
}