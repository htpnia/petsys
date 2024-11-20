document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const moduleId = urlParams.get('id');

    if (!moduleId) {
        alert('ID do módulo não fornecido.');
        return;
    }

    console.log('ID do módulo:', moduleId); 

    
    authFetch(`/api/modulos/${moduleId}`, { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao carregar dados do módulo.');
            }
            const module = data.modulo;
            console.log('Dados do módulo carregados:', module);
            if (module && module.idModulo && module.nomeModulo && module.descricao) {
                document.getElementById('moduleId').value = module.idModulo;
                document.getElementById('nomeModulo').value = module.nomeModulo;
                document.getElementById('descricaoModulo').value = module.descricao;
            } else {
                console.error('Dados do módulo incompletos:', module);
                alert('Erro ao carregar dados do módulo.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
            alert(error.message);
        });

    const editModuleForm = document.getElementById('editModuleForm');
    if (editModuleForm) {
        editModuleForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const id = document.getElementById('moduleId').value;
            const nomeModulo = document.getElementById('nomeModulo').value;
            const descricaoModulo = document.getElementById('descricaoModulo').value;

            console.log('Enviando dados para atualizar módulo:', { nomeModulo, descricaoModulo });

            authFetch(`/api/modulos/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ nomeModulo, descricao: descricaoModulo })
            })
            .then(({ data, response }) => {
                if (!response.ok) {
                    console.error('Erro na resposta do servidor:', response.statusText);
                    throw new Error('Falha ao atualizar módulo.');
                }
                if (data.success) {
                    alert('Pet atualizado com sucesso!');
                    window.location.href = '/pets';
                } else {
                    alert('Falha ao atualizar módulo: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao atualizar módulo: ' + error.message);
            });
        });

        const cancelButton = document.querySelector('.cancel');
        if (cancelButton) {
            cancelButton.addEventListener('click', function(event) {
                event.preventDefault();
                window.location.href = '/pets';
            });
        }
    } else {
        console.error('Elemento editModuleForm não encontrado');
    }
});
