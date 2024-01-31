// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5tye3DOaf7bO4wvV11KBDS_FGAq-1pBg",
  authDomain: "socialmedia-b085a.firebaseapp.com",
  projectId: "socialmedia-b085a",
  storageBucket: "socialmedia-b085a.appspot.com",
  messagingSenderId: "704343601905",
  appId: "1:704343601905:web:d36dcab34c0c5b8b48af50",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
