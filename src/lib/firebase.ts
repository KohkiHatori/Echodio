// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCI-VKCpuueLvOgQeR2Ow9l2EVLr4K_gAM",
  authDomain: "soratooto-5d6c0.firebaseapp.com",
  projectId: "soratooto-5d6c0",
  storageBucket: "soratooto-5d6c0.firebasestorage.app",
  messagingSenderId: "471538752920",
  appId: "1:471538752920:web:69e13ff98962d79e1d5fed",
  measurementId: "G-070VZ4TKXD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };