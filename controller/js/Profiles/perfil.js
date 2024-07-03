document.getElementById('formProfile').addEventListener('submit', function(event) {
    event.preventDefault();  // Impede que o formulário seja submetido de maneira convencional

    const nomePerfil = document.getElementById('nomePerfil').value;
    const descricao = document.getElementById('descricaoPerfil').value;

    const perfilData = {
        nomePerfil: nomePerfil,
        descricao: descricao
    };

    console.log('Dados do registro de perfil:', perfilData);  // Loga os dados do registro no console para verificação

    authFetch('/cadperfil', {  // Atualizado para a rota correta
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(perfilData)
    })
    .then(({ data, response }) => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
        }
        return data;
    })
    .then(data => {
        if (data.success) {
            alert('Perfil cadastrado com sucesso!');
            window.location.href = '/perfis'; // Redirecionar para o painel de administração ou outra página relevante após o sucesso
        } else {
            alert('Falha no cadastro do perfil: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro do perfil: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
    });
});
