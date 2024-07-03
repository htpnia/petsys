document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const functionId = urlParams.get('id');

    if (!functionId) {
        alert('ID da função não fornecido.');
        return;
    }

    console.log('ID da função:', functionId); // Log the function ID

    // Load function data
    authFetch(`/api/funcoes/${functionId}`, { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao carregar dados da função.');
            }
            const funcao = data.funcao;
            console.log('Dados da função carregados:', funcao);
            if (funcao && funcao.idFuncao && funcao.nomeFuncao && funcao.descricao) {
                document.getElementById('functionId').value = funcao.idFuncao;
                document.getElementById('nomeFuncao').value = funcao.nomeFuncao;
                document.getElementById('descricaoFuncao').value = funcao.descricao;
            } else {
                console.error('Dados da função incompletos:', funcao);
                alert('Erro ao carregar dados da função.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
            alert(error.message);
        });

    // Update function on form submit
    const editFunctionForm = document.getElementById('editFunctionForm');
    if (editFunctionForm) {
        editFunctionForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const id = document.getElementById('functionId').value;
            const nomeFuncao = document.getElementById('nomeFuncao').value;
            const descricaoFuncao = document.getElementById('descricaoFuncao').value;

            console.log('Enviando dados para atualizar função:', { nomeFuncao, descricaoFuncao });

            authFetch(`/api/funcoes/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ nomeFuncao, descricao: descricaoFuncao })
            })
            .then(({ data, response }) => {
                if (!response.ok) {
                    console.error('Erro na resposta do servidor:', response.statusText);
                    throw new Error('Falha ao atualizar função.');
                }
                console.log('Resposta da atualização da função:', data);
                if (data.success) {
                    alert('Função atualizada com sucesso!');
                    window.location.href = '/funcoestransacoes';
                } else {
                    alert('Falha ao atualizar função: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao atualizar função: ' + error.message);
            });
        });

        const cancelButton = document.querySelector('.cancel');
        if (cancelButton) {
            cancelButton.addEventListener('click', function(event) {
                event.preventDefault();
                window.location.href = '/funcoestransacoes';
            });
        }
    } else {
        console.error('Elemento editFunctionForm não encontrado');
    }
});
