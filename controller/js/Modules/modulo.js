document.getElementById('formModule').addEventListener('submit', function(event) {
    event.preventDefault();  
    const nomeModulo = document.getElementById('nomeModulo').value;
    const descricao = document.getElementById('descricaoModulo').value;

    const moduleData = {
        nomeModulo: nomeModulo,
        descricao: descricao
    };

    authFetch('/cadmodulo', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(moduleData)
    })
    .then(({ data, response }) => {  
        console.log('Resposta da API de cadastro de módulo:', { data, response });
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);  
        }
        console.log('Dados da resposta da API de cadastro de módulo:', data);
        if (data.success) {
            alert('Pet cadastrado com sucesso!');
            window.location.href = '/pets'; 
        } else {
            alert('Falha no cadastro do módulo: ' + data.message);  
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro do módulo: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
    });
});
