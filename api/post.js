import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 1. የልጥፎች ሰንጠረዥ (Posts Table) መፍጠር
        // ሰንጠረዡ ከሌለ ብቻ ይፈጥራል (Idempotent)
        await sql`
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                post_type VARCHAR(50) NOT NULL,
                title VARCHAR(255),
                content TEXT,
                media_path TEXT,
                user_phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        const { postType, title, content, mediaPath, userPhone } = req.body;

        // 2. አዲስ ልጥፍ ወደ ዳታቤዝ ማስገባት
        await sql`
            INSERT INTO posts (post_type, title, content, media_path, user_phone)
            VALUES (${postType}, ${title || null}, ${content || null}, ${mediaPath || null}, ${userPhone || null});
        `;

        return res.status(200).json({ 
            success: true, 
            message: 'ልጥፉ በተሳካ ሁኔታ ወደ Postgres ዳታቤዝ ተመዝግቧል (Backend V3)'
        });

    } catch (error) {
        console.error('Postgres error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'ልጥፉን ወደ ዳታቤዝ በማስገባት ላይ ችግር ተፈጥሯል::',
            error: error.message 
        });
    }
}
