// server/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
// የአገልጋይ ፖርት (ለአካባቢያዊ ምርመራ ብቻ)
const PORT = process.env.PORT || 5000; 

// ⚠️ ማሳሰቢያ: የዳታቤዝ ግንኙነት ኮድ እዚህ ወይም ከዚህ በሚጠራ ፋይል ውስጥ መሆን አለበት!
// ለምሳሌ: require('./config/db'); // የ db.js ፋይልን መጥራት

// ======================================================
// Middleware Setup: የመግቢያ ነጥቦች ማዘጋጀት
// ======================================================

// 1. CORS: የፊት-ለፊት (Frontend) አገልጋዩ ከዚህ ጋር እንዲነጋገር ይፈቅዳል
app.use(cors()); 

// 2. JSON Parser: ከFrontend የሚመጣው ዳታ በJSON መልክ እንዲነበብ ያደርጋል
app.use(express.json()); 

// 3. Static Files: የ 'public' ፎልደርን እንደ ዋና የፊት-ለፊት ገጽ ያዘጋጃል
// ይህ መስመር Vercel ላይ በትክክል ላይሰራ ስለሚችል በvercel.json ማስተካከል ሊያስፈልግ ይችላል።
app.use(express.static(path.join(__dirname, '../public'))); 

// 4. File Access: የ 'uploads/' ፎልደር ላይ ያለውን ሚዲያ በቀጥታ ለመድረስ ያስችላል
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); 

// ======================================================
// Route Definitions: የኤፒአይ መስመሮችን ማስገባት
// ======================================================

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const financeRoutes = require('./routes/finance');

app.use('/api/auth', authRoutes);    // ምዝገባ፣ መግቢያ
app.use('/api/posts', postRoutes);   // መረጃ መለጠፍ/መመልከት
app.use('/api/finance', financeRoutes); // ገንዘብ ማስቀመጥ/ማውጣት

// ======================================================
// VERCEL REQUIRED EXPORT (ለVercel አስፈላጊው ለውጥ!)
// ======================================================
// Vercel ባህላዊውን app.listen() ስለማይጠቀም፣
// አፕሊኬሽኑን እንደ Serverless Function እንዲጠቀም መላክ አለበት።
module.exports = app;

// ======================================================
// Server Start (ለአካባቢያዊ ምርመራ/Local Testing)
// ======================================================
/*
app.listen(PORT, () => {
    console.log(`✅ Fasil App Server running on port ${PORT}`);
    console.log(`Frontend accessible at http://localhost:${PORT}/`); 
});
*/
