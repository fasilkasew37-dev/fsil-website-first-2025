const GEMINI_API_KEY = "AIzaSyDdvB04zs0XVHoPXhuGTx0sX7xEeGhGS98";

(function() {
    const old = document.getElementById('ai-root-box');
    if (old) old.remove();

    const root = document.createElement('div');
    root.id = 'ai-root-box';
    root.innerHTML = `
        <div id="ai-bubble" style="position:fixed; bottom:20px; right:20px; width:65px; height:65px; background:#0080ff; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:2147483647; box-shadow:0 4px 15px rgba(0,0,0,0.4); font-size:35px;">🤖</div>
        <div id="ai-window" style="position:fixed; bottom:95px; right:20px; width:320px; height:450px; background:white; border-radius:15px; display:none; flex-direction:column; box-shadow:0 5px 25px rgba(0,0,0,0.3); z-index:2147483647; border:1px solid #ddd; font-family: sans-serif; overflow:hidden;">
            <div style="background:#0080ff; color:white; padding:15px; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
                <span>AI ጓደኛ</span>
                <span id="ai-close" style="cursor:pointer; font-size:24px;">×</span>
            </div>
            <div id="ai-messages" style="flex:1; padding:15px; overflow-y:auto; font-size:14px; display:flex; flex-direction:column; gap:10px; background:#f9f9f9; color:black !important;">
                <div style="background:#eee; padding:10px; border-radius:10px; align-self:flex-start; color:black;">ሰላም! አሁን መላክ ይሰራል። ሞክረው።</div>
            </div>
            <div style="padding:15px; border-top:1px solid #eee; display:flex; background:white; gap:5px;">
                <input id="ai-input" type="text" placeholder="እዚህ ጻፍ..." style="flex:1; border:1px solid #ddd; padding:12px; border-radius:25px; color:black; background:white; outline:none;">
                <button id="ai-send-btn" style="background:#0080ff; border:none; color:white; font-weight:bold; cursor:pointer; padding:10px 20px; border-radius:25px;">ላክ</button>
            </div>
        </div>`;
    document.body.appendChild(root);

    const bubble = document.getElementById('ai-bubble');
    const win = document.getElementById('ai-window');
    const input = document.getElementById('ai-input');
    const btn = document.getElementById('ai-send-btn');
    const msgs = document.getElementById('ai-messages');
    const close = document.getElementById('ai-close');

    bubble.onclick = () => { win.style.display = 'flex'; };
    close.onclick = () => { win.style.display = 'none'; };

    async function send() {
        const txt = input.value.trim();
        if (!txt) return;

        const u = document.createElement('div');
        u.style = "align-self:flex-end; background:#0080ff; color:white; padding:10px; border-radius:10px; max-width:85%;";
        u.innerText = txt;
        msgs.appendChild(u);
        input.value = '';
        msgs.scrollTop = msgs.scrollHeight;

        const load = document.createElement('div');
        load.innerHTML = "<i style='color:gray;'>በማሰብ ላይ...</i>";
        msgs.appendChild(load);

        try {
            const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: txt }] }] })
            });
            const d = await r.json();
            msgs.removeChild(load);
            const reply = d.candidates[0].content.parts[0].text;
            const a = document.createElement('div');
            a.style = "align-self:flex-start; background:#eee; padding:10px; border-radius:10px; color:black; max-width:85%;";
            a.innerHTML = "<b>🤖:</b> " + reply;
            msgs.appendChild(a);
        } catch (e) {
            if(load.parentNode) msgs.removeChild(load);
            const err = document.createElement('div');
            err.style = "color:red; font-size:12px; align-self:center;";
            err.innerText = "ስህተት ተፈጥሯል። ድጋሚ ሞክር።";
            msgs.appendChild(err);
        }
        msgs.scrollTop = msgs.scrollHeight;
    }

    btn.onclick = send;
    input.onkeydown = (e) => { if(e.key === 'Enter') send(); };
})();
