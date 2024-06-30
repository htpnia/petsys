document.addEventListener('DOMContentLoaded', loadProfiles);

function loadProfiles() {
    authFetch('/api/perfis', { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao carregar perfis');
            }
            const perfis = data;
            console.log('Perfis carregados:', perfis);
            const list = document.getElementById('profileList');
            list.innerHTML = '';
            if (Array.isArray(perfis)) {
                perfis.forEach(perfil => {
                    const item = document.createElement('li');
                    item.classList.add('list-group-item');
                    item.innerHTML = `
                        <span class="profile-info">${perfil.nomePerfil} - ${perfil.descricao}</span>
                        <span class="profile-buttons">
                            <button class="editBtn">✒️</button>
                            <button class="deleteBtn">❌</button>
                        </span>
                    `;
                    item.addEventListener('click', (event) => {
                        if (!event.target.classList.contains('editBtn') && !event.target.classList.contains('deleteBtn')) {
                            showModal(perfil);
                        }
                    });

                    const editBtn = item.querySelector('.editBtn');
                    const deleteBtn = item.querySelector('.deleteBtn');

                    editBtn.addEventListener('click', (event) => {
                        event.stopPropagation();
                        location.href = `/editProfile?id=${perfil.idPerfil}`;
                    });

                    deleteBtn.addEventListener('click', (event) => {
                        event.stopPropagation();
                        deleteProfile(perfil.idPerfil);
                    });

                    list.appendChild(item);
                });
            } else {
                console.error('Resposta não é um array:', perfis);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function deleteProfile(id) {
    if (confirm("Tem certeza que deseja excluir este perfil?")) {
        authFetch(`/api/perfis/${id}`, { method: 'DELETE' })
        .then(({ response }) => {
            if (response.status === 204) {
                alert('Perfil excluído com sucesso!');
                location.reload();
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

function fetchModulesByProfile(idPerfil) {
    return authFetch(`/api/perfis/${idPerfil}/modulos`, { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao carregar módulos');
            }
            return data;
        })
        .catch(error => {
            console.error('Erro ao carregar módulos:', error);
            return [];
        });
}

function showModal(perfil) {
    fetchModulesByProfile(perfil.idPerfil).then(modulos => {
        const modal = document.getElementById('infoModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        const modulosList = modulos.map(modulo => `<li>${modulo.nomeModulo}</li>`).join('');

        modalTitle.innerText = perfil.nomePerfil;
        modalBody.innerHTML = `
            <p>${perfil.descricao}</p>
            <h3>Módulos Associados</h3>
            <ul>${modulosList}</ul>
        `;
        modal.style.display = "block";

        const span = document.getElementsByClassName('close')[0];
        span.onclick = function() {
            modal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    });
}
