// api/post-text.js (Backend Serverless Function V1)

/**
 * ይህ ፋሲል ዌብ አፕ Backend Serverless Function ሲሆን
 * ከ Frontend የሚመጣውን አዲስ የጽሑፍ ልጥፍ (POST request) ይቀበላል።
 * * ደረጃ 1: ልጥፉን ተቀብሎ በሰርቨሩ በትክክል እንደተመዘገበ ማሳወቅ።
 * (በኋላ ላይ ይህ ኮድ ከእውነተኛ ዳታቤዝ ጋር ይገናኛል)
 */

export default async function handler(request, response) {
    
    // 1. የጥያቄውን አይነት ማረጋገጥ (Method Check)
    if (request.method !== 'POST') {
        response.status(405).json({ 
            error: 'Method Not Allowed',
            message: 'ይህ API የሚቀበለው POST ጥያቄዎችን ብቻ ነው።'
        });
        return;
    }

    try {
        // 2. የተላከውን መረጃ (JSON Body) ማንበብ
        const { title, content, postedBy } = request.body;

        // 3. አስፈላጊ መረጃዎች መኖራቸውን ማረጋገጥ
        if (!title || !content || !postedBy) {
            response.status(400).json({ 
                error: 'Bad Request',
                message: 'ርዕስ (title)፣ ይዘት (content) እና የለጠፈው ሰው መለያ (postedBy) ግዴታ ናቸው።'
            });
            return;
        }

        // 4. የማስመዝገብ/የማስቀመጥ ሎጂክ
        
        // 🛑 Dummy Logic:
        // እዚህ ቦታ ላይ ልጥፉን ወደ እውነተኛ ዳታቤዝ (ለምሳሌ MongoDB, PostgreSQL) የማስገባት ኮድ ይገባል።
        // ለጊዜው፣ ሂደቱ ስኬታማ እንደሆነ አድርገን እንቆጥራለን።
        
        const databaseRecord = {
            id: Date.now(),
            title: title,
            content: content,
            postedBy: postedBy,
            status: 'SUCCESS',
            timestamp: new Date().toISOString()
        };

        // 5. ስኬታማ መሆኑን የሚያሳይ ምላሽ ወደ Frontend መላክ
        response.status(200).json({
            message: 'መልዕክትዎ በሰርቨር ላይ በተሳካ ሁኔታ ተመዝግቧል።',
            data: databaseRecord,
            backend_version: 'V1 - Post Text Handler'
        });

    } catch (error) {
        // 6. ስህተት ከተፈጠረ ማሳወቅ
        console.error('API Error:', error);
        response.status(500).json({ 
            error: 'Internal Server Error',
            message: 'መልዕክቱን በሚመዘግብበት ጊዜ ያልታሰበ ስህተት ተፈጥሯል።'
        });
    }
}

// ----------------------------------------------------
// ማስታወሻ: የ`package.json` ፋይልን መለወጥ አያስፈልግም!
// ----------------------------------------------------
