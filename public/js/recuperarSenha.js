document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  

    const email = document.getElementById('email').value;

    console.log('Solicitação de recuperação de senha para o e-mail:', email);  

    authFetch('/api/recover', {
        method: 'POST',
        body: JSON.stringify({ email })
    })
    .then(({ data, response }) => {
        if (response.ok) {
            alert('E-mail de recuperação enviado com sucesso!');
        } else {
            alert('Falha ao enviar e-mail de recuperação: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao enviar solicitação de recuperação de senha:', error);
        alert('Erro ao enviar solicitação de recuperação de senha: ' + error.message);
    });
});
