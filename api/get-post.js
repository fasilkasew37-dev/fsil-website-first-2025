// api/get-posts.js (የተስተካከለ ለ DATABASEURL)
import { sql } from '@vercel/postgres';

// የDATABASEURL ስም እንዲጠቀም ተስተካክሏል
const connectionString = process.env.DATABASEURL; 

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
    }

    if (!connectionString) {
        // የEnvironment Variable ከሌለ የሚመጣ መልዕክት
        return res.status(500).json({ error: 'Database connection URL (DATABASEURL) is missing in Vercel.' });
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
