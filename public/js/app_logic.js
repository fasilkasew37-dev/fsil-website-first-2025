const auth = {
    user: JSON.parse(localStorage.getItem('fasilUser')),

    signup: async () => {
        const name = document.getElementById('reg-name').value;
        const phone = document.getElementById('reg-phone').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-pass').value;
        const photo = document.getElementById('reg-photo').files[0];

        if (!email.endsWith('@gmail.com')) return alert("ኢሜል @gmail.com መሆን አለበት!");
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('password', password);
        if(photo) formData.append('profilePhoto', photo);

        const res = await fetch('/api/auth/signup', { method: 'POST', body: formData });
        const data = await res.json();

        if (res.ok) {
            alert(data.message);
            app.showView('login-view');
        } else {
            document.getElementById('signup-error').innerText = data.message;
            document.getElementById('signup-error').style.display = 'block';
        }
    },

    login: async () => {
        const phone = document.getElementById('login-phone').value;
        const password = document.getElementById('login-pass').value;

        const res = await fetch('/api/auth/login', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ phone, password }) 
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('fasilUser', JSON.stringify(data.user));
            auth.user = data.user;
            app.showView('dashboard-view');
        } else {
            document.getElementById('login-error').innerText = data.message;
            document.getElementById('login-error').style.display = 'block';
        }
    },

    logout: () => {
        localStorage.removeItem('fasilUser');
        location.reload();
    }
};
