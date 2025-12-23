import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWS8PJ0kmu56hixesxV1KrMH8NRciH6U0",
  authDomain: "fasil-web-app-3a732.firebaseapp.com",
  projectId: "fasil-web-app-3a732",
  storageBucket: "fasil-web-app-3a732.firebasestorage.app",
  messagingSenderId: "239133072986",
  appId: "1:239133072986:web:0dcbd768e1e916b9b64263"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ምልክቷ እንዳትጠፋ በየሰከንዱ የሚያድስ ኮድ
setInterval(() => {
  onSnapshot(doc(db, ".info/connected"), (snap) => {
    const headTxt = document.getElementById('head-txt'); 
    if (headTxt) {
      const isOnline = snap.data()?.connected === true;
      headTxt.innerHTML = (isOnline ? "🟢 Online" : "🔴 Offline") + " - እንኳን ወደ ፋሲል ዌብ አፕ በደህና መጡ!";
      headTxt.style.color = isOnline ? "#28a745" : "#dc3545";
      headTxt.style.display = "inline-block"; // እንዲታይ ያስገድደዋል
    }
  });
}, 1000);
