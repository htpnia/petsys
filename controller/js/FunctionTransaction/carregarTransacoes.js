document.addEventListener('DOMContentLoaded', loadTransactions);

let allTransactions = []; // Variável para armazenar todas as transações

function loadTransactions() {
    authFetch('/api/transacoes', { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao carregar transações');
            }
            allTransactions = data.transacoes; // Armazena todas as transações
            console.log('Transações carregadas:', allTransactions);
            displayTransactions(allTransactions); // Exibe todas as transações inicialmente
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function displayTransactions(transactions) {
    const list = document.getElementById('transactionList');
    list.innerHTML = '';
    if (Array.isArray(transactions)) {
        transactions.forEach(transacao => {
            const item = document.createElement('li');
            item.classList.add('list-group-item');
            item.innerHTML = `
                <span class="transaction-info">${transacao.nomeTransacao}</span>
                <span class="transaction-buttons">
                    <button class="editBtn">✒️</button>
                    <button class="deleteBtn">❌</button>
                </span>
            `;
            item.addEventListener('click', (event) => {
                if (!event.target.classList.contains('editBtn') && !event.target.classList.contains('deleteBtn')) {
                    showModal(transacao.nomeTransacao, transacao.descricao);
                }
            });

            const editBtn = item.querySelector('.editBtn');
            const deleteBtn = item.querySelector('.deleteBtn');

            editBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                location.href = `/editTransaction?id=${transacao.idTransacao}`;
            });

            deleteBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                deleteTransaction(transacao.idTransacao);
            });

            list.appendChild(item);
        });
    } else {
        console.error('Resposta não é um array:', transactions);
    }
}

function deleteTransaction(id) {
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
        authFetch(`/api/transacoes/${id}`, { method: 'DELETE' })
        .then(({ response }) => {
            if (response.status === 204) {
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

function filterTransactions() {
    const searchTerm = document.getElementById('searchTransactionInput').value.toLowerCase();
    const filteredTransactions = allTransactions.filter(transacao => 
        transacao.nomeTransacao.toLowerCase().includes(searchTerm)
    );
    displayTransactions(filteredTransactions);
}
