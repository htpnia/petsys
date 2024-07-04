document.getElementById('formTransaction').addEventListener('submit', function(event) {
    event.preventDefault();  
    const nomeTransacao = document.getElementById('nomeTransacao').value;
    const descricao = document.getElementById('descricaoTransacao').value;

    const transactionData = {
        nomeTransacao: nomeTransacao,
        descricao: descricao
    };

    console.log('Dados do registro de transacao:', transactionData);  

    authFetch('/cadtransacao', {  
        method: 'POST',
        body: JSON.stringify(transactionData)
    })
    .then(({ data, response }) => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);  
        }
        if (data.success) {
            alert('Transacao cadastrada com sucesso!');
            window.location.href = '/funcoestransacoes'; 
            alert('Falha no cadastro de transacao: ' + data.message);  
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro de transacao: ' + error.message); 
    });
});
