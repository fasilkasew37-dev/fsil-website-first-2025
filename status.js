import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ያንተ የግል ፋየርቤዝ መረጃ (Config)
const firebaseConfig = {
  apiKey: "AIzaSyAWS8PJ0kmu56hixesxV1KrMH8NRciH6U0",
  authDomain: "fasil-web-app-3a732.firebaseapp.com",
  projectId: "fasil-web-app-3a732",
  storageBucket: "fasil-web-app-3a732.firebasestorage.app",
  messagingSenderId: "239133072986",
  appId: "1:239133072986:web:0dcbd768e1e916b9b64263"
};

// ፋየርቤዝን ማስጀመር
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ምልክቷን ቋሚ (Real-time) የሚያደርግ ኮድ
const updateStatus = () => {
  // በ index.html ውስጥ 'online-status' የሚል ID ያለው ቦታ መኖሩን ያረጋግጣል
  const statusElement = document.getElementById('online-status');

  onSnapshot(doc(db, ".info/connected"), (snap) => {
    if (statusElement) {
      if (snap.data()?.connected === true) {
        // ኢንተርኔት ካለ አረንጓዴ ቋሚ ምልክት
        statusElement.innerHTML = "● Online";
        statusElement.style.color = "#28a745"; // አረንጓዴ ቀለም
        statusElement.style.fontWeight = "bold";
      } else {
        // ኢንተርኔት ከጠፋ ቀይ ቋሚ ምልክት
        statusElement.innerHTML = "● Offline";
        statusElement.style.color = "#dc3545"; // ቀይ ቀለም
        statusElement.style.fontWeight = "bold";
      }
    }
  });
};

// ገጹ ሲከፈት ስራውን ይጀምራል
window.addEventListener('DOMContentLoaded', updateStatus);
