
'use server';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import type { PlayerProfile } from './types';
import { firebaseConfig } from "./firebaseConfig";

const PLAYERS_COLLECTION = 'players';

const getDb = () => {
    // This function ensures that we initialize Firebase only once.
    return getFirestore(getApps().length === 0 ? initializeApp(firebaseConfig) : getApp());
}

/**
 * Creates or updates a player's entire profile in Firestore.
 * This is a server action and should only be called from server components or other server actions.
 * @param playerProfile The full player profile object.
 */
export const syncPlayerProfileInFirestore = async (playerProfile: PlayerProfile): Promise<void> => {
  try {
    const db = getDb();
    const playerDocRef = doc(db, PLAYERS_COLLECTION, playerProfile.id);
    await setDoc(playerDocRef, playerProfile, { merge: true });
  } catch (error) {
    console.error("Error syncing player profile to Firestore: ", error);
    // Re-throwing the error so the calling function can handle it, e.g., by showing a toast to the user.
    throw new Error("Failed to sync profile with the server.");
  }
};
