let perfisMap = {};

authFetch('/api/perfis')
    .then(({ data, response }) => {
        if (!response.ok) {
            throw new Error('Falha ao carregar perfis: ' + response.statusText);
        }
        
        const perfilSelect = document.getElementById('perfilSelect');
        data.forEach(perfil => {
            let option = new Option(perfil.nomePerfil, perfil.nomePerfil);
            perfilSelect.add(option);
            perfisMap[perfil.nomePerfil] = perfil.idPerfil; 
        });
    })
    .catch(error => {
        console.error('Erro ao carregar perfis:', error);
        alert('Não foi possível carregar os perfis.');
    });

document.getElementById('formUser').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const nomeUsuario = document.getElementById('nomeUsuario').value;
    const senha = document.getElementById('senha').value;
    const email = document.getElementById('email').value;
    const matricula = document.getElementById('matricula').value;
    const nomePerfil = document.getElementById('perfilSelect').value;
    const acessoSistema = document.getElementById('acessoSistema').checked;
    const idPerfil = perfisMap[nomePerfil];

    const registerData = {
        nomeUsuario: nomeUsuario,
        senha: senha,
        email: email,
        matricula: matricula,
        acessoSistema: acessoSistema,
        idPerfil: idPerfil
    };

    console.log('Dados do registro:', registerData);  // Loga os dados do registro no console para verificação

    authFetch('/caduser', {
        method: 'POST',
        body: JSON.stringify(registerData)
    })
    .then(({ data, response }) => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
        }

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