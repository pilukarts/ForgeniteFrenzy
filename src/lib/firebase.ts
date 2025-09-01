// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMdkst7F612rqEyu0iF86CaYOdJGBXPaw",
  authDomain: "ark-evac.firebaseapp.com",
  projectId: "ark-evac",
  storageBucket: "ark-evac.firebasestorage.app",
  messagingSenderId: "928400685620",
  appId: "1:928400685620:web:630f671a2fdaa4449b6861"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
