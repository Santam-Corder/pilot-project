// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDnBBg3zMY1OJ9T_s52JtcR1BhvwaVr2SI",
    authDomain: "santam-dashboard-78b20.firebaseapp.com",
    projectId: "santam-dashboard-78b20",
    storageBucket: "santam-dashboard-78b20.firebasestorage.app",
    messagingSenderId: "861503709218",
    appId: "1:861503709218:web:adc444e649608f93e0aa7b",
    measurementId: "G-B4CN8Q99DM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for other files to use
export { db, storage };
