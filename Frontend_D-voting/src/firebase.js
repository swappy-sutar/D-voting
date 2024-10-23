
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyByIuA_uC2oGWYC9QToL6ke7RvbVF8sTsg",
  authDomain: "d-voting-e88f0.firebaseapp.com",
  projectId: "d-voting-e88f0",
  storageBucket: "d-voting-e88f0.appspot.com",
  messagingSenderId: "743431811684",
  appId: "1:743431811684:web:71fceb8fe6cf6979a6e571",
  measurementId: "G-0M3YYFSH27"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
