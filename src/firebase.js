// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdHStpAlnh9EHYKkC46_38Jno8XGftgCw",
  authDomain: "aistudyhelper-88c23.firebaseapp.com",
  projectId: "aistudyhelper-88c23",
  storageBucket: "aistudyhelper-88c23.firebasestorage.app",
  messagingSenderId: "63150194827",
  appId: "1:63150194827:web:86f729edde64ea16a8948e",
  measurementId: "G-MY3Y509Z8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);