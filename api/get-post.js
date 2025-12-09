// api/get-posts.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
    }
    
    try {
        // መረጃውን ከ posts ቴብል አውጣ (ከአዲሱ ወደ አንጋፋው አስተካክል)
        const { rows } = await sql`SELECT id, content, created_at FROM posts ORDER BY created_at DESC;`;
        
        return res.status(200).json({ posts: rows });

    } catch (error) {
        console.error("Database or Server Error:", error);
        return res.status(500).json({ 
            error: 'Failed to fetch posts due to server error.', 
            details: error.message 
        });
    }
}
