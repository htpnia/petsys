document.getElementById('formUser').addEventListener('submit', function(event) {
    event.preventDefault();  // Impede que o formulário seja submetido de maneira convencional

    const nomeusuario = document.getElementById('nomeusuario').value;
    const senha = document.getElementById('senha').value;
    const email = document.getElementById('email').value;
    const matricula = document.getElementById('matricula').value;

    const registerData = {
        nomeusuario: nomeusuario,
        senha: senha,
        email: email,
        matricula: matricula
    };

    console.log('Dados do registro:', registerData);  // Loga os dados do registro no console para verificação

    fetch('/caduser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = '/users'; // Redirecionar para a tela de login ou homepage após o sucesso
        } else {
            alert('Falha no cadastro: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
    });
});