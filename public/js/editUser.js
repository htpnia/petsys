document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (!userId) {
        alert('ID do usuário não fornecido.');
        return;
    }

    // Carregar dados do usuário e perfis simultaneamente
    Promise.all([
        authFetch(`/api/usuarios/${userId}`, { method: 'GET' }).then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro ao carregar dados do usuário:', response.statusText);
                throw new Error('Erro ao carregar dados do usuário.');
            }
            return data;
        }),
        authFetch('/api/perfis', { method: 'GET' }).then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro ao carregar perfis:', response.statusText);
                throw new Error('Erro ao carregar perfis.');
            }
            return data;
        })
    ])
    .then(([user, perfis]) => {
        console.log('Dados do usuário:', user);
        console.log('Dados dos perfis:', perfis);

        // Preencher os campos do formulário com placeholders
        document.getElementById('userId').value = user.idUsuario;
        document.getElementById('nomeUsuario').value = '';
        document.getElementById('nomeUsuario').placeholder = user.nomeUsuario;
        document.getElementById('email').value = '';
        document.getElementById('email').placeholder = user.email;
        document.getElementById('matricula').value = '';
        document.getElementById('matricula').placeholder = user.matricula;

        // Preencher o select com os perfis
        const perfilSelect = document.getElementById('idPerfil');
        perfilSelect.innerHTML = '';
        perfis.forEach(perfil => {
            const option = document.createElement('option');
            option.value = perfil.idPerfil; // Certifique-se de que está usando o campo correto
            option.textContent = perfil.nomePerfil;
            perfilSelect.appendChild(option);
        });

        // Selecionar o perfil do usuário
        perfilSelect.value = user.idPerfil;
    })
    .catch(error => {
        console.error('Erro ao carregar dados:', error);
        alert(error.message);
    });

    // Atualizar usuário ao enviar o formulário
    document.getElementById('editUserForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const id = document.getElementById('userId').value;
        const nomeUsuario = document.getElementById('nomeUsuario').value || document.getElementById('nomeUsuario').placeholder;
        const email = document.getElementById('email').value || document.getElementById('email').placeholder;
        const matricula = document.getElementById('matricula').value || document.getElementById('matricula').placeholder;
        const senha = document.getElementById('senha').value;
        const idPerfil = document.getElementById('idPerfil').value;

        authFetch(`/api/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nomeUsuario, email, matricula, senha, idPerfil })
        })
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro ao atualizar usuário:', response.statusText);
                throw new Error('Falha ao atualizar usuário.');
            }
            return data;
        })
        .then(data => {
            if (data.success) {
                alert('Usuário atualizado com sucesso!');
                location.href = '/users'; // Redirecionar para a lista de usuários
            } else {
                alert('Falha ao atualizar usuário: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao atualizar usuário: ' + error.message);
        });
    });
});
