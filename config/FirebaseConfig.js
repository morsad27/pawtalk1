// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pet-adpot.firebaseapp.com",
  projectId: "pet-adpot",
  storageBucket: "pet-adpot.appspot.com",
  messagingSenderId: "530151740409",
  appId: "1:530151740409:web:47eb97da9e909bc0d16328",
  measurementId: "G-GGNWPTY9ZW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
export const storage=getStorage(app);
// const analytics = getAnalytics(app);