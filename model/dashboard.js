document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error('Token JWT não encontrado no localStorage');
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '/login'; // Redireciona para a página de login
    } else {
        // Carregar o conteúdo do dashboard se necessário
        console.log('Token JWT encontrado. Carregando o dashboard...');
    }
});
