import { initializeApp } from 'firebase/app';
import { initializeFirestore, setLogLevel } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD9zX9MCzN9Tdmky45wgQN1yiutzgVnkLg",
  authDomain: "krypton-ai-core.firebaseapp.com",
  projectId: "krypton-ai-core",
  storageBucket: "krypton-ai-core.firebasestorage.app",
  messagingSenderId: "764187835435",
  appId: "1:764187835435:web:dea45e114e6a94387dfe6e",
  measurementId: "G-8X5B5KYBEM"
};

const app = initializeApp(firebaseConfig);

// Set verbose Firestore logs to silent
setLogLevel('silent');

// Enable long polling to prevent idle stream disconnections in sandboxed environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const auth = getAuth(app);
