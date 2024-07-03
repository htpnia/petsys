document.getElementById('formModule').addEventListener('submit', function(event) {
    event.preventDefault();  // Impede que o formulário seja submetido de maneira convencional

    const nomeModulo = document.getElementById('nomeModulo').value;
    const descricao = document.getElementById('descricaoModulo').value;

    const moduleData = {
        nomeModulo: nomeModulo,
        descricao: descricao
    };

    console.log('Dados do registro de módulo:', moduleData);  // Loga os dados do registro no console para verificação

    authFetch('/cadmodulo', {  // Atualizado para a rota correta
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(moduleData)
    })
    .then(({ data, response }) => {  // Atualizado para obter { data, response }
        console.log('Resposta da API de cadastro de módulo:', { data, response });
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
        }
        console.log('Dados da resposta da API de cadastro de módulo:', data);
        if (data.success) {
            alert('Módulo cadastrado com sucesso!');
            window.location.href = '/modulos'; // Redirecionar para a lista de módulos
        } else {
            alert('Falha no cadastro do módulo: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro do módulo: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
    });
});
