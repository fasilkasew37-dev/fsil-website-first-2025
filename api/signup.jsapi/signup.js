import { MongoClient } from 'mongodb';

// ይህን ኮድ ከማስኬድዎ በፊት በVercel ላይ MONGODB_URI የሚባል Environment Variable ማዘጋጀትዎን ያረጋግጡ።
const uri = process.env.MONGODB_URI; 

if (!uri) {
    // ይህ ስህተት የሚፈጠረው MONGODB_URI በ Vercel Environment Variables ውስጥ ካልተቀመጠ ነው።
    throw new Error('MONGODB_URI is not defined in environment variables.');
}

const client = new MongoClient(uri);

// Vercel Serverless Function ነው
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        // የምዝገባ ጥያቄው POST መሆን አለበት
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        await client.connect();
        const database = client.db('FasilWebAppDB'); 
        const users = database.collection('users');

        const { phone, email, password } = req.body;
        
        // የግዴታ መረጃዎች መኖራቸውን እና የፓስወርዱ ርዝመት 6 መሆኑን ያረጋግጣል
        if (!phone || !email || !password || password.length !== 6) {
            return res.status(400).json({ success: false, message: 'እባክዎ ትክክለኛ መረጃ (ስልክ፣ ኢሜል እና ባለ 6 አሀዝ ፓስወርድ) ያስገቡ።' });
        }

        // ተጠቃሚው አስቀድሞ መመዝገሩን ያረጋግጣል
        const existingUser = await users.findOne({ $or: [{ phone }, { email }] });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'ይህ ስልክ ቁጥር ወይም ኢሜል ቀደም ብሎ ተመዝግቧል።' });
        }

        // አዲስ ተጠቃሚ ወደ ዳታቤዝ ያስቀምጣል
        const newUser = {
            phone,
            email,
            password, // በተጨባጭ አፕሊኬሽን ውስጥ ፓስወርዱ Hash መደረግ አለበት!
            tier: 'free', // ነባሪው አገልግሎት ነፃ ነው
            createdAt: new Date(),
        };

        await users.insertOne(newUser);
        
        res.status(201).json({ success: true, message: 'ምዝገባ ተሳክቷል! ኮንግራጄሽን!' });

    } catch (error) {
        console.error('Sign-Up Error:', error);
        res.status(500).json({ success: false, message: 'የምዝገባ ስህተት ተፈጥሯል።' });
    } finally {
        // ግንኙነቱን ይዘጋል
        await client.close();
    }
}
