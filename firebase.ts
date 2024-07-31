// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhZh48CLF5pWkCPCDw408qJVGi7kdZ0CU",
  authDomain: "pantry-tacker.firebaseapp.com",
  projectId: "pantry-tacker",
  storageBucket: "pantry-tacker.appspot.com",
  messagingSenderId: "298690306309",
  appId: "1:298690306309:web:4da623ccfd0808ba9fd76c",
  measurementId: "G-0Z6KPCJG44",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app, firestore };
