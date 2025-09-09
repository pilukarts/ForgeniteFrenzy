
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import type { PlayerProfile } from './types';
import { firebaseConfig } from "./firebaseConfig";

// This file is intended for client-side use.
// It initializes Firebase and provides a function to sync the player profile.

// Initialize Firebase for client-side usage, ensuring it's only done once.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

/**
 * Creates or updates a player's entire profile in Firestore.
 * This is designed to be called from the client-side, typically within the GameContext.
 * @param playerProfile The full player profile object.
 */
export const syncPlayerProfileInFirestore = async (playerProfile: PlayerProfile): Promise<void> => {
  if (!playerProfile || !playerProfile.id) {
    console.error("Invalid player profile or missing ID. Sync aborted.");
    throw new Error("Invalid player profile provided for sync.");
  }
  
  try {
    const playerDocRef = doc(db, 'players', playerProfile.id);
    await setDoc(playerDocRef, playerProfile, { merge: true });
  } catch (error) {
    console.error("Error syncing player profile to Firestore: ", error);
    // Re-throwing the error so the calling function can handle it, e.g., by showing a toast to the user.
    throw new Error("Failed to sync profile with the server.");
  }
};
