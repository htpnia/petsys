document.addEventListener('DOMContentLoaded', function() {
    // Função para atualizar os contadores de cada card
    function updateCount(elementId, count) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerText = count;
        } else {
            console.error(`Elemento com ID ${elementId} não encontrado.`);
        }
    }

    // Função para carregar a contagem de um tipo específico
    function loadCount(type) {
        authFetch(`/api/count/${type}`)
            .then(({ data, response }) => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar contagem de ${type}: ${response.statusText}`);
                }
                return data.count;
            })
            .then(count => {
                updateCount(`${type}Count`, count);
            })
            .catch(error => {
                console.error(`Erro ao carregar contagem de ${type}:`, error);
            });
    }

    // Carregar as contagens para todos os tipos
    ['usuarios', 'perfis', 'modulos', 'funcoes', 'transacoes'].forEach(type => {
        loadCount(type);
    });
});

function downloadReport(type) {
    const urls = {
        usuarios: '/api/reports/usuarios',
        perfis: '/api/reports/perfis',
        modulos: '/api/reports/modulos',
        funcoes: '/api/reports/funcoes',
        transacoes: '/api/reports/transacoes'
    };

    if (urls[type]) {
        window.location.href = urls[type];
    } else {
        console.error('Tipo de relatório desconhecido:', type);
    }
}