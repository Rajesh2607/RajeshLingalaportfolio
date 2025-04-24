import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDHeL8xUPTw7aSA1RYjbJHTHQIg8vkoWvA",
  authDomain: "myprofolio-34d7c.firebaseapp.com",
  projectId: "myprofolio-34d7c",
  storageBucket: "myprofolio-34d7c.firebasestorage.app",
  messagingSenderId: "148936989735",
  appId: "1:148936989735:web:6869df5df6f8c6a619c202",
  measurementId: "G-WXY64R9LG6"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

