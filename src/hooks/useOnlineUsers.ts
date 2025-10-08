// hooks/useOnlineUsers.ts
import { useEffect, useState } from 'react';
import { database } from '../lib/firebase'; 
import { ref, onValue, set, onDisconnect, serverTimestamp } from 'firebase/database';

export function useOnlineUsers() {
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const userId = `user_${Math.random().toString(36).substr(2, 9)}`;
    const userRef = ref(database, `presence/${userId}`);
    const onlineRef = ref(database, 'presence');

    // Marcar como online
    set(userRef, {
      online: true,
      lastSeen: serverTimestamp(),
    });

    // Configurar desconexión automática
    onDisconnect(userRef).remove();

    // Escuchar cambios en usuarios online
    const unsubscribe = onValue(onlineRef, (snapshot) => {
      const users = snapshot.val() || {};
      const onlineUsersList = Object.keys(users);
      setOnlineCount(onlineUsersList.length);
      setOnlineUsers(onlineUsersList);
    });

    return () => {
      unsubscribe();
      set(userRef, null); // Remover al salir
    };
  }, []);

  return { onlineCount, onlineUsers };
}