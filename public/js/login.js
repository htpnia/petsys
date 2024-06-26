    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        console.log('Tentativa de login no frontend:', { email, senha });

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Dados da resposta do servidor:', data);
            if (data.success) {
                console.log('Token recebido:', data.token);
                localStorage.setItem('token', data.token);
                console.log('Token armazenado no localStorage:', localStorage.getItem('token'));
                alert('Login bem-sucedido');
                window.location.href = '/dashboard'; // Certifique-se de que o caminho está correto
            } else {
                alert('Falha no login: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao fazer login: ' + error.message);
        });
    });
