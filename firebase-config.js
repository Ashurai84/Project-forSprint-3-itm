// Firebase configuration - shared across all pages
export const firebaseConfig = {
    apiKey: "AIzaSyBigpJFwHozNSwlIstZxwuWm_JbRQImmEY",
    authDomain: "itmskilsuni.firebaseapp.com",
    databaseURL: "https://itmskilsuni-default-rtdb.firebaseio.com",
    projectId: "itmskilsuni",
    storageBucket: "itmskilsuni.firebasestorage.app",
    messagingSenderId: "164897587765",
    appId: "1:164897587765:web:e0beb8c5dbbbbb4c00a77c",
    measurementId: "G-K0M0YVW124"
};

// Firebase CDN URLs - using version 10.7.1
export const FIREBASE_SDK_VERSION = '10.7.1';
export const FIREBASE_CDN_BASE = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;

export const FIREBASE_IMPORTS = {
    app: `${FIREBASE_CDN_BASE}/firebase-app.js`,
    auth: `${FIREBASE_CDN_BASE}/firebase-auth.js`,
    firestore: `${FIREBASE_CDN_BASE}/firebase-firestore.js`,
    database: `${FIREBASE_CDN_BASE}/firebase-database.js`,
    storage: `${FIREBASE_CDN_BASE}/firebase-storage.js`
};

// Common Firebase initialization
export async function initializeFirebaseApp() {
    const { initializeApp } = await import(FIREBASE_IMPORTS.app);
    return initializeApp(firebaseConfig);
}

// Common authentication helpers
export async function initializeAuth() {
    const { getAuth } = await import(FIREBASE_IMPORTS.auth);
    const app = await initializeFirebaseApp();
    return getAuth(app);
}

// Common Firestore helpers
export async function initializeFirestore() {
    const { getFirestore } = await import(FIREBASE_IMPORTS.firestore);
    const app = await initializeFirebaseApp();
    return getFirestore(app);
}

// Utility functions
export function getCurrentYear() {
    return new Date().getFullYear();
}

export function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}