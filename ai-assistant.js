const GEMINI_API_KEY = "AIzaSyDdvB04zs0XVHoPXhuGTx0sX7xEeGhGS98";

(function() {
    const oldChat = document.getElementById('ai-container-root');
    if (oldChat) oldChat.remove();

    const chatRoot = document.createElement('div');
    chatRoot.id = 'ai-container-root';
    chatRoot.innerHTML = `
        <div id="ai-bubble" style="position:fixed; bottom:80px; right:20px; width:65px; height:65px; background:#0080ff; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:2147483647; box-shadow:0 4px 15px rgba(0,0,0,0.4); font-size:35px;">🤖</div>
        <div id="ai-window" style="position:fixed; bottom:155px; right:20px; width:310px; height:420px; background:white; border-radius:15px; display:none; flex-direction:column; box-shadow:0 5px 25px rgba(0,0,0,0.3); z-index:2147483647; border:1px solid #ddd; font-family: sans-serif; overflow:hidden;">
            <div style="background:#0080ff; color:white; padding:15px; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
                <span style="color:white !important;">AI ጓደኛ</span>
                <span id="ai-close" style="cursor:pointer; font-size:20px;">×</span>
            </div>
            <div id="ai-messages" style="flex:1; padding:15px; overflow-y:auto; font-size:14px; display:flex; flex-direction:column; gap:10px; background:#f9f9f9; color:black !important;">
                <div style="background:#eee; padding:10px; border-radius:10px; align-self:flex-start; color:black;">ሰላም! አሁን መላክ ይሰራል። ሞክረው!</div>
            </div>
            <div style="padding:10px; border-top:1px solid #eee; display:flex; background:white;">
                <input id="ai-input" type="text" placeholder="እዚህ ጻፍ..." style="flex:1; border:1px solid #ddd; padding:10px; border-radius:20px; color:black; background:white;">
                <button id="ai-send-btn" style="background:#0080ff; border:none; color:white; font-weight:bold; cursor:pointer; margin-left:5px; padding:10px 15px; border-radius:20px;">ላክ</button>
            </div>
        </div>`;
    document.body.appendChild(chatRoot);

    const bubble = document.getElementById('ai-bubble');
    const windowChat = document.getElementById('ai-window');
    const input = document.getElementById('ai-input');
    const sendBtn = document.getElementById('ai-send-btn');
    const msgs = document.getElementById('ai-messages');
    const closeBtn = document.getElementById('ai-close');

    bubble.addEventListener('click', () => { windowChat.style.display = 'flex'; });
    closeBtn.addEventListener('click', () => { windowChat.style.display = 'none'; });

    async function handleSend() {
        const text = input.value.trim();
        if (!text) return;

        const uDiv = document.createElement('div');
        uDiv.setAttribute('style', 'align-self:flex-end; background:#0080ff; color:white; padding:10px; border-radius:10px; max-width:80%;');
        uDiv.innerText = text;
        msgs.appendChild(uDiv);
        input.value = '';
        msgs.scrollTop = msgs.scrollHeight;

        const loading = document.createElement('div');
        loading.innerHTML = "<i style='color:gray;'>በማሰብ ላይ...</i>";
        msgs.appendChild(loading);

        try {
            const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: text }] }] })
            });
            const data = await resp.json();
            msgs.removeChild(loading);
            
            const reply = data.candidates[0].content.parts[0].text;
            const aDiv = document.createElement('div');
            aDiv.setAttribute('style', 'align-self:flex-start; background:#eee; padding:10px; border-radius:10px; color:black; max-width:80%;');
            aDiv.innerHTML = "<b>🤖:</b> " + reply;
            msgs.appendChild(aDiv);
        } catch (e) {
            if(loading.parentNode) msgs.removeChild(loading);
            const eDiv = document.createElement('div');
            eDiv.style.color = "red";
            eDiv.innerText = "ስህተት ተፈጥሯል። ድጋሚ ሞክር።";
            msgs.appendChild(eDiv);
        }
        msgs.scrollTop = msgs.scrollHeight;
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleSend(); });
})();
