document.addEventListener('DOMContentLoaded', loadProfiles);

function loadProfiles() {
    authFetch('/api/perfis')
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao carregar perfis');
            }
            return data;
        })
        .then(profiles => {
            console.log('Perfis carregados:', profiles);
            const list = document.getElementById('profileList');
            list.innerHTML = '';
            if (Array.isArray(profiles)) {
                profiles.forEach(profile => {
                    const item = document.createElement('li');
                    item.innerHTML = `
                        ${profile.nomePerfil} - ${profile.descricao}
                        <button onclick="location.href='/editProfile?id=${profile.idPerfil}'">Editar</button>
                        <button onclick="deleteProfile(${profile.idPerfil})">Excluir</button>
                    `;
                    list.appendChild(item);
                });
            } else {
                console.error('Resposta não é um array:', profiles);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function deleteProfile(id) {
    if (confirm("Tem certeza que deseja excluir este perfil?")) {
        authFetch(`/api/perfis/${id}`, {
            method: 'DELETE'
        })
        .then(({ data, response }) => {
            if (response === null || response.status === 204) {
                alert('Perfil excluído com sucesso!');
                location.reload(); // Recarregar a página para remover o perfil excluído
            } else {
                response.json().then(data => {
                    alert('Falha ao excluir perfil: ' + data.message);
                }).catch(error => {
                    alert('Falha ao excluir perfil: ' + error.message);
                });
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao excluir perfil: ' + error.message);
        });
    }
}