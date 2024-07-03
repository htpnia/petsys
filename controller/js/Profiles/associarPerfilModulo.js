document.addEventListener('DOMContentLoaded', function() {
    // Carregar perfis
    authFetch('/api/perfis', { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                throw new Error('Falha ao carregar perfis');
            }
            const perfilSelect = document.getElementById('perfilSelect');
            let perfis = data;
            if (data && !Array.isArray(data)) {
                perfis = data.perfis;
            }
            if (Array.isArray(perfis)) {
                perfis.forEach(perfil => {
                    let option = new Option(perfil.nomePerfil, perfil.idPerfil);
                    perfilSelect.add(option);
                });
            } else {
                console.error('Resposta não é um array:', data);
                alert('Erro ao carregar perfis: formato inesperado de dados');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar perfis:', error);
            alert('Erro ao carregar perfis: ' + error.message);
        });

    // Carregar módulos
    authFetch('/api/modulos', { method: 'GET' })
        .then(({ data, response }) => {
            if (!response.ok) {
                throw new Error('Falha ao carregar módulos');
            }
            const moduleList = document.getElementById('moduleList');
            let modulos = data;
            if (data && !Array.isArray(data)) {
                modulos = data.modulos;
            }
            if (Array.isArray(modulos)) {
                modulos.forEach(modulo => {
                    let checkbox = document.createElement('div');
                    checkbox.classList.add('module-checkbox');
                    checkbox.innerHTML = `
                        <input type="checkbox" id="modulo-${modulo.idModulo}" name="modulo" value="${modulo.idModulo}">
                        <label for="modulo-${modulo.idModulo}">${modulo.nomeModulo}</label>
                    `;
                    moduleList.appendChild(checkbox);
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

    // Associar perfis a módulos
    document.getElementById('associateProfileModuleForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const perfilId = document.getElementById('perfilSelect').value;
        const selectedOptions = document.querySelectorAll('input[name="modulo"]:checked');
        const moduleIds = Array.from(selectedOptions).map(option => option.value);

        console.log({ perfilId, moduleIds }); // Confirme que os dados estão corretos

        authFetch('/api/perfilModulo/associar', {
            method: 'POST',
            body: JSON.stringify({ idPerfil: perfilId, idModulos: moduleIds })
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
