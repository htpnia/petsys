document.getElementById('formFunction').addEventListener('submit', function(event) {
    event.preventDefault();  // Impede que o formulário seja submetido de maneira convencional

    const nomeFuncao = document.getElementById('nomeFuncao').value;
    const descricaoFuncao = document.getElementById('descricaoFuncao').value;

    const functionData = {
        nomeFuncao: nomeFuncao,
        descricaoFuncao: descricaoFuncao
    };

    console.log('Dados do registro de módulo:', functionData);  // Loga os dados do registro no console para verificação

    fetch('/cadfunction', {  // Atualizado para a rota correta
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(functionData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Funcao cadastrada com sucesso!');
            window.location.href = '/funcoestransacoes'; // Redirecionar para o painel de administração ou outra página relevante após o sucesso
        } else {
            alert('Falha no cadastro do modulo: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro da funcao: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
    });
});

document.addEventListener('DOMContentLoaded', function() {
    loadFunctions(); // Carrega as funções ao carregar a página
});

document.getElementById('functionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const id = document.getElementById('functionId').value; // Este input type="hidden" deve ser adicionado ao seu HTML se quiser suportar edição
    const name = document.getElementById('functionName').value;
    const description = document.getElementById('functionDescription').value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/funcoes/${id}` : '/api/funcoes';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeFuncao: name, descricao: description })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Função salva com sucesso!');
        } else {
            throw new Error(data.message);
        }
        loadFunctions(); // Recarrega a lista de funções
        document.getElementById('functionForm').reset();
        document.getElementById('functionId').value = ''; // Limpa o campo oculto após salvar
    })
    .catch((error) => {
        console.error('Erro:', error);
        alert('Falha ao salvar a função: ' + error.message);
    });
});

function loadFunctions() {
    fetch('/api/funcoes')
        .then(response => response.json())
        .then(functions => {
            const list = document.getElementById('functionList');
            list.innerHTML = ''; // Limpa a lista antes de adicionar novos itens
            functions.forEach(func => {
                const item = document.createElement('li');
                item.textContent = `${func.nomeFuncao} - ${func.descricao}`;
                item.appendChild(createDeleteButton(func.idFuncao));
                list.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar funções:', error);
        });
}

function createDeleteButton(id) {
    const btn = document.createElement('button');
    btn.textContent = 'Excluir';
    btn.onclick = function() {
        if (confirm('Tem certeza que deseja excluir esta função?')) {
            fetch(`/api/funcoes/${id}`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        loadFunctions(); // Recarrega a lista após excluir
                    } else {
                        throw new Error('Falha ao excluir função');
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    alert('Erro ao excluir função: ' + error.message);
                });
        }
    };
    return btn;
}
