const express = require('express');
const router = express.Router();
const multer = require('../config/multer');

// Create Post
router.post('/create', multer.single('file'), (req, res) => {
    const { title, type, uploader } = req.body; // uploader is phone
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const content = req.body.content || "";

    const user = global.users.find(u => u.phone === uploader);
    
    const newPost = {
        id: Date.now(),
        title, type, content, fileUrl,
        uploaderName: user ? user.name : "Unknown",
        uploaderPhone: uploader,
        comments: []
    };
    global.posts.push(newPost);
    res.json({ message: "ተለጥፏል" });
});

// Get Posts
router.get('/', (req, res) => {
    res.json(global.posts);
});

// Add Comment (Text, Audio, Video, Image)
router.post('/comment', multer.single('file'), (req, res) => {
    const { postId, type, content, commenter } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const post = global.posts.find(p => p.id == postId);
    if (post) {
        post.comments.push({
            type,
            content: content || "",
            fileUrl,
            commenter,
            date: new Date()
        });
        res.json({ message: "አስተያየት ተሰጥቷል" });
    } else {
        res.status(404).json({ message: "ልጥፉ አልተገኘም" });
    }
});

module.exports = router;
