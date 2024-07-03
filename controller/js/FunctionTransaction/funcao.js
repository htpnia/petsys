document.getElementById('formFunction').addEventListener('submit', function(event) {
    event.preventDefault();  // Impede que o formulário seja submetido de maneira convencional

    const nomeFuncao = document.getElementById('nomeFuncao').value;
    const descricao = document.getElementById('descricaoFuncao').value;

    const functionData = {
        nomeFuncao: nomeFuncao,
        descricao: descricao
    };

    console.log('Dados do registro de função:', functionData);  // Loga os dados do registro no console para verificação

    authFetch('/cadfuncao', {  // Atualizado para a rota correta
        method: 'POST',
        body: JSON.stringify(functionData)
    })
    .then(({ data, response }) => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
        }
        if (data.success) {
            alert('Funcao cadastrada com sucesso!');
            window.location.href = '/funcoestransacoes'; // Redirecionar para o painel de administração ou outra página relevante após o sucesso
        } else {
            alert('Falha no cadastro do funcao: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro da funcao: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
    });
});
