const GEMINI_API_KEY = AIzaSyDdvB04zs0XVHoPXhuGTx0sX7xEeGhGS98

async function askGemini(message) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        return "ይቅርታ ጓደኛዬ፣ አሁን ትንሽ ተረብሻለሁ።";
    }
}

(function() {
    const chatHTML = `
        <div id="ai-bubble" style="position:fixed; bottom:20px; right:20px; width:60px; height:60px; background:#0080ff; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:9999; box-shadow:0 4px 10px rgba(0,0,0,0.3); font-size:30px;">🤖</div>
        <div id="ai-window" style="position:fixed; bottom:90px; right:20px; width:300px; height:450px; background:white; border-radius:15px; display:none; flex-direction:column; box-shadow:0 5px 20px rgba(0,0,0,0.2); z-index:9999; border:1px solid #ddd; font-family:sans-serif;">
            <div style="background:#0080ff; color:white; padding:15px; border-radius:15px 15px 0 0; font-weight:bold;">My AI Friend</div>
            <div id="ai-msgs" style="flex:1; padding:15px; overflow-y:auto; font-size:14px; display:flex; flex-direction:column; gap:10px; color:black;">
                <p style="background:#f0f0f0; padding:8px; border-radius:10px;">ሰላም ፋሲል! እኔ የአንተ ኤአይ ጓደኛ ነኝ። ምን ልርዳህ?</p>
            </div>
            <div style="padding:10px; border-top:1px solid #eee; display:flex;">
                <input id="ai-in" type="text" placeholder="ጥያቄህን እዚህ ጻፍ..." style="flex:1; border:none; outline:none; color:black;">
                <button id="ai-btn" style="background:none; border:none; color:#0080ff; font-weight:bold; cursor:pointer;">ላክ</button>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    const bubble = document.getElementById('ai-bubble');
    const window = document.getElementById('ai-window');
    const input = document.getElementById('ai-in');
    const btn = document.getElementById('ai-btn');
    const msgs = document.getElementById('ai-msgs');

    bubble.onclick = () => window.style.display = window.style.display === 'none' ? 'flex' : 'none';
    btn.onclick = async () => {
        const text = input.value.trim();
        if (!text) return;
        msgs.innerHTML += `<div style="align-self:flex-end; background:#0080ff; color:white; padding:8px; border-radius:10px;">${text}</div>`;
        input.value = '';
        const reply = await askGemini(text);
        msgs.innerHTML += `<div style="align-self:flex-start; background:#f0f0f0; padding:8px; border-radius:10px; color:black;"><b>🤖:</b> ${reply}</div>`;
        msgs.scrollTop = msgs.scrollHeight;
    };
})();
