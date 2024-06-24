document.addEventListener('DOMContentLoaded', function() {
    // Carregar funções e transações
    Promise.all([
        authFetch('/api/funcoes').then(({ data, response }) => {
            console.log('Resposta bruta da API de funções:', { data, response });
            if (!response.ok) {
                throw new Error('Erro ao carregar funções: ' + response.statusText);
            }
            return data;
        }).then(data => {
            console.log('Dados processados da API de funções:', data);
            if (!data.success || !data.funcoes) {
                throw new Error('Erro ao carregar funções');
            }
            return data.funcoes;
        }),
        authFetch('/api/transacoes').then(({ data, response }) => {
            console.log('Resposta bruta da API de transações:', { data, response });
            if (!response.ok) {
                throw new Error('Erro ao carregar transações: ' + response.statusText);
            }
            return data;
        }).then(data => {
            console.log('Dados processados da API de transações:', data);
            if (!data.success || !data.transacoes) {
                throw new Error('Erro ao carregar transações');
            }
            return data.transacoes;
        })
    ])
    .then(([funcoes, transacoes]) => {
        // Preencher o select de funções
        const funcoesSelect = document.getElementById('funcoesModulo');
        funcoes.forEach(funcao => {
            const option = document.createElement('option');
            option.value = funcao.idFuncao;
            option.textContent = funcao.nomeFuncao;
            funcoesSelect.appendChild(option);
        });

        // Preencher o select de transações
        const transacoesSelect = document.getElementById('transacoesModulo');
        transacoes.forEach(transacao => {
            const option = document.createElement('option');
            option.value = transacao.idTransacao;
            option.textContent = transacao.nomeTransacao;
            transacoesSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar funções ou transações:', error);
    });

    // Submeter o formulário de cadastro de módulo
    document.getElementById('formModule').addEventListener('submit', function(event) {
        event.preventDefault();  // Impede que o formulário seja submetido de maneira convencional

        const nomeModulo = document.getElementById('nomeModulo').value;
        const descricao = document.getElementById('descricaoModulo').value;
        const funcoes = Array.from(document.getElementById('funcoesModulo').selectedOptions).map(option => option.value);
        const transacoes = Array.from(document.getElementById('transacoesModulo').selectedOptions).map(option => option.value);

        const moduleData = {
            nomeModulo: nomeModulo,
            descricao: descricao,
            funcoes: funcoes,
            transacoes: transacoes
        };

        console.log('Dados do registro de módulo:', moduleData);  // Loga os dados do registro no console para verificação

        authFetch('/cadmodulo', {  // Atualizado para a rota correta
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(moduleData)
        })
        .then(response => {
            console.log('Resposta da API de cadastro de módulo:', response);
            if (!response.ok) {
                throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados da resposta da API de cadastro de módulo:', data);
            if (data.success) {
                alert('Módulo cadastrado com sucesso!');
                window.location.href = '/modulos'; // Redirecionar para a lista de módulos
            } else {
                alert('Falha no cadastro do módulo: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha no cadastro do módulo: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
        });
    });
});
