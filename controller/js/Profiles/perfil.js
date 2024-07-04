document.getElementById('formProfile').addEventListener('submit', function(event) {
    event.preventDefault();  

    const nomePerfil = document.getElementById('nomePerfil').value;
    const descricao = document.getElementById('descricaoPerfil').value;

    const perfilData = {
        nomePerfil: nomePerfil,
        descricao: descricao
    };

    console.log('Dados do registro de perfil:', perfilData);  

    authFetch('/cadperfil', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(perfilData)
    })
    .then(({ data, response }) => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);  
        }
        return data;
    })
    .then(data => {
        if (data.success) {
            alert('Perfil cadastrado com sucesso!');
            window.location.href = '/perfis'; 
        } else {
            alert('Falha no cadastro do perfil: ' + data.message);  
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro do perfil: ' + error.message);  
    });
});
