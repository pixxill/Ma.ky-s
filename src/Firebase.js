// src/Firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore"; 
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQZEe6k0aVnf5d0S-tKM1zosdWrjJxjGM",
  authDomain: "makys-e0be3.firebaseapp.com",
  databaseURL: "https://makys-e0be3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "makys-e0be3",
  storageBucket: "makys-e0be3.appspot.com",
  messagingSenderId: "733517582583",
  appId: "1:733517582583:web:f5127b932875a553f443f2",
  measurementId: "G-LSRS5L4J64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Storage and get a reference to the service
const storage = getStorage(app);

// Initialize Firestore and get a reference to the service
const firestore = getFirestore(app);

// Initialize Realtime Database and get a reference to the service
const realtimeDb = getDatabase(app);

// Export the necessary modules for use in other files
export { auth, storage, firestore, realtimeDb };
