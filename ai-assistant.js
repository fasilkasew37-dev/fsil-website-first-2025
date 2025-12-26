import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "AIzaSyDdvB04zs0XVHoPXhuGTx0sX7xEeGhGS98";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "አንተ የፋሲል ዌብ አፕ ዋና ስራ አስኪያጅ ነህ። ሰላምታ ስጥ፣ የፖሊሲ ጥሰቶችን እና የኮድ ጥቃቶችን ከልክል። ሁልጊዜ በአማርኛ መልስ ስጥ።",
});

async function handleAI() {
    const input = document.getElementById("chat-in");
    const output = document.getElementById("chat-box");
    const msg = input.value.trim();
    if (!msg) return;

    output.innerHTML += `<div style="text-align:right; color:blue; margin:5px;"><b>እኔ:</b> ${msg}</div>`;
    input.value = "";
    const loading = document.createElement("div");
    loading.innerText = "በማሰብ ላይ...";
    output.appendChild(loading);

    try {
        const result = await model.generateContent(msg);
        loading.remove();
        output.innerHTML += `<div style="text-align:left; color:green; margin:5px;"><b>ረዳት:</b> ${result.response.text()}</div>`;
        output.scrollTop = output.scrollHeight;
    } catch (e) {
        loading.innerText = "ስህተት ተከስቷል።";
    }
}

// ከHTML ጋር ማገናኘት
window.sendAIChat = handleAI;
