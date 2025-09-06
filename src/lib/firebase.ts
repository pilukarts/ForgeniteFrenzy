// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase for SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// Pass the app instance explicitly to getFirestore to ensure the correct one is used.
const db = getFirestore(app);

export { app, db };
