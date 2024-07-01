document.addEventListener('DOMContentLoaded', loadUsers);

function loadUsers() {
    authFetch('/api/usuarios', { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao carregar usuários');
            }
            const usuarios = data;
            console.log('Usuários carregados:', usuarios);
            const list = document.getElementById('userList');
            list.innerHTML = '';
            if (Array.isArray(usuarios)) {
                usuarios.forEach(usuario => {
                    fetchProfileName(usuario.idPerfil).then(nomePerfil => {
                        const item = document.createElement('li');
                        item.classList.add('list-group-item');
                        item.innerHTML = `
                            <span class="user-info">${usuario.nomeUsuario}</span>
                            <span class="user-info">${usuario.matricula}</span>
                            <span class="user-info">${nomePerfil}</span>
                            <span class="user-buttons">
                                <button class="editBtn" onclick="location.href='/editUser?id=${usuario.idUsuario}'; event.stopPropagation();">✒️</button>
                                <button class="deleteBtn" onclick="deleteUser(${usuario.idUsuario}); event.stopPropagation();">❌</button>
                            </span>
                        `;
                        item.addEventListener('click', () => showModal(usuario, nomePerfil));
                        list.appendChild(item);
                    }).catch(error => {
                        console.error('Erro ao carregar perfil:', error);
                    });
                });
            } else {
                console.error('Resposta não é um array:', usuarios);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function fetchProfileName(idPerfil) {
    return authFetch(`/api/perfis/${idPerfil}`, { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao carregar perfil');
            }
            return data.perfil.nomePerfil;
        })
        .catch(error => {
            console.error('Erro ao carregar perfil:', error);
            return 'Perfil não encontrado';
        });
}

function deleteUser(id) {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
        authFetch(`/api/usuarios/${id}`, {
            method: 'DELETE'
        })
        .then(({ response }) => {
            if (response.status === 204) {
                alert('Usuário excluído com sucesso!');
                location.reload();
            } else {
                response.json().then(data => {
                    alert('Falha ao excluir usuário: ' + data.message);
                }).catch(error => {
                    alert('Falha ao excluir usuário: ' + error.message);
                });
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao excluir usuário: ' + error.message);
        });
    }
}

function showModal(usuario, nomePerfil) {
    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    modalTitle.innerText = `${usuario.nomeUsuario}`;
    modalBody.innerHTML = `
        <p><strong>Nome:</strong></p> 
        <p>${usuario.nomeUsuario}</p>
        <p><strong>Matrícula:</strong></p> 
        <p>${usuario.matricula}</p>
        <p><strong>Email:</strong></p> 
        <p>${usuario.email}</p>
        <p><strong>Perfil:</strong></p>
        <p>${nomePerfil}</p>
        <p><strong>Acesso ao Sistema:</strong></p>
        <p>${usuario.acessoSistema ? 'Sim' : 'Não'}</p>
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
}
