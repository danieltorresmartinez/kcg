import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBScv8yH2K7xWULjcGq2SviH8RqJ4wfPeE",
  authDomain: "kcg-ordenes.firebaseapp.com",
  projectId: "kcg-ordenes",
  storageBucket: "kcg-ordenes.firebasestorage.app",
  messagingSenderId: "504817726691",
  appId: "1:504817726691:web:808fefa746dfe284b601d6",
  measurementId: "G-E66LEW6GXQ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
