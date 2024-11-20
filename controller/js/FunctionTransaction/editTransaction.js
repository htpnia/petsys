document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('id');

    if (!transactionId) {
        alert('ID da transação não fornecido.');
        return;
    }

    authFetch(`/api/transacoes/${transactionId}`, { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao carregar dados da transação.');
            }
            const transacao = data.transacao;
            console.log('Dados da transação carregados:', transacao);
            if (transacao && transacao.idTransacao && transacao.nomeTransacao && transacao.descricao) {
                document.getElementById('transactionId').value = transacao.idTransacao;
                document.getElementById('nomeTransacao').value = transacao.nomeTransacao;
                document.getElementById('descricaoTransacao').value = transacao.descricao;
            } else {
                console.error('Dados da transação incompletos:', transacao);
                alert('Erro ao carregar dados da transação.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
            alert(error.message);
        });

    const editTransactionForm = document.getElementById('editTransactionForm');
    if (editTransactionForm) {
        editTransactionForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const id = document.getElementById('transactionId').value;
            const nomeTransacao = document.getElementById('nomeTransacao').value;
            const descricaoTransacao = document.getElementById('descricaoTransacao').value;

            console.log('Enviando dados para atualizar transação:', { nomeTransacao, descricaoTransacao });

            authFetch(`/api/transacoes/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ nomeTransacao, descricao: descricaoTransacao })
            })
            .then(({ data, response }) => {
                if (!response.ok) {
                    console.error('Erro na resposta do servidor:', response.statusText);
                    throw new Error('Falha ao atualizar transação.');
                }
                console.log('Resposta da atualização da transação:', data);
                if (data.success) {
                    alert('Doença atualizada com sucesso!');
                    window.location.href = '/necessidades';
                } else {
                    alert('Falha ao atualizar transação: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao atualizar transação: ' + error.message);
            });
        });

        const cancelButton = document.querySelector('.cancel');
        if (cancelButton) {
            cancelButton.addEventListener('click', function(event) {
                event.preventDefault();
                window.location.href = '/necessidades';
            });
        }
    } else {
        console.error('Elemento editTransactionForm não encontrado');
    }
});
