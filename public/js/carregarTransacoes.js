document.addEventListener('DOMContentLoaded', loadTransactions);

function loadTransactions() {
    authFetch('/api/transacoes')
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao carregar transações');
            }
            return data.transacoes; // Acesse o array de transações corretamente
        })
        .then(transacoes => {
            console.log('Transações carregadas:', transacoes);
            const list = document.getElementById('transactionList');
            list.innerHTML = '';
            if (Array.isArray(transacoes)) {
                transacoes.forEach(transacao => {
                    const item = document.createElement('li');
                    item.classList.add('list-group-item');
                    item.innerHTML = `
                        <span class="transaction-info">${transacao.nomeTransacao} - ${transacao.descricao}</span>
                        <span class="transaction-buttons">
                            <button class="editBtn" onclick="location.href='/editTransaction?id=${transacao.idTransacao}'">✒️</button>
                            <button class="deleteBtn" onclick="deleteTransaction(${transacao.idTransacao})">❌</button>
                        </span>
                    `;
                    item.addEventListener('click', () => showModal(transacao.nomeTransacao, transacao.descricao));
                    list.appendChild(item);
                });
            } else {
                console.error('Resposta não é um array:', transacoes);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function deleteTransaction(id) {
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
        authFetch(`/api/transacoes/${id}`, {
            method: 'DELETE'
        })
        .then(({ data, response }) => {
            if (response === null || response.status === 204) {
                alert('Transação excluída com sucesso!');
                location.reload();
            } else {
                response.json().then(data => {
                    alert('Falha ao excluir transação: ' + data.message);
                }).catch(error => {
                    alert('Falha ao excluir transação: ' + error.message);
                });
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao excluir transação: ' + error.message);
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
