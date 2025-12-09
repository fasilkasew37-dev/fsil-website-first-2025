// api/post.js (የተስተካከለ ለ DATABASEURL)
import { sql } from '@vercel/postgres';

// የDATABASEURL ስም እንዲጠቀም ተስተካክሏል
const connectionString = process.env.DATABASEURL; 

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    if (!connectionString) {
        // የEnvironment Variable ከሌለ የሚመጣ መልዕክት
        return res.status(500).json({ error: 'Database connection URL (DATABASEURL) is missing in Vercel.' });
    }

    try {
        const { postContent } = req.body;

        if (!postContent) {
            return res.status(400).json({ error: 'Post content is required.' });
        }

        // መረጃውን ወደ posts ቴብል አስገባ
        await sql`
          INSERT INTO posts (content, created_at)
          VALUES (${postContent}, NOW());
        `;
        
        return res.status(200).json({ 
            message: 'Post saved successfully to database.', 
        });

    } catch (error) {
        console.error("Database or Server Error:", error);
        return res.status(500).json({ 
            error: 'Failed to save post due to server error. Check database table and Vercel logs.', 
            details: error.message 
        });
    }
}
