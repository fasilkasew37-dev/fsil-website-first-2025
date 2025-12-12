// public/js/business.js

const API_BASE = 'http://localhost:5000/api'; 
const POST_API_URL = `${API_BASE}/posts`;
const FINANCE_API_URL = `${API_BASE}/finance`;

// ======================================================
// 1. ገንዘብ ማስቀመጥ (Deposit)
// ======================================================
async function handleDeposit() {
    const amountETB = document.getElementById('deposit-etb').value;
    const currency = document.getElementById('deposit-currency').value;
    const receiptPhoto = document.getElementById('deposit-receipt-photo').files[0];
    const token = localStorage.getItem('userToken');

    if (!amountETB || !currency || !receiptPhoto) {
        document.getElementById('deposit-error').textContent = isAmharic ? "እባክዎ ሁሉንም መስኮች ይሙሉ።" : "Please fill all fields.";
        document.getElementById('deposit-error').style.display = 'block';
        return;
    }

    if (parseFloat(amountETB) < 100) {
        document.getElementById('deposit-error').textContent = isAmharic ? "ቢያንስ 100 ብር ማስገባት አለብዎት።" : "You must deposit at least 100 Birr.";
        document.getElementById('deposit-error').style.display = 'block';
        return;
    }
    document.getElementById('deposit-error').style.display = 'none';

    document.getElementById('loading-overlay').style.display = 'flex';
    document.getElementById('loading-message').textContent = isAmharic ? "... የገንዘብ ማስቀመጥ ጥያቄ እየተላከ ነው ..." : "... Sending deposit request ...";

    const formData = new FormData();
    formData.append('amountETB', amountETB);
    formData.append('currency', currency);
    formData.append('receiptPhoto', receiptPhoto);

    try {
        const response = await fetch(`${FINANCE_API_URL}/deposit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();
        document.getElementById('loading-overlay').style.display = 'none';

        if (result.success) {
            // ሚዛንን ያዘምናል
            localStorage.setItem('userBalanceUSD', result.currentBalanceUSD); 
            alert(isAmharic ? "✅ ማስቀመጥ ተሳክቷል። ሚዛንዎ በቅርቡ ይዘምናል።" : "✅ Deposit successful. Your balance will be updated soon.");
            showView('business-dashboard');
        } else {
            document.getElementById('deposit-error').textContent = result.message;
            document.getElementById('deposit-error').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('loading-overlay').style.display = 'none';
        console.error('Deposit Error:', error);
        alert(isAmharic ? "⚠️ የአገልጋይ ስህተት ተፈጥሯል።" : "⚠️ Server error occurred.");
    }
}


// ======================================================
// 2. ገንዘብ ማውጣት (Withdraw) - (ማሻሻያ 1 እና 2 ተካትተዋል)
// ======================================================
async function handleWithdraw() {
    const amountUSD = document.getElementById('withdraw-amount').value;
    const currency = document.getElementById('withdraw-currency').value;
    const method = document.getElementById('withdraw-method').value;
    const receiverInfo = document.getElementById('receiver-input').value;
    const withdrawPassword = document.getElementById('withdraw-password').value; // ማሻሻያ 1
    const token = localStorage.getItem('userToken');

    if (!amountUSD || !currency || !method || !receiverInfo || !withdrawPassword) {
        document.getElementById('withdraw-error').textContent = isAmharic ? "እባክዎ ሁሉንም መስኮች ይሙሉ።" : "Please fill all fields.";
        document.getElementById('withdraw-error').style.display = 'block';
        return;
    }

    const currentBalance = parseFloat(localStorage.getItem('userBalanceUSD') || 0);
    if (parseFloat(amountUSD) > currentBalance) {
        document.getElementById('withdraw-error').textContent = isAmharic ? "በቂ ሚዛን የለዎትም።" : "Insufficient balance.";
        document.getElementById('withdraw-error').style.display = 'block';
        return;
    }
    
    // ማሻሻያ 2: CBE የባንክ ቁጥር ማረጋገጫ
    if (method === 'CBE') {
        // የ CBE አካውንት ቁጥር 13 ዲጂት መሆኑን ያረጋግጣል
        const cbeRegex = /^(1000|10000)\d{8}$/; // በ 1000 ወይም 10000 ጀምሮ 13 ዲጂት
        if (receiverInfo.length !== 13 || !cbeRegex.test(receiverInfo)) {
             document.getElementById('withdraw-error').textContent = isAmharic ? 
                "የCBE አካውንት ቁጥር 13 ዲጂት መሆን አለበት እና በ1000 ወይም 10000 መጀመር አለበት።" : 
                "CBE account number must be 13 digits and start with 1000 or 10000.";
            document.getElementById('withdraw-error').style.display = 'block';
            return;
        }
    }

    document.getElementById('withdraw-error').style.display = 'none';

    document.getElementById('loading-overlay').style.display = 'flex';
    document.getElementById('loading-message').textContent = isAmharic ? "... የገንዘብ ማውጣት ጥያቄ እየተላከ ነው ..." : "... Sending withdrawal request ...";

    const data = { amountUSD, withdrawCurrency: currency, withdrawMethod: method, receiverInfo, withdrawPassword };

    try {
        const response = await fetch(`${FINANCE_API_URL}/withdraw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        document.getElementById('loading-overlay').style.display = 'none';

        if (result.success) {
            localStorage.setItem('userBalanceUSD', result.currentBalanceUSD);
            alert(isAmharic ? "✅ ማውጣት ተሳክቷል። ገንዘብዎ በቅርቡ ይላካል።" : "✅ Withdrawal successful. Your funds will be sent shortly.");
            showView('business-dashboard');
        } else {
            document.getElementById('withdraw-error').textContent = result.message;
            document.getElementById('withdraw-error').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('loading-overlay').style.display = 'none';
        console.error('Withdrawal Error:', error);
        alert(isAmharic ? "⚠️ የአገልጋይ ስህተት ተፈጥሯል።" : "⚠️ Server error occurred.");
    }
}

// ======================================================
// 3. መረጃ መለጠፍ (Post Content)
// ======================================================
async function handlePost(type) {
    const token = localStorage.getItem('userToken');
    let formData = new FormData();
    let url = '';

    if (type === 'text') {
        const title = document.getElementById('post-text-title').value;
        const content = document.getElementById('post-text-content').value;
        if (!title || !content) return alert(isAmharic ? "ርዕስ እና ፅሑፍ ያስፈልጋሉ።" : "Title and content are required.");
        formData.append('title', title);
        formData.append('content', content);
        url = `${POST_API_URL}/text`;
    } else if (type === 'image') {
        const title = document.getElementById('post-image-title').value;
        const file = document.getElementById('post-image-file').files[0];
        if (!title || !file) return alert(isAmharic ? "ርዕስ እና ምስል ያስፈልጋሉ።" : "Title and image file are required.");
        formData.append('title', title);
        formData.append('imageFile', file);
        url = `${POST_API_URL}/image`;
    } else if (type === 'audio') {
        const title = document.getElementById('post-audio-title').value;
        const file = document.getElementById('post-audio-file').files[0];
        if (!title || !file) return alert(isAmharic ? "ርዕስ እና ቪዲዮ/ኦዲዮ ያስፈልጋሉ።" : "Title and media file are required.");
        formData.append('title', title);
        formData.append('mediaFile', file); // በ backend ውስጥ 'mediaFile' ተብሎ ይያዝ
        url = `${POST_API_URL}/audio`;
    } else {
        return;
    }
    
    document.getElementById('loading-overlay').style.display = 'flex';
    document.getElementById('loading-message').textContent = isAmharic ? "... መረጃ እየተለጠፈ ነው ..." : "... Posting content ...";

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();
        document.getElementById('loading-overlay').style.display = 'none';

        if (result.success) {
            alert(isAmharic ? `✅ ${type} በተሳካ ሁኔታ ተለጥፏል።` : `✅ ${type} posted successfully.`);
            showView('post-select');
        } else {
            alert(isAmharic ? `❌ መለጠፍ አልተሳካም: ${result.message}` : `❌ Posting failed: ${result.message}`);
        }
    } catch (error) {
        document.getElementById('loading-overlay').style.display = 'none';
        console.error('Post Error:', error);
        alert(isAmharic ? "⚠️ የአገልጋይ ስህተት ተፈጥሯል።" : "⚠️ Server error occurred.");
    }
}

// ======================================================
// 4. መረጃ መመልከት (View Content)
// ======================================================
async function viewContent(type) {
    const token = localStorage.getItem('userToken');
    const viewId = `view-${type}`;
    const containerId = `${type}-posts-container`;
    
    document.getElementById('loading-overlay').style.display = 'flex';
    document.getElementById('loading-message').textContent = isAmharic ? "... መረጃ እየተጠራ ነው ..." : "... Fetching content ...";

    try {
        const response = await fetch(`${POST_API_URL}/view/${type}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();
        document.getElementById('loading-overlay').style.display = 'none';

        if (result.success) {
            const container = document.getElementById(containerId);
            container.innerHTML = '';
            
            if (result.posts && result.posts.length > 0) {
                // መረጃውን ማሳየት
                result.posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'intro-text-box';
                    let contentHTML = `<h4>${post.title}</h4>`;
                    
                    if (type === 'text') {
                        contentHTML += `<p>${post.content}</p>`;
                    } else if (type === 'image' && post.imageUrl) {
                        contentHTML += `<img src="${post.imageUrl}" alt="${post.title}" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 10px;">`;
                    }
                    // ሌሎችም ይጨመራሉ

                    postElement.innerHTML = contentHTML;
                    container.appendChild(postElement);
                });
            } else {
                 container.innerHTML = `<p style="text-align: center; color: #777;" id="no-${type}-posts">${isAmharic ? `ምንም ${type} የለም።` : `No ${type} posts found.`}</p>`;
            }
            showView(viewId);
        } else {
             alert(isAmharic ? `❌ መረጃ ማምጣት አልተሳካም: ${result.message}` : `❌ Failed to fetch content: ${result.message}`);
        }
    } catch (error) {
        document.getElementById('loading-overlay').style.display = 'none';
        console.error('View Content Error:', error);
        alert(isAmharic ? "⚠️ የአገልጋይ ስህተት ተፈጥሯል።" : "⚠️ Server error occurred.");
    }
}


// (ሌሎች ተግባራት እንደ showDeleteList, handlePurchaseAmount, ወዘተ. እዚህ ቦታ መግባት አለባቸው)
// ለጊዜው እርስዎ ያልጠየቋቸው የድሮ ተግባራት እዚህ ባዶ ሆነው ይቀመጣሉ ወይም ወደ app_logic ይሄዳሉ

function handleGroupCreation() { alert(isAmharic ? "የቡድን መፍጠር ፊውቸር ገና አልተተገበረም!" : "Group creation feature not yet implemented!"); }
function handlePrivateChatStart() { alert(isAmharic ? "የውስጥ መስመር ቻት ፊውቸር ገና አልተተገበረም!" : "Private chat feature not yet implemented!"); }
function showDeleteList() { alert(isAmharic ? "መደለት የሚችሉትን ዝርዝር የማሳየት ተግባር ገና አልተተገበረም!" : "Delete list feature not yet implemented!"); }
function handleFeedbackType(type) { alert(isAmharic ? `የ${type} አስተያየት የመስጠት ፊውቸር ገና አልተተገበረም!` : `${type} feedback feature not yet implemented!`); }
function handlePurchaseAmount(service) { alert(isAmharic ? `${service} ለመግዛት የሚያስፈልገው ሎጂክ ገና አልተተገበረም!` : `Logic for buying ${service} not yet implemented!`); }
function processPayment(method) { alert(isAmharic ? `${method} የመክፈያ ዘዴ ገና አልተተገበረም!` : `${method} payment method not yet implemented!`); }
