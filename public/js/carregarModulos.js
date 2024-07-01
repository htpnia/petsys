document.addEventListener('DOMContentLoaded', loadModules);

function loadModules() {
    authFetch('/api/modulos', { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                throw new Error('Falha ao carregar módulos');
            }
            const modules = data;
            const list = document.getElementById('moduleList');
            list.innerHTML = '';
            if (Array.isArray(modules)) {
                modules.forEach(module => {
                    fetchModuleDetails(module.idModulo).then(details => {
                        const item = document.createElement('li');
                        item.classList.add('list-group-item');
                        item.innerHTML = `
                            <span class="module-info">${module.nomeModulo}</span>
                            <span class="module-buttons">
                                <button class="editBtn" onclick="location.href='/editModule?id=${module.idModulo}'; event.stopPropagation();">✒️</button>
                                <button class="deleteBtn" onclick="deleteModule(${module.idModulo}); event.stopPropagation();">❌</button>
                            </span>
                        `;
                        item.addEventListener('click', () => showModal(module.nomeModulo, module.descricao, details));
                        list.appendChild(item);
                    }).catch(error => {
                        console.error('Erro ao carregar detalhes do módulo:', error);
                    });
                });
            } else {
                console.error('Resposta não é um array:', modules);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function fetchModuleDetails(idModulo) {
    const promises = [
        authFetch(`/api/modulos/${idModulo}/funcoes`, { method: 'GET' }),
        authFetch(`/api/modulos/${idModulo}/transacoes`, { method: 'GET' })
    ];

    return Promise.all(promises)
        .then(responses => {
            return Promise.all(responses.map(({ data, response }) => {
                if (!response.ok) {
                    throw new Error('Falha ao carregar detalhes do módulo');
                }
                return data;
            }));
        })
        .then(([funcoes, transacoes]) => {
            return { funcoes, transacoes };
        })
        .catch(error => {
            console.error('Erro ao buscar detalhes do módulo:', error);
            return { funcoes: [], transacoes: [] };
        });
}

function deleteModule(id) {
    if (confirm("Tem certeza que deseja excluir este módulo?")) {
        authFetch(`/api/modulos/${id}`, { method: 'DELETE' })
        .then(({ response }) => {
            if (response.status === 204) {
                alert('Módulo excluído com sucesso!');
                location.reload();
            } else {
                response.json().then(data => {
                    alert('Falha ao excluir módulo: ' + data.message);
                }).catch(error => {
                    alert('Falha ao excluir módulo: ' + error.message);
                });
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao excluir módulo: ' + error.message);
        });
    }
}

function showModal(title, body, details) {
    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    const funcoes = details.funcoes.map(funcao => `<li>${funcao.nomeFuncao}</li>`).join('');
    const transacoes = details.transacoes.map(transacao => `<li>${transacao.nomeTransacao}</li>`).join('');

    modalTitle.innerText = title;
    modalBody.innerHTML = `
        <div class="description">
        <p>${body}</p>
        </div>
        <h2>Funções</h2>
        <ul>${funcoes}</ul>
        <h2>Transações</h2>
        <ul>${transacoes}</ul>
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
