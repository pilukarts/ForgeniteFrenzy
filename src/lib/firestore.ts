
'use server';
import { app } from './firebase';
import { getFirestore, doc, setDoc, getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import type { PlayerProfile, LeaderboardEntry } from './types';

// Initialize Firestore through the Firebase app
const db = getFirestore(app);
const PLAYERS_COLLECTION = 'players';

/**
 * Creates or updates a player's entire profile in Firestore.
 * This is useful for initial setup or full profile syncs.
 * @param playerProfile The full player profile object.
 */
export const syncPlayerProfileInFirestore = async (playerProfile: PlayerProfile): Promise<void> => {
  try {
    const playerDocRef = doc(db, PLAYERS_COLLECTION, playerProfile.id);
    await setDoc(playerDocRef, playerProfile, { merge: true }); // Use merge to avoid overwriting with partial data
  } catch (error) {
    console.error("Error syncing player profile to Firestore: ", error);
    // Depending on the app's needs, you might want to handle this more gracefully
  }
};


/**
 * Fetches the top players from Firestore to build the leaderboard.
 * @returns A promise that resolves to an array of LeaderboardEntry objects.
 */
export const getLeaderboardFromFirestore = async (): Promise<LeaderboardEntry[]> => {
    try {
        const playersRef = collection(db, PLAYERS_COLLECTION);
        // Query to get the top 50 players ordered by points
        const q = query(playersRef, orderBy('points', 'desc'), limit(50));
        
        const querySnapshot = await getDocs(q);
        
        const leaderboard: LeaderboardEntry[] = [];
        let rank = 1;
        querySnapshot.forEach((doc) => {
            const playerData = doc.data() as PlayerProfile;
            leaderboard.push({
                rank: rank++,
                playerId: doc.id,
                playerName: playerData.name,
                score: playerData.points,
                playerLeague: playerData.league,
                country: playerData.country,
                avatarUrl: playerData.avatarUrl,
            });
        });
        
        return leaderboard;
    } catch (error) {
        console.error("Error fetching leaderboard from Firestore: ", error);
        return []; // Return an empty array in case of error
    }
};
