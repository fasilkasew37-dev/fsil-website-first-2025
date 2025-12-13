const express = require('express');
const router = express.Router();

router.post('/transaction', (req, res) => {
    const { phone, amount, type, password } = req.body; // Password for withdrawal logic
    const user = global.users.find(u => u.phone === phone);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (type === 'deposit') {
        user.balance += parseFloat(amount);
        res.json({ message: "ተቀማጭ ተደርጓል", balance: user.balance });
    } else if (type === 'withdraw') {
        // Simple password check for withdraw
        if (user.password !== password) return res.status(400).json({message: "የይለፍ ቃል ስህተት ነው"});
        
        if (user.balance >= amount) {
            user.balance -= parseFloat(amount);
            res.json({ message: "ገንዘብ ወጪ ሆኗል", balance: user.balance });
        } else {
            res.status(400).json({ message: "በቂ ቀሪ ሂሳብ የለም" });
        }
    }
});

module.exports = router;
