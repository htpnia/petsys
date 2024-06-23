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
                    item.classList.add('list-group-item');
                    item.innerHTML = `
                        <span class="module-info">${module.nomeModulo} - ${module.descricao}</span>
                        <span class="module-buttons">
                            <button class="editBtn" onclick="location.href='/editModule?id=${module.idModulo}'">✒️</button>
                            <button class="deleteBtn" onclick="deleteModule(${module.idModulo})">❌</button>
                        </span>
                    `;
                    item.addEventListener('click', () => showModal(module.nomeModulo, module.descricao));
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

function showModal(title, body) {
    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    modalTitle.innerText = title;
    modalBody.innerText = body;
    modal.style.display = "block";

    const span = document.getElementsByClassName('close')[0];
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

document.addEventListener('DOMContentLoaded', loadModules);
