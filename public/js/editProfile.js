document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');

    if (!profileId) {
        alert('ID do perfil não fornecido.');
        return;
    }

    // Carregar dados do perfil
    authFetch(`/api/perfis/${profileId}`, { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao carregar dados do perfil.');
            }
            return data;
        })
        .then(profile => {
            // Preencher os campos do formulário com os dados do perfil
            document.getElementById('profileId').value = profile.idPerfil;
            document.getElementById('nomePerfil').value = profile.nomePerfil;
            document.getElementById('descricaoPerfil').value = profile.descricao;

            // Carregar módulos e associar funções e transações
            const modulosContainer = document.getElementById('modulosContainer');
            profile.Modulos.forEach(modulo => {
                const moduloDiv = document.createElement('div');
                moduloDiv.innerHTML = `
                    <h3>${modulo.nomeModulo}</h3>
                    <div>
                        <h4>Funções</h4>
                        ${modulo.Funcoes.map(funcao => `
                            <div>
                                <input type="checkbox" name="funcoes" value="${funcao.idFuncao}" ${profile.Funcoes.some(f => f.idFuncao === funcao.idFuncao) ? 'checked' : ''}> ${funcao.nomeFuncao}
                            </div>
                        `).join('')}
                    </div>
                    <div>
                        <h4>Transações</h4>
                        ${modulo.Transacoes.map(transacao => `
                            <div>
                                <input type="checkbox" name="transacoes" value="${transacao.idTransacao}" ${profile.Transacoes.some(t => t.idTransacao === transacao.idTransacao) ? 'checked' : ''}> ${transacao.nomeTransacao}
                            </div>
                        `).join('')}
                    </div>
                `;
                modulosContainer.appendChild(moduloDiv);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
            alert(error.message);
        });

    // Atualizar perfil ao enviar o formulário
    document.getElementById('editProfileForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const id = document.getElementById('profileId').value;
        const nomePerfil = document.getElementById('nomePerfil').value;
        const descricao = document.getElementById('descricaoPerfil').value;

        // Obter funções e transações selecionadas
        const funcoes = Array.from(document.querySelectorAll('input[name="funcoes"]:checked')).map(input => input.value);
        const transacoes = Array.from(document.querySelectorAll('input[name="transacoes"]:checked')).map(input => input.value);

        authFetch(`/api/perfis/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nomePerfil, descricao, funcoes, transacoes })
        })
        .then(({ data, response }) => {
            if (!response.ok) {
                console.error('Erro na resposta do servidor:', response.statusText);
                throw new Error('Falha ao atualizar perfil.');
            }
            return data;
        })
        .then(data => {
            if (data.success) {
                alert('Perfil atualizado com sucesso!');
                window.location.href = '/perfis'; // Redirecionar para a lista de perfis
            } else {
                alert('Falha ao atualizar perfil: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao atualizar perfil: ' + error.message);
        });
    });
});
