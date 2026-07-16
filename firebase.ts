import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPud-Ln27NJ_S0SLPej2gq3rEXfq0tL5g",
  authDomain: "volerapay.firebaseapp.com",
  projectId: "volerapay",
  storageBucket: "volerapay.firebasestorage.app",
  messagingSenderId: "164299246738",
  appId: "1:164299246738:web:317739cee1043e2e426a4b",
  measurementId: "G-3PHTFE4T6V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Safe Analytics Initialization for iFrame environments
export let analytics: any = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized successfully.");
  } else {
    console.warn("Firebase Analytics is not supported in this environment.");
  }
}).catch((err) => {
  console.error("Error checking Firebase Analytics support:", err);
});

export default app;
