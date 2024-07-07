// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgOQJYb4HtrhPyU0OIF04Eh2RGfyVSS50",
    authDomain: "voting-on-block-chain.firebaseapp.com",
    projectId: "voting-on-block-chain",
    storageBucket: "voting-on-block-chain.appspot.com",
    messagingSenderId: "574023024458",
    appId: "1:574023024458:web:fe0a14d06bf5d5945b4bb3",
    measurementId: "G-9406XFWSHK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword, signOut };
