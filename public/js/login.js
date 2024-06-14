document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('email').value;
    const password = document.getElementById('senha').value;

    const loginData = {
        username: username,
        password: password
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/dashboard'; // Redirecionar para o dashboard
        } else {
            alert('Login falhou: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});