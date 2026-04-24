import { initializeApp } from 'firebase/app';
import { initializeFirestore, setLogLevel } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCVM_0lHTDJuJt-snYxWeE-_csykE4-cwM",
  authDomain: "krypton-ai-490214.firebaseapp.com",
  projectId: "krypton-ai-490214",
  storageBucket: "krypton-ai-490214.firebasestorage.app",
  messagingSenderId: "1042528571231",
  appId: "1:1042528571231:web:2e173c75677a18868670ea"
};

const app = initializeApp(firebaseConfig);

// Set verbose Firestore logs to silent
setLogLevel('silent');

// Enable long polling to prevent idle stream disconnections in sandboxed environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export const auth = getAuth(app);
