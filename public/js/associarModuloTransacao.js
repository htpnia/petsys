document.addEventListener('DOMContentLoaded', function() {
    // Carregar módulos
    authFetch('/api/modulos', { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                throw new Error('Falha ao carregar módulos');
            }
            const moduleSelect = document.getElementById('moduleSelect');
            let modulos = data;
            if (data && !Array.isArray(data)) {
                modulos = data.modulos;
            }
            if (Array.isArray(modulos)) {
                modulos.forEach(modulo => {
                    let option = new Option(modulo.nomeModulo, modulo.idModulo);
                    moduleSelect.add(option);
                });
            } else {
                console.error('Resposta não é um array:', data);
                alert('Erro ao carregar módulos: formato inesperado de dados');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar módulos:', error);
            alert('Erro ao carregar módulos: ' + error.message);
        });

    // Carregar transações
    authFetch('/api/transacoes', { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                throw new Error('Falha ao carregar transações');
            }
            const transactionList = document.getElementById('transactionList');
            let transacoes = data;
            if (data && !Array.isArray(data)) {
                transacoes = data.transacoes;
            }
            if (Array.isArray(transacoes)) {
                transacoes.forEach(transacao => {
                    let checkbox = document.createElement('div');
                    checkbox.innerHTML = `
                        <input type="checkbox" id="transacao-${transacao.idTransacao}" name="transacao" value="${transacao.idTransacao}">
                        <label for="transacao-${transacao.idTransacao}">${transacao.nomeTransacao}</label>
                    `;
                    transactionList.appendChild(checkbox);
                });
            } else {
                console.error('Resposta não é um array:', data);
                alert('Erro ao carregar transações: formato inesperado de dados');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar transações:', error);
            alert('Erro ao carregar transações: ' + error.message);
        });

    // Associar módulos a transações
    document.getElementById('moduleTransactionForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const moduleId = document.getElementById('moduleSelect').value;
        const selectedOptions = document.querySelectorAll('input[name="transacao"]:checked');
        const transactionIds = Array.from(selectedOptions).map(option => option.value);

        console.log({ moduleId, transactionIds }); // Confirme que os dados estão corretos

        authFetch('/api/modulosTransacoes/associar', {
            method: 'POST',
            body: JSON.stringify({ idModulo: moduleId, idTransacoes: transactionIds })
        }).then(({ data, response }) => {
            if (!response.ok) {
                throw new Error('Falha na requisição: ' + response.statusText);
            }
            alert('Associação realizada com sucesso!');
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Erro ao associar:', error);
            alert('Falha ao associar: ' + error.message);
        });
    });
});
