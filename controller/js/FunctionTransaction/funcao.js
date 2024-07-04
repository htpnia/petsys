document.getElementById('formFunction').addEventListener('submit', function(event) {
    event.preventDefault();

    const nomeFuncao = document.getElementById('nomeFuncao').value;
    const descricao = document.getElementById('descricaoFuncao').value;

    const functionData = {
        nomeFuncao: nomeFuncao,
        descricao: descricao
    };

    console.log('Dados do registro de função:', functionData);  

    authFetch('/cadfuncao', {  
        method: 'POST',
        body: JSON.stringify(functionData)
    })
    .then(({ data, response }) => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);  
        }
        if (data.success) {
            alert('Funcao cadastrada com sucesso!');
            window.location.href = '/funcoestransacoes';
        } else {
            alert('Falha no cadastro do funcao: ' + data.message);  
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro da funcao: ' + error.message);  
    });
});
