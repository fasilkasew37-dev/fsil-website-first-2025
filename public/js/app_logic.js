// public/js/app_logic.js

// ቋሚ ተለዋዋጮች
let currentSubscription = 'none';
let selectedPlan = null;
let selectedPrice = 0;
let selectedFeature = null;
// እነዚህን ዳታቤዝ ለመጠቀም አሁን በ Global Scope እንተዋቸዋለን።
let posts = JSON.parse(localStorage.getItem('fasil_app_posts') || '[]');
let feedbacks = JSON.parse(localStorage.getItem('fasil_app_feedbacks') || '[]');
let isAmharic = true;
let currentView = 'agreement-view'; 

// ======================================================
// አጠቃላይ ተግባራት (General Functions)
// ======================================================

// ገፆችን ለመቀያየር የሚያገለግል
function showView(viewId) {
    // ሁሉንም ገጾች ደብቅ
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // የተመረጠውን ገጽ አሳይ
    const viewToShow = document.getElementById(viewId);
    if (viewToShow) {
        viewToShow.style.display = 'block';
        currentView = viewId;
        // ለምሳሌ የ Business Dashboard ሲታይ Balance እንዲዘምን
        if (viewId === 'business-dashboard') {
            updateBalanceDisplay();
        }
        // ዳሽቦርድ ሲሆን የትኛው እንደሆነ ለመወሰን
        if (viewId === 'free-dashboard' || viewId === 'premium-dashboard') {
             updateDashboardView();
        }
    }
}

// ወደ ዳሽቦርድ የሚመልስ (በሚገባው የደንበኝነት ምዝገባ መሰረት)
function goBackToDashboard() {
    const token = localStorage.getItem('userToken');
    const userType = localStorage.getItem('userType');

    if (!token) {
        showView('home-view'); // ካልገባ ወደ መግቢያ ይሂድ
        return;
    }
    
    // በ userType ላይ ተመስርቶ ወደ ትክክለኛው ዳሽቦርድ ይሂድ
    if (userType === 'premium') {
        showView('premium-dashboard');
    } else {
        showView('free-dashboard');
    }
}

// ሚዛንን የሚያሳይ
function updateBalanceDisplay() {
    const balance = parseFloat(localStorage.getItem('userBalanceUSD') || 0).toFixed(2);
    const balanceElement = document.getElementById('business-balance-display');
    if (balanceElement) {
        balanceElement.textContent = `${balance} USD`;
    }
}

// Dashboard ን ሲጫን የቱ ዳሽቦርድ እንደሚታይ
function updateDashboardView() {
    const userType = localStorage.getItem('userType');
    if (userType === 'premium') {
        showView('premium-dashboard');
    } else if (localStorage.getItem('userToken')) {
        showView('free-dashboard');
    } else {
         showView('home-view');
    }
}

// 🔐 መግባት (Authentication) ማረጋገጫ እና ማዞሪያ
function checkAuthAndRedirect(viewId) {
    const token = localStorage.getItem('userToken');
    if (!token) {
        alert(isAmharic ? "እባክዎ መጀመሪያ ይግቡ!" : "Please log in first!");
        showView('login-form');
    } else {
        showView(viewId);
    }
}

// ======================================================
// የቋንቋ ማሻሻያ (ማሻሻያ 3)
// ======================================================

const TEXT_MAP = {
    'app-title': { am: 'ፋሲል ዌብ አፕ - Fasil Web App (V14.0)', en: 'Fasil Web App - Fasil Web App (V14.0)' },
    'agreement-title': { am: 'እንኳን ወደ ፋሲል ዌብ በደህና መጡ', en: 'Welcome to Fasil Web App' },
    'intro-title-agreement': { am: '🌐 ስለ ፋሲል ዌብ አፕ', en: '🌐 About Fasil Web App' },
    'intro-text-agreement': { am: 'ፋሲል ዌብ አፕ በተአማኒነት እንዲሰራ የተቀየሰ የዲጂታል መጋሪያ መድረክ ሲሆን በተጨማሪም እንደ ፓወር ፖይንት እና ፒዲኤፍ ያሉ አገልግሎቶችን ያቀርባል።', en: 'Fasil Web App is a reliable digital sharing platform, also offering services like PowerPoint and PDF management.' },
    'strict-rules-title': { am: '⚠️ ጥብቅ የአጠቃቀም መመሪያ', en: '⚠️ Strict Usage Guidelines' },
    'strict-rules-text': { am: 'በዚህ መድረክ ላይ የሚከተሉትን ነገሮች ማካሄድ በጥብቅ የተከለከለ ነው፡ ፖለቲካዊ ግጭት፣ የሃይማኖት ጥላቻ፣ ዘረኝነት ወይም ሌላ ማንኛውንም የግጭት አጀንዳ ማካሄድ አይቻልም።', en: 'The following activities are strictly prohibited on this platform: political conflict, religious hatred, racism, or promoting any conflict agenda.' },
    'agreement-prompt': { am: 'ይህን መመሪያ ተቀብለው ይቀጥላሉ?', en: 'Do you agree to these terms?' },
    'agree-btn': { am: '✅ እስማማለሁ', en: '✅ I Agree' },
    'disagree-btn': { am: '❌ አልስማማም (ውጣ)', en: '❌ I Disagree (Exit)' },
    'language-toggle-btn-agreement': { am: 'ቋንቋ ለመቀየር (English)', en: 'Change Language (Amharic)' },
    'language-toggle-btn': { am: 'ቋንቋ ለመቀየር (English)', en: 'Change Language (Amharic)' },
    'home-title': { am: 'የመግቢያ/መመዝገቢያ ምርጫ', en: 'Login/Sign Up Selection' },
    'use-prompt': { am: 'እንዴት መጠቀም ይፈልጋሉ?', en: 'How would you like to use the app?' },
    'signup-free-btn': { am: 'በነፃ ለመመዝገብ / ለመግባት', en: 'Sign Up / Log In for Free' },
    'signup-premium-btn': { am: 'በክፍያ አማራጭ ለመመዝገብ', en: 'Sign Up for Premium Options' },
    'back-to-agreement': { am: 'ወደ መመሪያ ተመለስ', en: 'Back to Agreement' },
    'signup-title-h2': { am: 'አዲስ ተጠቃሚ ይመዝገቡ (ነፃ)', en: 'Register New User (Free)' },
    'profile-prompt': { am: '**እባክዎ የፕሮፋይል ፎቶ ያስገቡ**', en: '**Please upload a profile photo**' },
    'signup-btn': { am: 'መዝግብ (Sign Up)', en: 'Register (Sign Up)' },
    'login-link': { am: 'የተመዘገቡ ተጠቃሚ ከሆኑ ይግቡ (Log In)', en: 'Already Registered? Log In' },
    'login-title-h2': { am: 'መግቢያ (Log In)', en: 'Login (Log In)' },
    'login-btn': { am: 'ግባ (Log In)', en: 'Log In' },
    'signup-link': { am: 'አዲስ ተጠቃሚ? ይመዝገቡ (Sign Up)', en: 'New User? Sign Up' },
    // Dashboard Titles & Buttons
    'free-dashboard-title': { am: 'ነፃ የአገልግሎት ማዕከል (Dashboard)', en: 'Free Service Center (Dashboard)' },
    'premium-dashboard-title': { am: '⭐️ የክፍያ የአገልግሎት ማዕከል (Premium Dashboard)', en: '⭐️ Premium Service Center (Dashboard)' },
    'free-services-h2': { am: 'ነፃ አገልግሎቶች:', en: 'Free Services:' },
    'premium-features-h2': { am: 'ፕሪሚየም ተግባራት:', en: 'Premium Features:' },
    'basic-features-h2': { am: 'መሰረታዊ ተግባራት:', en: 'Basic Features:' },
    'view-info-btn': { am: '📄 መረጃ መመልከት (View)', en: '📄 View Information (View)' },
    'post-info-btn': { am: '✍️ መረጃ መለጠፍ / ማጋራት (Post/Share)', en: '✍️ Post / Share Information (Post/Share)' },
    'user-list-btn-free': { am: '👥 የፋሲል ዌብ አፕ ተጠቃሚዎች', en: '👥 Fasil Web App Users' },
    'create-group-btn': { am: '👥 ቡድን ለመፍጠር', en: '👥 Create Group' },
    'private-chat-btn': { am: '💬 በውስጥ መስመር ከጓደኞች ጋር ለማውራት', en: '💬 Private Chat with Friends' },
    'feedback-btn-free': { am: '📝 አስተያየት ለመስጠት እና ለመመልከት', en: '📝 Give and View Feedback' },
    'business-btn-free': { am: '💰 ቢዝነስ (Business)', en: '💰 Business' },
    'change-password-btn-free': { am: '🔒 የይለፍ ቃል ለመቀየር', en: '🔒 Change Password' },
    'delete-info-btn': { am: '🗑️ የለጠፉትን መረጃ መደለት', en: '🗑️ Delete Your Posts' },
    'visit-premium-btn-free': { am: '⭐️ የክፍያ አገልግሎታችን ይጎብኙ (Visit Premium Features)', en: '⭐️ Visit Our Premium Features' },
    'back-to-home-free': { am: 'ውጣ (Log Out)', en: 'Log Out' },
    // Premium Features
    'ppt-creation-btn': { am: '📊 ፓወር ፖይንት ማዘጋጀት', en: '📊 Create PowerPoint' },
    'pdf-management-btn': { am: '📄 ፒዲኤፍ መለጠፍ / ማዘጋጀት', en: '📄 Post / Manage PDF' },
    'quality-video-btn': { am: '🎥 ጥራቱ የጠበቀ ቪዲኦ መመልከት', en: '🎥 View High-Quality Video' },
    'news-btn': { am: '📰 ዜና መከታተል / መለጠፍ', en: '📰 Follow / Post News' },
    // Business Center
    'business-h2': { am: '💰 የቢዝነስ ማዕከል', en: '💰 Business Center' },
    'balance-title': { am: 'የእርስዎ የሚዛን መጠን:', en: 'Your Current Balance:' },
    'balance-note': { am: 'ይህ ገንዘብ ከዋጋ ንረት (Inflation) እና ከብር (ETB) መዳከም ለመከላከል ሲባል ወደ ዶላር ($) ተቀይሮ ይቀመጣል።', en: 'This money is converted to USD ($) and stored to protect against inflation and the weakening of ETB (Birr).' },
    'deposit-btn': { am: '💵 ገንዘብ ለማስቀመጥ', en: '💵 To Deposit Money' },
    'withdraw-btn': { am: '💸 ገንዘብ ለማውጣት', en: '💸 To Withdraw Money' },
    'international-purchase-btn': { am: '🌐 ዓለም አቀፍ ግዢዎችን ለመፈጸም', en: '🌐 To Make International Purchases' },
    'back-to-dashboard-btn': { am: 'ወደ ኋላ ተመለስ', en: 'Go Back to Dashboard' },
    'deposit-h2': { am: '💵 ገንዘብ ለማስቀመጥ', en: '💵 Deposit Money' },
    'deposit-currency-placeholder': { am: 'የሚቀየርለትን ምንዛሬ ይምረጡ', en: 'Select Currency for Conversion' },
    'deposit-receipt-prompt': { am: '**እባክዎ ገንዘብ ያስተላለፉበትን ደረሰኝ ፎቶ ያስገቡ**', en: '**Please upload a photo of the receipt**' },
    'deposit-submit-btn': { am: 'ገንዘብ አስቀምጥ', en: 'Deposit Money' },
    'back-to-business-deposit': { am: 'ወደ ቢዝነስ ማዕከል ተመለስ', en: 'Back to Business Center' },
    'withdraw-h2': { am: '💸 ገንዘብ ማውጣት', en: '💸 Withdraw Money' },
    'withdraw-currency-placeholder': { am: 'ለመቀየር እና ለማውጣት የሚፈልጉት ምንዛሬ', en: 'Currency to Convert and Withdraw' },
    'withdraw-method-placeholder': { am: 'ገንዘቡን የሚያወጡበት ዘዴ', en: 'Withdrawal Method' },
    'withdraw-submit-btn': { am: 'ገንዘብ አውጣ', en: 'Withdraw Money' },
    'back-to-business-withdraw': { am: 'ወደ ቢዝነስ ማዕከል ተመለስ', en: 'Back to Business Center' },
    // Placeholders - የሚቀየሩ
    'signup-name': { am: 'ሙሉ ስም', en: 'Full Name' },
    'signup-phone': { am: 'ስልክ ቁጥር (ለመግቢያ/Login)', en: 'Phone Number (for Login)' },
    'signup-email': { am: 'ኢሜል', en: 'Email' },
    'signup-password': { am: 'የይለፍ ቃል (ባለ 6 አሀዝ)', en: 'Password (6 digits)' },
    'login-phone': { am: 'ስልክ ቁጥር', en: 'Phone Number' },
    'login-password': { am: 'የይለፍ ቃል', en: 'Password' },
    'deposit-etb': { am: 'የETB መጠን ያስገቡ', en: 'Enter ETB Amount' },
    'withdraw-amount': { am: 'ለማውጣት የሚፈልጉትን የዶላር መጠን ያስገቡ ($)', en: 'Enter USD amount to withdraw ($)' },
    'receiver-input': { am: 'ተቀባይ መረጃ (ስልክ ቁጥር / የባንክ ቁጥር / PayPal Email)', en: 'Receiver Info (Phone/Bank Account/PayPal Email)' },
    'withdraw-password': { am: 'ገንዘብ ለማውጣት የይለፍ ቃል ያስገቡ', en: 'Enter Password to Withdraw' },
    // ተጨማሪ Placeholder ማስተካከያ (በቀጥታ ከ HTML የተቀዳ)
    'post-text-title': { am: 'ርዕስ (Title)', en: 'Title' },
    'post-text-content': { am: 'ፅሑፉን እዚህ ያስገቡ...', en: 'Enter your text here...' },
    'post-image-title': { am: 'ርዕስ (Title)', en: 'Title' },
    'post-audio-title': { am: 'ርዕስ (Title)', en: 'Title' },
    'current-password': { am: 'የድሮውን የይለፍ ቃል ያስገቡ', en: 'Enter Current Password' },
    'new-password': { am: 'አዲስ የይለፍ ቃል ያስገቡ (6 አሀዝ)', en: 'Enter New Password (6 digits)' },
    'confirm-password': { am: 'አዲስ የይለፍ ቃል ያረጋግጡ', en: 'Confirm New Password' },
    
};


// ቋንቋውን የሚቀይር ዋና ተግባር (ማሻሻያ 3 ተካትቷል)
function toggleLanguage() {
    isAmharic = !isAmharic;
    const langCode = isAmharic ? 'am' : 'en';

    // የ HTML መለያ ላይ ቋንቋውን ማዘጋጀት
    document.documentElement.lang = langCode;

    // የሁሉም መታወቂያዎች (IDs) ቋንቋ መቀየር
    for (const id in TEXT_MAP) {
        const element = document.getElementById(id);
        const textObject = TEXT_MAP[id];
        
        if (element && textObject) {
            const newText = textObject[langCode];

            // ጽሑፍ ብቻ መቀየር
            if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'P' || element.tagName === 'A' || element.tagName === 'BUTTON' || element.tagName === 'DIV' || element.tagName === 'TITLE' || element.tagName === 'SPAN' || element.tagName === 'LABEL') {
                element.innerHTML = newText;
            } 
            
            // የ Input Placeholder መቀየር
            else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = newText;
            } 
            
            // ለቋንቋ መቀየሪያ አዝራር ልዩ ማስተካከያ
            if (id === 'language-toggle-btn-agreement' || id === 'language-toggle-btn') {
                element.innerHTML = langCode === 'am' ? 'ቋንቋ ለመቀየር (English)' : 'Change Language (Amharic)';
            }
        }
    }
}

// ======================================================
// የገጽ አጠቃቀም ሎጂክ (Page Usage Logic)
// ======================================================

function handleAgreement(action) {
    if (action === 'agree') {
        showView('home-view');
    } else {
        alert(isAmharic ? "ከስምምነቱ ውጪ መቀጠል አይቻልም።" : "Cannot proceed without agreement.");
    }
}

function checkFreeSignupForPremiumAndGoToOptions(event) {
    event.preventDefault();
    const token = localStorage.getItem('userToken');
    if (token) {
        showView('premium-options');
    } else {
        alert(isAmharic ? "በክፍያ አማራጮች ለመመዝገብ መጀመሪያ ነፃ ምዝገባ ማጠናቀቅ አለብዎት።" : "To register for premium options, you must complete the free sign-up first.");
        showView('signup-form');
    }
}

function goToPricing(feature) {
    selectedFeature = feature;
    showView('pricing');
    // የ Premium Options ገጽን እንደገና ሲታይ ትክክለኛው ቋንቋ እንዲኖረው
    toggleLanguage();
    toggleLanguage();
}

function selectPlan(plan, price) {
    selectedPlan = plan;
    selectedPrice = price;
    
    const infoElement = document.getElementById('selected-plan-info');
    const planName = isAmharic ? 
        (plan === 'daily' ? 'ዕለታዊ' : plan === 'monthly' ? 'ወርሃዊ' : 'ዓመታዊ') : 
        plan.charAt(0).toUpperCase() + plan.slice(1);
        
    infoElement.textContent = isAmharic ? 
        `እርስዎ የመረጡት: ${planName} - ${price} ብር (ETB)` : 
        `You selected: ${planName} - ${price} Birr (ETB)`;
        
    showView('payment-methods');
}

// ተጠቃሚው ወደ Premium Dashboard ለመግባት የሚሞክር ከሆነ ማስጠንቀቂያ
function handlePremiumFeature(feature) {
    alert(isAmharic ? 
        `ይህ የክፍያ አገልግሎት ነው: ${feature}` : 
        `This is a premium feature: ${feature}`);
}

function updateReceiverInputPlaceholder() {
    const method = document.getElementById('withdraw-method').value;
    const inputField = document.getElementById('receiver-input');
    inputField.style.display = 'block'; // መጀመሪያ እናሳይ

    if (method === 'Telebirr') {
        inputField.placeholder = isAmharic ? 'የቴሌብር ስልክ ቁጥር ያስገቡ' : 'Enter Telebirr Phone Number';
        inputField.type = 'text'; // ለስልክ ቁጥር
    } else if (method === 'CBE') {
        inputField.placeholder = isAmharic ? 'የCBE የባንክ አካውንት ቁጥር ያስገቡ' : 'Enter CBE Bank Account Number';
        inputField.type = 'text'; // ለባንክ ቁጥር
    } else if (method === 'PayPal') {
        inputField.placeholder = isAmharic ? 'የ PayPal ኢሜይል አድራሻ ያስገቡ' : 'Enter PayPal Email Address';
        inputField.type = 'email'; // ለኢሜይል
    } else {
        inputField.placeholder = isAmharic ? 'ተቀባይ መረጃ' : 'Receiver Info';
    }
}

// የመተግበሪያውን ሁኔታ መጀመሪያ ሲጫን ያረጋግጣል
document.addEventListener('DOMContentLoaded', () => {
    // ቋንቋውን መጀመሪያ ላይ በአማርኛ ያዘጋጃል (Default)
    document.documentElement.lang = 'am'; 
    toggleLanguage(); // አንዴ በመጥራት የሁሉም ቋንቋ እንዲዘጋጅ ማድረግ
    toggleLanguage(); // ለሁለተኛ ጊዜ በመጥራት Amharic Default እንዲሆን ማድረግ (ስለዚህ የአማርኛ ጽሑፎች በ TEXT_MAP ውስጥ ከተገለጹት ጋር ይስተካከላሉ)

    // የተጠቃሚውን መግቢያ ሁኔታ ያረጋግጡ
    const hasAgreed = localStorage.getItem('hasAgreed');
    const token = localStorage.getItem('userToken');

    if (hasAgreed === 'true') {
        if (token) {
            updateDashboardView(); // ወደ ዳሽቦርድ ይሂድ
        } else {
            showView('home-view'); // ወደ መግቢያ/ምዝገባ ይሂድ
        }
    } else {
        showView('agreement-view'); // ወደ ስምምነት ገጽ ይሂድ
    }
    
});
