document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (!token) {
        alert('Token não fornecido.');
        return;
    }
    document.getElementById('token').value = token;

    document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const newPassword = document.getElementById('newPassword').value;

        fetch('/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, newPassword })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Senha redefinida com sucesso!');
                window.location.href = '/';
            } else {
                alert('Falha ao redefinir senha: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro ao redefinir senha:', error);
            alert('Erro ao redefinir senha: ' + error.message);
        });
    });
});
