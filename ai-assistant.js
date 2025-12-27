const API_KEY = "AIzaSyDdvB04zs0XVHoPXhuGTx0sX7xEeGhGS98";

(function() {
    const old = document.getElementById('fasil-ai-root');
    if (old) old.remove();

    const root = document.createElement('div');
    root.id = 'fasil-ai-root';
    root.innerHTML = `
        <div id="bot-icon" style="position:fixed; bottom:20px; right:20px; width:60px; height:60px; background:#0080ff; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:999999; box-shadow:0 4px 12px rgba(0,0,0,0.3); font-size:30px;">🤖</div>
        <div id="bot-window" style="position:fixed; bottom:90px; right:20px; width:300px; height:400px; background:white; border-radius:15px; display:none; flex-direction:column; box-shadow:0 5px 20px rgba(0,0,0,0.2); z-index:999999; border:1px solid #ddd; font-family:sans-serif; overflow:hidden;">
            <div style="background:#0080ff; color:white; padding:12px; font-weight:bold; display:flex; justify-content:space-between;">
                <span>Fasil AI</span>
                <span id="bot-close" style="cursor:pointer;">×</span>
            </div>
            <div id="bot-messages" style="flex:1; padding:10px; overflow-y:auto; background:#f4f4f4; color:black; font-size:14px; display:flex; flex-direction:column; gap:8px;">
                <div style="background:#e0e0e0; padding:8px; border-radius:8px; align-self:flex-start;">ሰላም ፋሲል! አሁን መላክ ይሰራል።</div>
            </div>
            <div style="padding:10px; border-top:1px solid #eee; display:flex; background:white;">
                <input id="bot-input" type="text" placeholder="እዚህ ጻፍ..." style="flex:1; border:1px solid #ccc; padding:10px; border-radius:20px; outline:none; color:black;">
                <button id="bot-send" style="margin-left:5px; background:#0080ff; color:white; border:none; padding:10px 15px; border-radius:20px; cursor:pointer; font-weight:bold;">ላክ</button>
            </div>
        </div>`;
    document.body.appendChild(root);

    const icon = document.getElementById('bot-icon');
    const win = document.getElementById('bot-window');
    const input = document.getElementById('bot-input');
    const sendBtn = document.getElementById('bot-send');
    const msgs = document.getElementById('bot-messages');
    const closeBtn = document.getElementById('bot-close');

    icon.onclick = () => { win.style.display = win.style.display === 'none' ? 'flex' : 'none'; };
    closeBtn.onclick = () => { win.style.display = 'none'; };

    sendBtn.onclick = async () => {
        const text = input.value.trim();
        if (!text) return;
        const u = document.createElement('div');
        u.style = "align-self:flex-end; background:#0080ff; color:white; padding:8px; border-radius:8px; max-width:80%;";
        u.innerText = text;
        msgs.appendChild(u);
        input.value = "";
        try {
            const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({contents: [{parts: [{text: text}]}]})
            });
            const d = await r.json();
            const reply = d.candidates[0].content.parts[0].text;
            const a = document.createElement('div');
            a.style = "align-self:flex-start; background:#e0e0e0; padding:8px; border-radius:8px; color:black; max-width:80%;";
            a.innerHTML = "<b>🤖:</b> " + reply;
            msgs.appendChild(a);
        } catch (e) {
            msgs.innerHTML += "<div style='color:red;'>ስህተት!</div>";
        }
        msgs.scrollTop = msgs.scrollHeight;
    };
})();
