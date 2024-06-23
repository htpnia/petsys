document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Acesso negado. Você precisa estar logado para acessar esta página.');
        window.location.href = '/'; // Redirecionar para a página de login
        return;
    }

    authFetch('/api/dashboard', {
        method: 'GET'
    })
    .then(data => {
        console.log('Usuário autenticado:', data);
        alert("Usuário autenticado!");
        // Carregar a página ou executar ações adicionais
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Acesso negado. Você precisa estar logado para acessar esta página.');
        window.location.href = '/'; // Redirecionar para a página de login
    });
});
