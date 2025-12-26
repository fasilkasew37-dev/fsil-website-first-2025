const GEMINI_API_KEY = "AIzaSyDdvB04zs0XVHoPXhuGTx0sX7xEeGhGS98"; 

(function() {
    // 1. የሮቦቷን እና የንግግር ሳጥኑን HTML መፍጠር
    const chatContainer = document.createElement('div');
    chatContainer.innerHTML = `
        <div id="ai-bubble" style="position:fixed; bottom:20px; right:20px; width:60px; height:60px; background:#0080ff; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:10000; box-shadow:0 4px 15px rgba(0,0,0,0.3); font-size:30px;">🤖</div>
        <div id="ai-window" style="position:fixed; bottom:90px; right:20px; width:310px; height:420px; background:white; border-radius:15px; display:none; flex-direction:column; box-shadow:0 5px 25px rgba(0,0,0,0.2); z-index:10000; border:1px solid #ddd; font-family: sans-serif; overflow:hidden;">
            <div style="background:#0080ff; color:white; padding:15px; font-weight:bold; display:flex; justify-content:space-between;">
                <span>My AI Friend</span>
                <span id="ai-close" style="cursor:pointer;">×</span>
            </div>
            <div id="ai-messages" style="flex:1; padding:15px; overflow-y:auto; font-size:14px; display:flex; flex-direction:column; gap:10px; background:#f9f9f9; color:black;">
                <div style="background:#eee; padding:10px; border-radius:10px; align-self:flex-start;">ሰላም ፋሲል! እኔ የአንተ ኤአይ ጓደኛ ነኝ። እንዴት ልርዳህ?</div>
            </div>
            <div style="padding:10px; border-top:1px solid #eee; display:flex; background:white;">
                <input id="ai-input" type="text" placeholder="ጥያቄህን እዚህ ጻፍ..." style="flex:1; border:1px solid #ddd; outline:none; padding:10px; border-radius:20px; color:black;">
                <button id="ai-send" style="background:#0080ff; border:none; color:white; font-weight:bold; cursor:pointer; margin-left:5px; padding:10px 15px; border-radius:20px;">ላክ</button>
            </div>
        </div>`;
    document.body.appendChild(chatContainer);

    const bubble = document.getElementById('ai-bubble');
    const windowChat = document.getElementById('ai-window');
    const input = document.getElementById('ai-input');
    const btn = document.getElementById('ai-send');
    const msgs = document.getElementById('ai-messages');
    const closeBtn = document.getElementById('ai-close');

    // ሮቦቷን መክፈቻ እና መዝጊያ
    bubble.onclick = () => windowChat.style.display = 'flex';
    closeBtn.onclick = () => windowChat.style.display = 'none';

    // ከኤአይ ጋር የመገናኛ ተግባር
    btn.onclick = async () => {
        const text = input.value.trim();
        if (!text) return;

        msgs.innerHTML += `<div style="align-self:flex-end; background:#0080ff; color:white; padding:10px; border-radius:10px;">${text}</div>`;
        input.value = '';
        msgs.scrollTop = msgs.scrollHeight;

        const loading = document.createElement('div');
        loading.innerHTML = "<i>በማሰብ ላይ...</i>";
        msgs.appendChild(loading);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({contents: [{parts: [{text: text}]}]})
            });
            const data = await response.json();
            msgs.removeChild(loading);
            const aiReply = data.candidates[0].content.parts[0].text;
            msgs.innerHTML += `<div style="align-self:flex-start; background:#eee; padding:10px; border-radius:10px; color:black;"><b>🤖:</b> ${aiReply}</div>`;
        } catch (e) {
            msgs.removeChild(loading);
            msgs.innerHTML += `<div style="color:red;">ይቅርታ፣ ግንኙነት ተቋርጧል።</div>`;
        }
        msgs.scrollTop = msgs.scrollHeight;
    };
})();
