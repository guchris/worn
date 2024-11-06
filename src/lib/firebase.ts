// Firebase Imports
import { initializeApp } from "firebase/app"
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth"
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let db: Firestore;
if (typeof window !== "undefined") {
    // Only initialize Firestore with persistence in the browser
    db = initializeFirestore(app, {
        localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager() // Multi-tab offline support
        })
    });
} else {
    // Initialize Firestore without persistence for server environments
    db = initializeFirestore(app, {});
}

// Initialize Firebase Authentication
const auth = getAuth(app);

// Set session persistence for authentication in the client environment only
if (typeof window !== "undefined") {
    setPersistence(auth, browserSessionPersistence).catch((error) => {
        console.error("Failed to set session persistence:", error);
    });
}

// Initialize Firebase Storage
const storage = getStorage(app);

export { auth, db, storage };