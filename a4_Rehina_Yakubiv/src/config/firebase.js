import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAW4NC9UBr2VSA_1rV9VDfR2FiP-oxFNi0",
    authDomain: "cpan-213-b40d1.firebaseapp.com",
    projectId: "cpan-213-b40d1",
    storageBucket: "cpan-213-b40d1.firebasestorage.app",
    messagingSenderId: "883506062899",
    appId: "1:883506062899:web:14c4f53a790e465c242546",
    measurementId: "G-GZR9PYTGDV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 