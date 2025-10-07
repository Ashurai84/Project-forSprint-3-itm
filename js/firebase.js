// Firebase initializer — reads config from environment variables
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Default config provided — fall back to env vars if present
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyBigpJFwHozNSwlIstZxwuWm_JbRQImmEY',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'itmskilsuni.firebaseapp.com',
  databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://itmskilsuni-default-rtdb.firebaseio.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'itmskilsuni',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'itmskilsuni.firebasestorage.app',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '164897587765',
  appId: process.env.FIREBASE_APP_ID || '1:164897587765:web:e0beb8c5dbbbbb4c00a77c',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'G-K0M0YVW124',
};

const app = initializeApp(firebaseConfig);
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // Analytics may fail in non-browser environments; ignore silently
}
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics };
