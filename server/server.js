// server/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
// የአገልጋይ ፖርት፣ በሌላ ቦታ ካልተሰጠ 5000ን ይጠቀማል
const PORT = process.env.PORT || 5000; 

// ======================================================
// Middleware Setup: የመግቢያ ነጥቦች ማዘጋጀት
// ======================================================

// 1. CORS: የፊት-ለፊት (Frontend) አገልጋዩ ከዚህ ጋር እንዲነጋገር ይፈቅዳል
app.use(cors()); 

// 2. JSON Parser: ከFrontend የሚመጣው ዳታ በJSON መልክ እንዲነበብ ያደርጋል
app.use(express.json()); 

// 3. Static Files: የ 'public' ፎልደርን እንደ ዋና የፊት-ለፊት ገጽ ያዘጋጃል
// ይህ ማለት public/index.html ን በቀጥታ ያሳያል
app.use(express.static(path.join(__dirname, '../public'))); 

// 4. File Access: የ 'uploads/' ፎልደር ላይ ያለውን ሚዲያ በቀጥታ ለመድረስ ያስችላል
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); 

// ======================================================
// Route Definitions: የኤፒአይ መስመሮችን ማስገባት
// ======================================================
// ማስታወሻ: እነዚህን ፋይሎች ቀጥሎ እንፈጥራለን
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const financeRoutes = require('./routes/finance');

app.use('/api/auth', authRoutes);    // ምዝገባ፣ መግቢያ፣ የይለፍ ቃል
app.use('/api/posts', postRoutes);   // መረጃ መለጠፍ/መመልከት
app.use('/api/finance', financeRoutes); // ገንዘብ ማስቀመጥ/ማውጣት

// ======================================================
// Server Start
// ======================================================
app.listen(PORT, () => {
    console.log(`✅ Fasil App Server running on port ${PORT}`);
    console.log(`Frontend accessible at http://localhost:${PORT}/`); 
    console.log(`API test route at http://localhost:${PORT}/api/auth`); 
});
