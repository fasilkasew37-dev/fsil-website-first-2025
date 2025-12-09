// post.js
// -------------------------------------------------------------------------
// This function handles POST requests to save data to the Neon PostgreSQL database.

// @vercel/postgres ላይብረሪውን እንጠራለን
import { sql } from '@vercel/postgres';

// Vercel Serverless Function የሚሆን Handler
export default async function handler(req, res) {
    // ጥያቄው POST ካልሆነ፣ ስህተት መልሰን እንዘጋለን
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    try {
        // ከጥያቄው አካል (Body) ላይ 'postContent' የሚለውን ጽሑፍ እንቀበላለን
        const { postContent } = req.body;

        if (!postContent) {
            return res.status(400).json({ error: 'Post content is required.' });
        }

        // 1. የዳታቤዝ ግንኙነቱን እንፈጥራለን
        // የPOSTGRES_URL environment variable እዚህ ጋር በራስ-ሰር ይነበባል።

        // 2. ዳታውን ወደ 'posts' ቴብል እናስገባለን (INSERT)
        // postContent እና አሁን ያለውን ቀንና ሰዓት እናስገባለን
        const result = await sql`
          INSERT INTO posts (content, created_at)
          VALUES (${postContent}, NOW());
        `;
        
        // በተሳካ ሁኔታ ሲጠናቀቅ ለደንበኛው (Frontend) መልስ እንልካለን
        return res.status(200).json({ 
            message: 'Post saved successfully to database.', 
            data: result 
        });

    } catch (error) {
        // ማንኛውም የNetwork ወይም SQL ስህተት ሲፈጠር እዚህ ጋር ይያዛል።
        console.error("Database or Server Error:", error);
        return res.status(500).json({ 
            error: 'Failed to save post due to server error.', 
            details: error.message 
        });
    }
}
