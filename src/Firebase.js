// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import the authentication module
import { getAnalytics } from "firebase/analytics";

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
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
