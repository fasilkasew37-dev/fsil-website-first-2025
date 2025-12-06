import { MongoClient } from 'mongodb';

// MONGODB_URI በVercel Environment Variables ውስጥ መዘጋጀቱን ያረጋግጣል
const uri = process.env.MONGODB_URI; 

if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
}

const client = new MongoClient(uri);

// Vercel Serverless Function ነው
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        // የመግቢያ ጥያቄው POST መሆን አለበት
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        await client.connect();
        const database = client.db('FasilWebAppDB');
        const users = database.collection('users');

        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ success: false, message: 'እባክዎ ስልክ ቁጥር እና የይለፍ ቃል ያስገቡ።' });
        }

        // ተጠቃሚውን በስልክ ቁጥር እና በፓስወርድ ከዳታቤዝ ይፈልጋል
        const user = await users.findOne({ phone, password });

        if (user) {
            // መግባት ከተሳካ፣ የመግቢያ tier (free ወይም premium) ተመልሶ ይላካል
            res.status(200).json({ 
                success: true, 
                message: 'መግባት ተሳክቷል!', 
                tier: user.tier || 'free' // tier ከሌለ free ተብሎ ይወሰዳል
            });
        } else {
            // መረጃው ካልተገኘ ወይም የተሳሳተ ከሆነ
            res.status(401).json({ success: false, message: 'ስልክ ቁጥር ወይም የይለፍ ቃልዎ ትክክል አይደለም።' });
        }

    } catch (error) {
        console.error('Log-In Error:', error);
        res.status(500).json({ success: false, message: 'የመግቢያ ስህተት ተፈጥሯል።' });
    } finally {
        // ግንኙነቱን ይዘጋል
        await client.close();
    }
}
