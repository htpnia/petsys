document.addEventListener('DOMContentLoaded', function() {
    authFetch('/api/usuarios', {
        method: 'GET'
    })
    .then(({ data, response }) => {
        if (!response.ok) {
            console.error('Erro na resposta do servidor:', response.statusText);
            throw new Error('Falha ao carregar usuários');
        }

        console.log('Dados dos usuários:', data);
        
        if (!Array.isArray(data)) {
            console.error('Resposta não é um array:', data);
            throw new Error('Dados de usuários inválidos');
        }

        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        data.forEach(user => {
            const userLi = document.createElement('li');
            userLi.innerHTML = `
                Nome: ${user.nomeusuario}, Email: ${user.email}
                <button onclick="location.href='/editUser?id=${user.idUsuario}'">Editar</button>
                <button onclick="deleteUser(${user.idUsuario})">Excluir</button>
            `;
            userList.appendChild(userLi);
        });
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

function deleteUser(id) {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
        authFetch(`/api/usuarios/${id}`, {
            method: 'DELETE'
        })
        .then(({ data, response }) => {
            if (response === null || response.status === 204) {
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
