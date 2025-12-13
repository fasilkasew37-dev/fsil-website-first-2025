const express = require('express');
const router = express.Router();
const multer = require('../config/multer');

router.post('/signup', multer.single('profilePhoto'), (req, res) => {
    const { name, phone, email, password } = req.body;
    const profilePhoto = req.file ? `/uploads/${req.file.filename}` : null;

    // Validation: Check if Phone OR Email exists
    const exists = global.users.find(u => u.phone === phone || u.email === email);
    if (exists) {
        return res.status(400).json({ message: "በዚህ ስልክ ቁጥር ወይም ኢሜል ተመዝግበዋል! እባክዎ ይግቡ።" });
    }

    const newUser = { id: Date.now(), name, phone, email, password, profilePhoto, balance: 0 };
    global.users.push(newUser);
    res.json({ message: "ምዝገባ ተሳክቷል!", user: newUser });
});

router.post('/login', (req, res) => {
    const { phone, password } = req.body;
    const user = global.users.find(u => u.phone === phone && u.password === password);
    
    if (user) res.json({ message: "እንኳን ደህና መጡ", user });
    else res.status(400).json({ message: "ስልክ ወይም ፓስወርድ ስህተት ነው" });
});

router.get('/users', (req, res) => {
    res.json(global.users.map(u => ({ id: u.id, name: u.name, phone: u.phone, profilePhoto: u.profilePhoto })));
});

module.exports = router;
