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

        document.getElementById('userId').value = user.idUsuario;
        document.getElementById('nomeUsuario').value = '';
        document.getElementById('nomeUsuario').placeholder = user.nomeUsuario;
        document.getElementById('email').value = '';
        document.getElementById('email').placeholder = user.email;
        document.getElementById('matricula').value = '';
        document.getElementById('matricula').placeholder = user.matricula;
        document.getElementById('acessoSistema').checked = user.acessoSistema;

        const perfilSelect = document.getElementById('idPerfil');
        perfilSelect.innerHTML = '';
        perfis.forEach(perfil => {
            const option = document.createElement('option');
            option.value = perfil.idPerfil;
            option.textContent = perfil.nomePerfil;
            perfilSelect.appendChild(option);
        });

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
        const acessoSistema = document.getElementById('acessoSistema').checked;

        console.log('Dados enviados para atualizar usuário:', { nomeUsuario, email, matricula, senha, idPerfil, acessoSistema });

        authFetch(`/api/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ nomeUsuario, email, matricula, senha, idPerfil, acessoSistema })
        })
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro ao atualizar usuário:', response.statusText);
                throw new Error('Falha ao atualizar usuário.');
            }
            if (data.success) {
                alert('Usuário atualizado com sucesso!');
                location.href = '/users';
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
