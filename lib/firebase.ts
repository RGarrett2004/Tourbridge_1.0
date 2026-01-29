
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLMnYbPQPx0gtXHFkzp99AmsSU9u5AJU8",
  authDomain: "tourbridge-f16bd.firebaseapp.com",
  databaseURL: "https://tourbridge-f16bd-default-rtdb.firebaseio.com",
  projectId: "tourbridge-f16bd",
  storageBucket: "tourbridge-f16bd.firebasestorage.app",
  messagingSenderId: "5160357163",
  appId: "1:5160357163:web:0cf43566dff6907020096e",
  measurementId: "G-37DRKGRNH6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut };
