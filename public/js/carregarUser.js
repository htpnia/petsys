document.addEventListener('DOMContentLoaded', function() {
    authFetch('/api/usuarios', {
        method: 'GET'
    })
    .then(data => {
        const userList = document.getElementById('userList');
        data.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.innerHTML = `
                Nome: ${user.nomeusuario}, Email: ${user.email}
                <button onclick="editUser(${user.idUsuario})">Editar</button>
                <button onclick="deleteUser(${user.idUsuario})">Excluir</button>
            `;
            userList.appendChild(userDiv);
        });
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

function editUser(id) {
    const nomeusuario = prompt("Digite o novo nome:");
    const email = prompt("Digite o novo email:");
    const matricula = prompt("Digite a nova matrícula:");
    const senha = prompt("Digite a nova senha:");
    const idPerfil = prompt("Digite o novo perfil ID:");

    authFetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ nomeusuario, email, matricula, senha, idPerfil })
    })
    .then(data => {
        if (data.success) {
            alert('Usuário atualizado com sucesso!');
            location.reload(); // Recarregar a página para mostrar os dados atualizados
        } else {
            alert('Falha ao atualizar usuário: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao atualizar usuário: ' + error.message);
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
                return response.json().then(data => {
                    alert('Falha ao excluir usuário: ' + data.message);
                });
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao excluir usuário: ' + error.message);
        });
    }
}