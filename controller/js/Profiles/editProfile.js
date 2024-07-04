document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');

    if (!profileId) {
        alert('ID do perfil não fornecido.');
        return;
    }

    console.log('ID do perfil:', profileId); 

    authFetch(`/api/perfis/${profileId}`, { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao carregar dados do perfil.');
            }
            const profile = data.perfil;
            console.log('Dados do perfil carregados:', profile);
            if (profile && profile.idPerfil && profile.nomePerfil && profile.descricao) {
                document.getElementById('profileId').value = profile.idPerfil;
                document.getElementById('nomePerfil').value = profile.nomePerfil;
                document.getElementById('descricaoPerfil').value = profile.descricao;
            } else {
                console.error('Dados do perfil incompletos:', profile);
                alert('Erro ao carregar dados do perfil.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
            alert(error.message);
        });

    document.getElementById('editProfileForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const id = document.getElementById('profileId').value;
        const nomePerfil = document.getElementById('nomePerfil').value;
        const descricao = document.getElementById('descricaoPerfil').value;

        console.log('Enviando dados para atualizar perfil:', { nomePerfil, descricao });

        authFetch(`/api/perfis/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ nomePerfil, descricao })
        })
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao atualizar perfil.');
            }
            console.log('Resposta da atualização do perfil:', data);
            if (data.success) {
                alert('Perfil atualizado com sucesso!');
                window.location.href = '/perfis';
            } else {
                alert('Falha ao atualizar perfil: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao atualizar perfil: ' + error.message);
        });
    });
});
