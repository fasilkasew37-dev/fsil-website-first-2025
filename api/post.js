// api/post.js (Backend Serverless Function V2 - Unified Post Handler)

/**
 * ይህ API ከ Frontend የሚመጣውን ማንኛውንም አይነት አዲስ ልጥፍ ይቀበላል።
 * - postType: 'text', 'image', 'audio', 'pdf', 'ppt'
 * - Frontend አሁን ያለውን 'post-text.js' ከዚህ አዲስ 'post.js' ጋር እንዲሰራ
 * አድርገን Frontend ኮዱን በኋላ እናስተካክላለን። (አይነካም ብለውኛልና አሁን API እንፍጠር)
 */

export default async function handler(request, response) {
    
    // 1. የጥያቄውን አይነት ማረጋገጥ (Method Check)
    if (request.method !== 'POST') {
        return response.status(405).json({ 
            error: 'Method Not Allowed',
            message: 'ይህ API የሚቀበለው POST ጥያቄዎችን ብቻ ነው።'
        });
    }

    try {
        // 2. የተላከውን መረጃ (JSON Body) ማንበብ
        const { title, content, postedBy, postType } = request.body;

        // 3. አስፈላጊ መረጃዎች መኖራቸውን ማረጋገጥ
        if (!title || !content || !postedBy || !postType) {
            return response.status(400).json({ 
                error: 'Bad Request',
                message: 'ርዕስ፣ ይዘት፣ የለጠፈው ሰው እና የልጥፍ አይነት (postType) ግዴታ ናቸው።'
            });
        }
        
        // 4. የማስመዝገብ/የማስቀመጥ ሎጂክ (በType መለየት)
        
        let message = `የእርስዎ ${postType} ልጥፍ በተሳካ ሁኔታ ተመዝግቧል።`;
        let status = 'SUCCESS';
        
        // 🛑 ለፋይል ልጥፎች ማስጠንቀቂያ (እውነተኛ የፋይል ሰቀላ እስኪጀምር ድረስ)
        if (postType === 'image' || postType === 'audio' || postType === 'pdf' || postType === 'ppt') {
            message = `የእርስዎ ${postType} ልጥፍ መረጃ ተመዝግቧል። **እውነተኛው ፋይል ሰቀላ (Upload Logic) ግን ገና አልተጀመረም።**`;
            status = 'FILE_PENDING';
        }

        // 5. የዳታቤዝ ማስመዝገቢያ (Dummy Record)
        const databaseRecord = {
            id: Date.now(),
            title: title,
            content: content,
            postedBy: postedBy,
            postType: postType,
            status: status,
            timestamp: new Date().toISOString()
        };

        // 6. ስኬታማ መሆኑን የሚያሳይ ምላሽ ወደ Frontend መላክ
        response.status(200).json({
            message: message,
            data: databaseRecord,
            backend_version: 'V2 - Unified Handler',
            postType: postType
        });

    } catch (error) {
        // 7. ስህተት ከተፈጠረ ማሳወቅ
        console.error('API Error:', error);
        response.status(500).json({ 
            error: 'Internal Server Error',
            message: 'ልጥፉን በሚመዘግብበት ጊዜ ያልታሰበ ስህተት ተፈጥሯል።'
        });
    }
}
