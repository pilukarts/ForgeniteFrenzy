// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase for SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize App Check on the client-side
if (typeof window !== 'undefined') {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!),
    // Optional: set to true if you want to allow failed requests for debugging
    // while in development.
    isTokenAutoRefreshEnabled: true
  });
}


// Pass the app instance explicitly to getFirestore to ensure the correct one is used.
const db = getFirestore(app);

export { app, db };
