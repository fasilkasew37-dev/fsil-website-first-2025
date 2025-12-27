const GEMINI_API_KEY = "AIzaSyDdvB04zs0XVHoPXhuGTx0sX7xEeGhGS98";

(function() {
    // የቀድሞውን ለማጥፋት
    const oldRoot = document.getElementById('ai-chat-root');
    if (oldRoot) oldRoot.remove();

    const root = document.createElement('div');
    root.id = 'ai-chat-root';
    root.innerHTML = `
        <div id="ai-bubble" style="position:fixed; bottom:20px; right:20px; width:60px; height:60px; background:#0080ff; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:999999; box-shadow:0 4px 10px rgba(0,0,0,0.3); font-size:30px;">🤖</div>
        <div id="ai-window" style="position:fixed; bottom:90px; right:20px; width:300px; height:400px; background:white; border-radius:12px; display:none; flex-direction:column; box-shadow:0 5px 20px rgba(0,0,0,0.2); z-index:999999; border:1px solid #ccc; font-family:sans-serif;">
            <div style="background:#0080ff; color:white; padding:10px; font-weight:bold; border-radius:12px 12px 0 0;">AI ጓደኛ</div>
            <div id="ai-msgs" style="flex:1; padding:10px; overflow-y:auto; background:#f9f9f9; color:black; font-size:14px; display:flex; flex-direction:column; gap:8px;">
                <div style="background:#eee; padding:8px; border-radius:8px; align-self:flex-start;">ሰላም! ጻፍልኝ።</div>
            </div>
            <div style="padding:10px; display:flex; background:white; border-radius:0 0 12px 12px;">
                <input id="ai-in" type="text" placeholder="ጻፍ..." style="flex:1; border:1px solid #ccc; padding:8px; border-radius:15px; outline:none; color:black;">
                <button id="ai-btn" style="margin-left:5px; background:#0080ff; color:white; border:none; padding:8px 12px; border-radius:15px; cursor:pointer;">ላክ</button>
            </div>
        </div>`;
    document.body.appendChild(root);

    const bubble = document.getElementById('ai-bubble');
    const windowChat = document.getElementById('ai-window');
    const input = document.getElementById('ai-in');
    const sendBtn = document.getElementById('ai-btn');
    const msgs = document.getElementById('ai-msgs');

    bubble.onclick = () => { windowChat.style.display = windowChat.style.display === 'none' ? 'flex' : 'none'; };

    sendBtn.onclick = async () => {
        const val = input.value.trim();
        if (!val) return;

        const u = document.createElement('div');
        u.style = "align-self:flex-end; background:#0080ff; color:white; padding:8px; border-radius:8px; max-width:80%;";
        u.innerText = val;
        msgs.appendChild(u);
        input.value = "";
        msgs.scrollTop = msgs.scrollHeight;

        try {
            const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({contents: [{parts: [{text: val}]}]})
            });
            const data = await res.json();
            const txt = data.candidates[0].content.parts[0].text;
            
            const a = document.createElement('div');
            a.style = "align-self:flex-start; background:#eee; padding:8px; border-radius:8px; color:black; max-width:80%;";
            a.innerHTML = "<b>🤖:</b> " + txt;
            msgs.appendChild(a);
        } catch (e) {
            const err = document.createElement('div');
            err.style = "color:red; font-size:10px;";
            err.innerText = "ስህተት!";
            msgs.appendChild(err);
        }
        msgs.scrollTop = msgs.scrollHeight;
    };
})();
