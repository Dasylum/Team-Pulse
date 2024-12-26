import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDHSvF2VPd6tkLk8LDn-i8WTRQ8nnc_sb8",
    authDomain: "team-pulse-c32ef.firebaseapp.com",
    projectId: "team-pulse-c32ef",
    storageBucket: "team-pulse-c32ef.firebasestorage.app",
    messagingSenderId: "329414375694",
    appId: "1:329414375694:web:61a127fdc5b12486103f5f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };