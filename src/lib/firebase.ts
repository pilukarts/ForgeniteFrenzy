
// Import Firebase core and required modules
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from "./firebaseConfig";

// Function to initialize Firebase app (handles SSR and client-side)
const initializeFirebaseApp = () => {
  const apps = getApps();
  if (apps.length) {
    return getApp();
  }

  // Ensure the API key is set directly from the config
  const apiKey = firebaseConfig.apiKey;
  if (!apiKey || apiKey.includes("AIzaSy") === false) {
    // This will now catch placeholder or invalid values.
    // In a real production environment, this key should be managed securely.
    console.warn("Firebase API Key may not be valid in firebaseConfig.ts.");
    // We don't throw an error to allow the app to run in a degraded mode,
    // but we log a warning.
  }

  return initializeApp(firebaseConfig);
};

// Initialize Firebase instance
const app = initializeFirebaseApp();

// Export Firestore instance for use in the app
const db = getFirestore(app);

export { app, db };
