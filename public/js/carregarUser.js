document.addEventListener('DOMContentLoaded', loadUsers);

function loadUsers() {
    authFetch('/api/usuarios')
        .then(response => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao carregar usuários');
            }
            return response.json(); // Converta a resposta para JSON
        })
        .then(usuarios => {
            console.log('Usuários carregados:', usuarios);
            const list = document.getElementById('userList');
            list.innerHTML = '';
            if (Array.isArray(usuarios)) {
                usuarios.forEach(usuario => {
                    const item = document.createElement('li');
                    item.classList.add('list-group-item');
                    item.innerHTML = `
                        <span class="user-info">${usuario.nomeUsuario}</span>
                        <span class="user-info">${usuario.matricula}</span>
                        <span class="user-info">${usuario.email}</span>
                        <span class="user-buttons">
                            <button class="editBtn" onclick="location.href='/editUser?id=${usuario.idUsuario}'">✒️</button>
                            <button class="deleteBtn" onclick="deleteUser(${usuario.idUsuario})">❌</button>
                        </span>
                    `;
                    item.addEventListener('click', () => showModal(usuario.nomeUsuario, usuario.email));
                    list.appendChild(item);
                });
            } else {
                console.error('Resposta não é um array:', usuarios);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function deleteUser(id) {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
        authFetch(`/api/usuarios/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.status === 204) {
                alert('Usuário excluído com sucesso!');
                location.reload(); // Recarregar a página para remover o usuário excluído
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

function showModal(title, body) {
    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    modalTitle.innerText = title;
    modalBody.innerText = body;
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
