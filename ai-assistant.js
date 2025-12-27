// ai-asistant.js
// 
const GEMINI_API_KEY = "AIzaSyDdvB04zs0XVHoPXhuGTx0sX7xEeGhGS98"

async function askGemini(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        return "ይቅርታ ስህተት ተፈጥሯል።";
    }
}
