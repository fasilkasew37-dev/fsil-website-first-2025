const API_KEY = "AIzaSyDdvB04zs0XVHoPXhuGTx0sX7xEeGhGS98"
const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY;

async function askGemini(userPrompt) {
    const response = await fetch(URL, {
        method: "POST",
        body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }]
        })
    });
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text; // ከ Gemini የመጣው መልስ
}
