
import 'server-only';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import type { PlayerProfile, LeaderboardEntry } from '@/lib/types';
import { firebaseConfig } from "@/lib/firebaseConfig"; // Import the correct config
import { parseISO } from 'date-fns';

// Ensure Firebase is initialized on the server, but only once.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export const fetchLeaderboardData = async (): Promise<LeaderboardEntry[]> => {
    try {
        const playersRef = collection(db, 'players');
        // Fetch players based on their points in descending order.
        const q = query(playersRef, orderBy('points', 'desc'), limit(50));
        
        const querySnapshot = await getDocs(q);
        
        const leaderboard: LeaderboardEntry[] = [];
        let rank = 1;
        querySnapshot.forEach((doc) => {
            const playerData = doc.data() as PlayerProfile;
            
            // Validate and parse last login timestamp safely.
            let lastLogin: Date | null = null;
            if (playerData.lastLoginTimestamp) {
                // Use date-fns for reliable parsing across browsers.
                const parsedDate = typeof playerData.lastLoginTimestamp === 'string' 
                    ? parseISO(playerData.lastLoginTimestamp)
                    : new Date(playerData.lastLoginTimestamp);
                
                if (!isNaN(parsedDate.getTime())) {
                    lastLogin = parsedDate;
                }
            }

            leaderboard.push({
                rank: rank++,
                playerId: doc.id,
                playerName: playerData.name,
                score: playerData.points,
                playerLeague: playerData.league,
                country: playerData.country,
                avatarUrl: playerData.avatarUrl,
                // We'll pass the valid Date object or null.
                // The client component will handle formatting.
                lastSeen: lastLogin
            });
        });
        
        return leaderboard;
    } catch (error) {
        console.error("Error fetching leaderboard from Firestore: ", error);
        // In case of error, we return an empty array to prevent the page from crashing.
        return []; 
    }
};
