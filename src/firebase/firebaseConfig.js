import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC4Y4iFx3lpxBRpynoJap9P-g9zb9bEKvE",
    authDomain: "winsizerjob.firebaseapp.com",
    projectId: "winsizerjob",
    storageBucket: "winsizerjob.firebasestorage.app",
    messagingSenderId: "212012877098",
    appId: "1:212012877098:web:8b02125a88bf4bae8f8a53",
    measurementId: "G-3F159RNQEP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
