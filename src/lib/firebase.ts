
// Import Firebase core and required modules
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { firebaseConfig } from "./firebaseConfig";

// Function to initialize Firebase app (handles SSR and client-side)
const initializeFirebaseApp = () => {
  const apps = getApps();
  if (apps.length) {
    return getApp();
  }

  // Ensure the API key is set directly from the config
  const apiKey = firebaseConfig.apiKey;
  if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey === "SECRET_API_KEY") {
    // This will now catch the placeholder value.
    // In a real production environment, this key should be managed securely.
    console.error("Firebase API Key is not valid in firebaseConfig.ts. Please replace placeholder.");
    // We don't throw an error to allow the app to run in a degraded mode,
    // but we log a critical error.
  }

  return initializeApp(firebaseConfig);
};

// Initialize Firebase instance
const app = initializeFirebaseApp();

// Initialize App Check with reCAPTCHA v3 on the client-side only
// and only if the site key is explicitly provided in the environment.
/*
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
    // This is now an expected state in local development.
    console.warn("Firebase App Check: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. App Check will not be initialized. This is expected for local development.");
  }
}
*/

// Export Firestore instance for use in the app
const db = getFirestore(app);

export { app, db };
