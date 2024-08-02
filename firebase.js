// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAc4T4U_skVnguj5v-kjL9J_1JZS_iArdg",
  authDomain: "inventory-management-app-b09b6.firebaseapp.com",
  projectId: "inventory-management-app-b09b6",
  storageBucket: "inventory-management-app-b09b6.appspot.com",
  messagingSenderId: "408499384173",
  appId: "1:408499384173:web:08e3fa897d075fe36fb464",
  measurementId: "G-SC53H3F4F2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };