// server/routes/posts.js

const express = require('express');
const router = express.Router();
// ፋይሎችን ለመስቀል የሚያገለግል (Multer)
const upload = require('../config/multer'); 

// ======================================================
// 1. ጽሑፍ መለጠፍ (Post Text)
// URL: POST /api/posts/text
// ======================================================
router.post('/text', (req, res) => {
    // 💡 የተጠቃሚው Token ተረጋግጦ ይገባል
    const { title, content } = req.body;
    
    // የጽሑፉን መረጃ ወደ ዳታቤዝ ማስገባት
    res.status(201).json({
        success: true,
        message: "✅ ጽሑፉ በተሳካ ሁኔታ ተለጥፏል።",
        post: { id: Date.now(), title, content, type: 'text' }
    });
});

// ======================================================
// 2. ምስል/ፎቶ መለጠፍ (Post Image)
// URL: POST /api/posts/image
// ======================================================
// 'upload.single('imageFile')' ማለት አንድ ፋይል 'imageFile' በሚል ስም እንጠብቃለን ማለት ነው።
router.post('/image', upload.single('imageFile'), (req, res) => {
    // 💡 የተጠቃሚው Token ተረጋግጦ ይገባል
    if (!req.file) {
        return res.status(400).json({ success: false, message: "ምስል አልተሰቀለም።" });
    }

    const { title } = req.body;
    const imageUrl = `/uploads/posts/${req.file.filename}`; // ፋይሉ የተቀመጠበት መንገድ
    
    // የምስሉን መንገድ እና ርዕስ ወደ ዳታቤዝ ማስገባት
    res.status(201).json({
        success: true,
        message: "✅ ምስሉ በተሳካ ሁኔታ ተለጥፏል።",
        post: { id: Date.now(), title, imageUrl, type: 'image' }
    });
});

// ======================================================
// 3. መረጃ መመልከት (View Posts - All Types)
// URL: GET /api/posts/view/:type
// ======================================================
router.get('/view/:type', (req, res) => {
    const postType = req.params.type; // text, image, or audio
    
    // 💡 ከዳታቤዝ ውስጥ የተፈለገውን አይነት ፖስት መጥራት
    let dummyPosts = [];

    if (postType === 'text') {
        dummyPosts = [
            { id: 101, title: "የመጀመሪያ ጽሑፍ", content: "ይህ መረጃ ከኤፒአይ የመጣ ነው።" }
        ];
    } else if (postType === 'image') {
         dummyPosts = [
            { id: 102, title: "የመጀመሪያ ምስል", imageUrl: "/uploads/dummy_image.jpg" }
        ];
    }
    
    res.status(200).json({
        success: true,
        posts: dummyPosts
    });
});


module.exports = router;
