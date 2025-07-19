// src/firebase.js

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator
} from 'firebase/auth';
import {
  getFirestore,
  connectFirestoreEmulator,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';

// ✅ Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// 🚀 Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 🔐 Auth & Firestore Instances
const auth = getAuth(app);
const db = getFirestore(app);

// 🔄 Connect Emulators (only if .env flag is set)
if (process.env.REACT_APP_FIREBASE_EMULATOR === 'true') {
  console.warn('🔥 Firebase emulator mode enabled.');
  if (!auth.emulatorConfig) {
    connectAuthEmulator(auth, 'http://localhost:9099');
  }
  connectFirestoreEmulator(db, 'localhost', 8080);
}

// 🌐 Export everything needed
export {
  app,
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc
};
