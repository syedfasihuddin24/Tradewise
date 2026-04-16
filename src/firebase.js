// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqWYxRk2vSuoZj5hfMUffXpOnOAuZhku0",
  authDomain: "tradewise-f7b59.firebaseapp.com",
  projectId: "tradewise-f7b59",
  storageBucket: "tradewise-f7b59.firebasestorage.app",
  messagingSenderId: "271323544637",
  appId: "1:271323544637:web:8b3cd730f0396f9b3afe54",
  measurementId: "G-4QN9DPKTQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);