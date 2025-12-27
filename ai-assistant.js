const GEMINI_API_KEY = "AIzaSyDdvB04zs0XVHoPXhuGTx0sX7xEeGhGS98";

(function() {
    const old = document.getElementById('ai-root-box');
    if (old) old.remove();

    const root = document.createElement('div');
    root.id = 'ai-root-box';
    root.innerHTML = `
        <div id="bot-bubble" style="position:fixed; bottom:20px; right:20px; width:60px; height:60px; background:#0080ff; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:2147483647; box-shadow:0 4px 15px rgba(0,0,0,0.4); font-size:30px;">🤖</div>
        <div id="bot-window" style="position:fixed; bottom:90px; right:20px; width:300px; height:400px; background:white; border-radius:15px; display:none; flex-direction:column; box-shadow:0 5px 25px rgba(0,0,0,0.3); z-index:2147483647; border:1px solid #ddd; font-family:sans-serif; overflow:hidden;">
            <div style="background:#0080ff; color:white; padding:15px; font-weight:bold; display:flex; justify-content:space-between;">
                <span>AI ጓደኛ</span>
                <span id="bot-close" style="cursor:pointer;">×</span>
            </div>
            <div id="bot-messages" style="flex:1; padding:15px; overflow-y:auto; font-size:14px; display:flex; flex-direction:column; gap:10px; background:#f9f9f9; color:black;">
                <div style="background:#eee; padding:10px; border-radius:10px; align-self:flex-start;">ሰላም! አሁን መላክ ይሰራል። ሞክረው።</div>
            </div>
            <div style="padding:10px; border-top:1px solid #eee; display:flex; background:white;">
                <input id="bot-input" type="text" placeholder="ጻፍ..." style="flex:1; border:1px solid #ddd; padding:10px; border-radius:20px; outline:none; color:black; background:white;">
                <button id="bot-send" style="background:#0080ff; border:none; color:white; font-weight:bold; cursor:pointer; margin-left:5px; padding:10px 15px; border-radius:20px;">ላክ</button>
            </div>
        </div>`;
    document.body.appendChild(root);

    const bubble = document.getElementById('bot-bubble');
    const win = document.getElementById('bot-window');
    const input = document.getElementById('bot-input');
    const btn = document.getElementById('bot-send');
    const msgs = document.getElementById('bot-messages');
    const close = document.getElementById('bot-close');

    bubble.onclick = () => { win.style.display = win.style.display === 'none' ? 'flex' : 'none'; };
    close.onclick = () => { win.style.display = 'none'; };

    btn.onclick = async () => {
        const text = input.value.trim();
        if (!text) return;

        const uDiv = document.createElement('div');
        uDiv.style = "align-self:flex-end; background:#0080ff; color:white; padding:10px; border-radius:10px; max-width:80%;";
        uDiv.innerText = text;
        msgs.appendChild(uDiv);
        input.value = '';
        msgs.scrollTop = msgs.scrollHeight;

        try {
            const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: text }] }] })
            });
            const d = await r.json();
            const reply = d.candidates[0].content.parts[0].text;
            
            const aDiv = document.createElement('div');
            aDiv.style = "align-self:flex-start; background:#eee; padding:10px; border-radius:10px; color:black; max-width:80%;";
            aDiv.innerHTML = "<b>🤖:</b> " + reply;
            msgs.appendChild(aDiv);
        } catch (e) {
            const eDiv = document.createElement('div');
            eDiv.style = "color:red; font-size:12px;";
            eDiv.innerText = "ስህተት ተፈጥሯል።";
            msgs.appendChild(eDiv);
        }
        msgs.scrollTop = msgs.scrollHeight;
    };
})();
