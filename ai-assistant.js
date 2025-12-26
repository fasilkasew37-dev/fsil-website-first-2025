const GEMINI_API_KEY = "AIzaSyDdvB04zs0XVHoPXhuGTx0sX7xEeGhGS98";

(function() {
    // ሮቦቷን መፍጠር
    const chatContainer = document.createElement('div');
    chatContainer.innerHTML = `
        <div id="ai-bubble" style="position:fixed; bottom:80px; right:20px; width:65px; height:65px; background:#0080ff; border-radius:50%; display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:999999; box-shadow:0 4px 15px rgba(0,0,0,0.4); font-size:35px;">🤖</div>
        <div id="ai-window" style="position:fixed; bottom:155px; right:20px; width:310px; height:420px; background:white; border-radius:15px; display:none; flex-direction:column; box-shadow:0 5px 25px rgba(0,0,0,0.3); z-index:999999; border:1px solid #ddd; font-family: sans-serif; overflow:hidden;">
            <div style="background:#0080ff; color:white; padding:15px; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
                <span style="color:white !important;">My AI Friend</span>
                <span id="ai-close" style="cursor:pointer; font-size:20px;">×</span>
            </div>
            <div id="ai-messages" style="flex:1; padding:15px; overflow-y:auto; font-size:14px; display:flex; flex-direction:column; gap:10px; background:#f9f9f9; color:black !important;">
                <div style="background:#eee; padding:10px; border-radius:10px; align-self:flex-start; color:black !important;">ሰላም ፋሲል! አሁን መላክ ትችላለህ። ምን ልርዳህ?</div>
            </div>
            <div style="padding:10px; border-top:1px solid #eee; display:flex; background:white;">
                <input id="ai-input" type="text" placeholder="እዚህ ጻፍ..." style="flex:1; border:1px solid #ddd; outline:none; padding:10px; border-radius:20px; color:black !important; background:white !important;">
                <button id="ai-send" style="background:#0080ff; border:none; color:white !important; font-weight:bold; cursor:pointer; margin-left:5px; padding:10px 15px; border-radius:20px;">ላክ</button>
            </div>
        </div>`;
    document.body.appendChild(chatContainer);

    const bubble = document.getElementById('ai-bubble');
    const windowChat = document.getElementById('ai-window');
    const input = document.getElementById('ai-input');
    const btn = document.getElementById('ai-send');
    const msgs = document.getElementById('ai-messages');
    const closeBtn = document.getElementById('ai-close');

    bubble.onclick = function() { windowChat.style.display = 'flex'; };
    closeBtn.onclick = function() { windowChat.style.display = 'none'; };

    // መላኪያ በተን
    btn.onclick = async function() {
        const userText = input.value.trim();
        if (!userText) return;

        // የላክከውን ጽሑፍ ማሳየት
        const userDiv = document.createElement('div');
        userDiv.style = "align-self:flex-end; background:#0080ff; color:white !important; padding:10px; border-radius:10px; max-width:80%;";
        userDiv.innerText = userText;
        msgs.appendChild(userDiv);
        
        input.value = '';
        msgs.scrollTop = msgs.scrollHeight;

        // የጥበቃ ምልክት
        const loading = document.createElement('div');
        loading.style = "align-self:flex-start; background:#ddd; padding:10px; border-radius:10px; color:black !important;";
        loading.innerHTML = "<i>በማሰብ ላይ...</i>";
        msgs.appendChild(loading);

        try {
            const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: userText }] }] })
            });
            const data = await response.json();
            msgs.removeChild(loading);
            
            const aiReply = data.candidates[0].content.parts[0].text;
            const aiDiv = document.createElement('div');
            aiDiv.style = "align-self:flex-start; background:#eee; padding:10px; border-radius:10px; color:black !important; max-width:80%;";
            aiDiv.innerHTML = "<b>🤖:</b> " + aiReply;
            msgs.appendChild(aiDiv);
        } catch (e) {
            if(loading.parentNode) msgs.removeChild(loading);
            const errDiv = document.createElement('div');
            errDiv.style = "color:red; font-size:12px; align-self:center;";
            errDiv.innerText = "ስህተት ተፈጥሯል። ድጋሚ ሞክር።";
            msgs.appendChild(errDiv);
        }
        msgs.scrollTop = msgs.scrollHeight;
    };
})();
