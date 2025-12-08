// በ GitHub ላይ ወደ api/post-text.js ያስቀምጡት

import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { title, content, userPhone } = request.body;

    if (!title || !content || !userPhone) {
      return response.status(400).json({ error: 'Missing required fields' });
    }

    // የ Posts table መኖሩን ያረጋግጣል
    await sql`
      CREATE TABLE IF NOT EXISTS Posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        posted_by VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // ጽሑፉን ወደ ዳታቤዝ ማስገባት
    const result = await sql`
      INSERT INTO Posts (title, content, type, posted_by)
      VALUES (${title}, ${content}, 'text', ${userPhone})
      RETURNING id, title;
    `;

    return response.status(201).json({ 
        message: 'Text posted successfully!',
        postId: result.rows[0].id,
    });
    
  } catch (error) {
    console.error('Database Error:', error);
    return response.status(500).json({ error: 'Failed to post text due to server error.' });
  }
}
