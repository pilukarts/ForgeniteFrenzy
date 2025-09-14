
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { firebaseConfig } from "./firebaseConfig";

// Function to initialize Firebase
const initializeFirebaseApp = () => {
  const apps = getApps();
  if (apps.length) {
    return getApp();
  }
  
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey) {
    console.error("Firebase API Key is not set in environment variables. App will not function correctly.");
    // In a real production app, you might want to throw an error here.
    // For this prototype, we'll allow it to proceed but with a clear warning.
  }

  const config = {
    ...firebaseConfig,
    apiKey: apiKey || "YOUR_API_KEY", // Fallback to avoid crashing, but will fail auth
  };

  return initializeApp(config);
}

// Initialize Firebase for SSR/client
const app = initializeFirebaseApp();

// Initialize App Check on the client-side
if (typeof window !== 'undefined') {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (recaptchaSiteKey) {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true
      });
    } catch (error) {
      console.error("Failed to initialize Firebase App Check:", error);
    }
  } else {
    console.warn("Firebase App Check: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. App Check is not initialized.");
  }
}

// Pass the app instance explicitly to getFirestore to ensure the correct one is used.
const db = getFirestore(app);

export { app, db };
