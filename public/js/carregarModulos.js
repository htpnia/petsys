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
