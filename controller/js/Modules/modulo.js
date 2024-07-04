document.getElementById('formModule').addEventListener('submit', function(event) {
    event.preventDefault();  
    const nomeModulo = document.getElementById('nomeModulo').value;
    const descricao = document.getElementById('descricaoModulo').value;

    const moduleData = {
        nomeModulo: nomeModulo,
        descricao: descricao
    };

    console.log('Dados do registro de módulo:', moduleData);  

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
            alert('Módulo cadastrado com sucesso!');
            window.location.href = '/modulos'; 
        } else {
            alert('Falha no cadastro do módulo: ' + data.message);  
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro do módulo: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
    });
});
