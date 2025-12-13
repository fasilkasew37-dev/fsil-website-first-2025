const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // Serve uploads

// Mock Database (In-Memory for simplicity)
global.users = []; 
global.posts = [];
global.messages = [];

// Routes
const authRoutes = require('./server/routes/auth');
const postRoutes = require('./server/routes/post');
const financeRoutes = require('./server/routes/finance');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/finance', financeRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
