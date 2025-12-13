const biz = {
    updateBalance: () => {
        if(auth.user) document.getElementById('balance-display').innerText = `Balance: ${auth.user.balance} USD`;
    },

    deposit: async () => {
        const amount = document.getElementById('amount-input').value;
        const res = await fetch('/api/finance/transaction', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ phone: auth.user.phone, amount, type: 'deposit' })
        });
        const data = await res.json();
        auth.user.balance = data.balance;
        biz.updateBalance();
        alert(data.message);
    },

    withdraw: async () => {
        const amount = document.getElementById('amount-input').value;
        const password = prompt("የይለፍ ቃል ያስገቡ:"); // Password prompt for withdraw
        const res = await fetch('/api/finance/transaction', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ phone: auth.user.phone, amount, type: 'withdraw', password })
        });
        const data = await res.json();
        if(res.ok) {
            auth.user.balance = data.balance;
            biz.updateBalance();
        }
        alert(data.message);
    }
};
