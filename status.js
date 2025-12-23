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

onSnapshot(doc(db, ".info/connected"), (snap) => {
  const header = document.querySelector('.marquee-text-top'); 
  if (header) {
    let statusIcon = snap.data()?.connected === true ? "🟢" : "🔴";
    header.innerHTML = statusIcon + " Online - እንኳን ወደ ፋሲል ዌብ አፕ በደህና መጡ!";
  }
});
