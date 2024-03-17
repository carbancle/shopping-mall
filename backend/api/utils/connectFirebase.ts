import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCI8ePQlchq3hdNFd-ITZ-Te7KWB52HlyE",
  authDomain: "clone-b3001.firebaseapp.com",
  projectId: "clone-b3001",
  storageBucket: "clone-b3001.appspot.com",
  messagingSenderId: "541263844990",
  appId: "1:541263844990:web:d7fa8ae4270273b4002a2f",
  measurementId: "G-0XPXHSKW8D",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
