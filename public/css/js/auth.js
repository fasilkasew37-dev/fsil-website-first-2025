// public/js/auth.js

const AUTH_API_URL = 'http://localhost:5000/api/auth'; 

// ======================================================
// 1. ምዝገባ (Handle Sign Up)
// ======================================================
async function handleSignUp(event) {
    event.preventDefault(); 

    const signUpForm = document.getElementById('signUpForm');
    const formData = new FormData(signUpForm);
    
    // የይለፍ ቃል 6 አሃዝ መሆኑን ማረጋገጥ
    const password = formData.get('password');
    if (password.length !== 6 || isNaN(password)) {
        document.getElementById('signup-error').textContent = isAmharic ? "የይለፍ ቃል 6 አሀዝ መሆን አለበት።" : "Password must be 6 digits.";
        document.getElementById('signup-error').style.display = 'block';
        return;
    }
    document.getElementById('signup-error').style.display = 'none';
    
    document.getElementById('loading-overlay').style.display = 'flex';
    document.getElementById('loading-message').textContent = isAmharic ? "... መመዝገብ እየተካሄደ ነው ..." : "... Registration is in progress ...";

    try {
        const response = await fetch(`${AUTH_API_URL}/register`, {
            method: 'POST',
            body: formData 
        });

        const result = await response.json();
        document.getElementById('loading-overlay').style.display = 'none';

        if (result.success) {
            alert(isAmharic ? "✅ ምዝገባ ተሳካ! እባክዎ ይግቡ።" : "✅ Sign Up successful! Please log in.");
            showView('login-form'); 
        } else {
            document.getElementById('signup-error').textContent = result.message;
            document.getElementById('signup-error').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('loading-overlay').style.display = 'none';
        console.error('Sign Up Error:', error);
        alert(isAmharic ? "⚠️ የአገልጋይ ስህተት ተፈጥሯል።" : "⚠️ Server error occurred.");
    }
}


// ======================================================
// 2. መግቢያ (Handle Log In)
// ======================================================
async function handleLogin(event) {
    event.preventDefault(); 

    const loginForm = document.getElementById('loginForm');
    const data = {
        phone: loginForm.phone.value,
        password: loginForm.password.value
    };
    
    document.getElementById('loading-overlay').style.display = 'flex';
    document.getElementById('loading-message').textContent = isAmharic ? "... መግባት እየተካሄደ ነው ..." : "... Login is in progress ...";

    try {
        const response = await fetch(`${AUTH_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        document.getElementById('loading-overlay').style.display = 'none';

        if (result.success) {
            localStorage.setItem('userToken', result.token);
            localStorage.setItem('userType', result.userType || 'free');
            // መግቢያ ሲሳካ፣ ሚዛን እንዲዘጋጅ (ለመጀመሪያ ጊዜ 0.00 ሊሆን ይችላል)
            localStorage.setItem('userBalanceUSD', 0.00); 
            alert(isAmharic ? "✅ መግባት ተሳካ! እንኳን ደህና መጡ።" : "✅ Login successful! Welcome.");
            updateDashboardView();
        } else {
            document.getElementById('login-error').textContent = result.message;
            document.getElementById('login-error').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('loading-overlay').style.display = 'none';
        console.error('Login Error:', error);
        alert(isAmharic ? "⚠️ የአገልጋይ ስህተት ተፈጥሯል።" : "⚠️ Server error occurred.");
    }
}


// ======================================================
// 3. መውጣት (Log Out)
// ======================================================
function handleLogout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userBalanceUSD');
    alert(isAmharic ? "👋 በደህና ይሂዱ።" : "👋 Logged out successfully.");
    showView('home-view');
}


// ======================================================
// 4. የይለፍ ቃል መቀየር (Change Password)
// ======================================================
async function handleChangePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        document.getElementById('password-error').textContent = isAmharic ? "እባክዎ ሁሉንም መስኮች ይሙሉ።" : "Please fill all fields.";
        document.getElementById('password-error').style.display = 'block';
        return;
    }

    if (newPassword !== confirmPassword) {
        document.getElementById('password-error').textContent = isAmharic ? "አዲሱ የይለፍ ቃል አይመሳሰልም።" : "New passwords do not match.";
        document.getElementById('password-error').style.display = 'block';
        return;
    }
    
    // 🔐 6 አሀዝ ማረጋገጫ
    if (newPassword.length !== 6 || isNaN(newPassword)) {
        document.getElementById('password-error').textContent = isAmharic ? "አዲስ የይለፍ ቃል 6 አሀዝ መሆን አለበት።" : "New password must be 6 digits.";
        document.getElementById('password-error').style.display = 'block';
        return;
    }

    document.getElementById('password-error').style.display = 'none';
    
    document.getElementById('loading-overlay').style.display = 'flex';
    document.getElementById('loading-message').textContent = isAmharic ? "... የይለፍ ቃል እየተቀየረ ነው ..." : "... Changing password ...";

    const data = { currentPassword, newPassword };
    const token = localStorage.getItem('userToken');

    try {
        const response = await fetch(`${AUTH_API_URL}/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // ለ Authentication
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        document.getElementById('loading-overlay').style.display = 'none';

        if (result.success) {
            alert(isAmharic ? "✅ የይለፍ ቃልዎ በተሳካ ሁኔታ ተቀይሯል።" : "✅ Your password has been successfully changed.");
            goBackToDashboard();
        } else {
            document.getElementById('password-error').textContent = result.message;
            document.getElementById('password-error').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('loading-overlay').style.display = 'none';
        console.error('Change Password Error:', error);
        alert(isAmharic ? "⚠️ የአገልጋይ ስህተት ተፈጥሯል።" : "⚠️ Server error occurred.");
    }
}
