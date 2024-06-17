document.getElementById('formModule').addEventListener('submit', function(event) {
    event.preventDefault();  // Impede que o formulário seja submetido de maneira convencional

    const nomeModulo = document.getElementById('nomeModulo').value;
    const descricao = document.getElementById('descricaoModulo').value;

    const moduleData = {
        nomeModulo: nomeModulo,
        descricao: descricao
    };

    console.log('Dados do registro de módulo:', moduleData);  // Loga os dados do registro no console para verificação

    fetch('/cadmodulo', {  // Atualizado para a rota correta
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(moduleData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Modulo cadastrado com sucesso!');
            window.location.href = '/modulos'; // Redirecionar para o painel de administração ou outra página relevante após o sucesso
        } else {
            alert('Falha no cadastro do modulo: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro do modulo: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
    });
});


