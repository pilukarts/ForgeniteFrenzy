
'use server';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import type { PlayerProfile, LeaderboardEntry } from './types';
import { firebaseConfig } from "./firebaseConfig";

const PLAYERS_COLLECTION = 'players';

/**
 * Creates or updates a player's entire profile in Firestore.
 * This is useful for initial setup or full profile syncs.
 * @param playerProfile The full player profile object.
 */
export const syncPlayerProfileInFirestore = async (playerProfile: PlayerProfile): Promise<void> => {
  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    // Create a db instance inside the server function to ensure it's isolated.
    const db = getFirestore(app);
    const playerDocRef = doc(db, PLAYERS_COLLECTION, playerProfile.id);
    await setDoc(playerDocRef, playerProfile, { merge: true }); // Use merge to avoid overwriting with partial data
  } catch (error) {
    console.error("Error syncing player profile to Firestore: ", error);
    // Depending on the app's needs, you might want to handle this more gracefully
    // We re-throw the error so the caller can handle it.
    throw new Error("Failed to sync profile with the server.");
  }
};


/**
 * Fetches the top players from Firestore to build the leaderboard.
 * @returns A promise that resolves to an array of LeaderboardEntry objects.
 */
export const getLeaderboardFromFirestore = async (): Promise<LeaderboardEntry[]> => {
    try {
        const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        const db = getFirestore(app);
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
