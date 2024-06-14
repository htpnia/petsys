document.getElementById('formModule').addEventListener('submit', function(event) {
    event.preventDefault();  // Impede que o formulário seja submetido de maneira convencional

    const nomeModulo = document.getElementById('nomeModulo').value;
    const descricaoModulo = document.getElementById('descricaoModulo').value;

    const moduleData = {
        nomeModulo: nomeModulo,
        descricaoModulo: descricaoModulo
    };

    console.log('Dados do registro de módulo:', moduleData);  // Loga os dados do registro no console para verificação

    fetch('/cadmodulo', {  // Atualizado para a rota correta
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(moduleData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);  // Lança um erro se a resposta não for OK
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Modulo cadastrado com sucesso!');
            window.location.href = '/modulos'; // Redirecionar para o painel de administração ou outra página relevante após o sucesso
        } else {
            alert('Falha no cadastro do modulo: ' + data.message);  // Mostra uma mensagem de erro se não for bem-sucedido
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no cadastro do modulo: ' + error.message);  // Mostra uma mensagem de erro em caso de falha na requisição
    });
});


document.getElementById('moduleForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const id = document.getElementById('moduleId').value;
    const name = document.getElementById('moduleName').value;
    const description = document.getElementById('moduleDescription').value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/modulos/${id}` : '/api/modulos';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeModulo: name, descricao: description }) // Nome dos campos deve ser consistente
    }).then(response => {
        if (!response.ok) {
            throw new Error('Falha na requisição: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        loadModules(); // Recarregar a lista de módulos
        document.getElementById('moduleForm').reset();
        document.getElementById('moduleId').value = ''; // Limpar o campo ID oculto
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Falha no cadastro: ' + error.message);
    });
});

function loadModules() {
    fetch('/api/modulos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao carregar módulos');
            }
            return response.json();
        })
        .then(modules => {
            const list = document.getElementById('moduleList');
            list.innerHTML = '';
            if (Array.isArray(modules)) {
                modules.forEach(module => {
                    const item = document.createElement('li');
                    item.textContent = `${module.nomeModulo} - ${module.descricao}`;
                    list.appendChild(item);
                });
            } else {
                console.error('Resposta não é um array:', modules);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


document.addEventListener('DOMContentLoaded', loadModules);
