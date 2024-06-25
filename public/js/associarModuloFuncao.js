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

    // Carregar funções
    authFetch('/api/funcoes', { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                throw new Error('Falha ao carregar funções');
            }
            const functionList = document.getElementById('functionList');
            let funcoes = data;
            if (data && !Array.isArray(data)) {
                funcoes = data.funcoes;
            }
            if (Array.isArray(funcoes)) {
                funcoes.forEach(funcao => {
                    let checkbox = document.createElement('div');
                    checkbox.classList.add('function-checkbox');
                    checkbox.innerHTML = `
                        <input type="checkbox" id="funcao-${funcao.idFuncao}" name="funcao" value="${funcao.idFuncao}">
                        <label for="funcao-${funcao.idFuncao}">${funcao.nomeFuncao}</label>
                    `;
                    functionList.appendChild(checkbox);
                });
            } else {
                console.error('Resposta não é um array:', data);
                alert('Erro ao carregar funções: formato inesperado de dados');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar funções:', error);
            alert('Erro ao carregar funções: ' + error.message);
        });

    // Associar módulos a funções
    document.getElementById('moduleFunctionForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const moduleId = document.getElementById('moduleSelect').value;
        const selectedOptions = document.querySelectorAll('input[name="funcao"]:checked');
        const functionIds = Array.from(selectedOptions).map(option => option.value);

        console.log({ moduleId, functionIds }); // Confirme que os dados estão corretos

        authFetch('/api/modulosFuncoes/associar', {
            method: 'POST',
            body: JSON.stringify({ idModulo: moduleId, idFuncoes: functionIds })
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
