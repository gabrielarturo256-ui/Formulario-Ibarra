import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-analytics.js";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBByYrudBuW2kKHcp0_xaWRD6GGfWHPPzk",
  authDomain: "formulario-apex.firebaseapp.com",
  databaseURL: "https://formulario-apex-default-rtdb.firebaseio.com",
  projectId: "formulario-apex",
  storageBucket: "formulario-apex.firebasestorage.app",
  messagingSenderId: "19766461307",
  appId: "1:19766461307:web:6a5cbd4a7c28043b87b3de",
  measurementId: "G-HTCGQVQ59Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
