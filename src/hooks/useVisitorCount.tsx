// hooks/useVisitorCount.tsx
import { useEffect, useState } from 'react';
import { database } from '../lib/firebase'; 
import { ref, set, get, increment } from 'firebase/database';

export function useVisitorCount() {
  const [totalVisits, setTotalVisits] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const visitRef = ref(database, 'stats/visits');
    const todayRef = ref(database, `stats/daily/${today}`);

    const incrementVisits = async () => {
      await set(visitRef, increment(1));
      await set(todayRef, increment(1));
    };

    const getStats = async () => {
      const totalSnapshot = await get(visitRef);
      const todaySnapshot = await get(todayRef);
      
      setTotalVisits(totalSnapshot.val() || 0);
      setTodayVisits(todaySnapshot.val() || 0);
    };

    incrementVisits();
    getStats();
  }, []);

  return { totalVisits, todayVisits };
}