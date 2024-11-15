// Firebase Imports
import { initializeApp } from "firebase/app"
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth"
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyAfSX-SL2HlvQ2cRAdJcNg2Iy_vR9juJAE",
    authDomain: "wear-worn.firebaseapp.com",
    projectId: "wear-worn",
    storageBucket: "wear-worn.appspot.com",
    messagingSenderId: "576327544648",
    appId: "1:576327544648:web:5e955933a64641602b0d7d",
    measurementId: "G-CRM9KTNV9K"
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