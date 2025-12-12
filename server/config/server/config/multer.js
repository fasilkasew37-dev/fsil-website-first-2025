// server/config/multer.js

const multer = require('multer');
const path = require('path');

// የፋይል ማስቀመጫ ቦታ ማዘጋጀት
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // የገባው ፋይል የት እንደሚቀመጥ ይወስናል
        // ለፕሮፋይል ፎቶዎች 'profile_photos'፣ ለፖስቶች 'posts'
        if (req.url.includes('signup') || req.url.includes('profile')) {
            cb(null, path.join(__dirname, '../../uploads/profile_photos'));
        } else {
            cb(null, path.join(__dirname, '../../uploads/posts'));
        }
    },
    filename: (req, file, cb) => {
        // የፋይሉን ስም ልዩ እንዲሆን ያደርጋል
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
