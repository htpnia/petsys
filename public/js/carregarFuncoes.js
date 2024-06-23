document.addEventListener('DOMContentLoaded', loadFunctions);

function loadFunctions() {
    authFetch('/api/funcoes')
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao carregar funções');
            }
            return data.funcoes; // Acesse o array de funções corretamente
        })
        .then(funcoes => {
            console.log('Funções carregadas:', funcoes);
            const list = document.getElementById('functionList');
            list.innerHTML = '';
            if (Array.isArray(funcoes)) {
                funcoes.forEach(funcao => {
                    const item = document.createElement('li');
                    item.classList.add('list-group-item');
                    item.innerHTML = `
                        <span class="function-info">${funcao.nomeFuncao} - ${funcao.descricao}</span>
                        <span class="function-buttons">
                            <button class="editBtn" onclick="location.href='/editFunction?id=${funcao.idFuncao}'">✒️</button>
                            <button class="deleteBtn" onclick="deleteFunction(${funcao.idFuncao})">❌</button>
                        </span>
                    `;
                    item.addEventListener('click', () => showModal(funcao.nomeFuncao, funcao.descricao));
                    list.appendChild(item);
                });
            } else {
                console.error('Resposta não é um array:', funcoes);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function deleteFunction(id) {
    if (confirm("Tem certeza que deseja excluir esta função?")) {
        authFetch(`/api/funcoes/${id}`, {
            method: 'DELETE'
        })
        .then(({ data, response }) => {
            if (response === null || response.status === 204) {
                alert('Função excluída com sucesso!');
                location.reload();
            } else {
                response.json().then(data => {
                    alert('Falha ao excluir função: ' + data.message);
                }).catch(error => {
                    alert('Falha ao excluir função: ' + error.message);
                });
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao excluir função: ' + error.message);
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