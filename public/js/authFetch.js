async function authFetch(url, options = {}) { // Define um valor padrão vazio para options
    try {
        const token = localStorage.getItem('token'); // Supondo que você armazene o token localmente
        if (token) {
            if (!options.headers) {
                options.headers = {};
            }
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        console.log('Enviando requisição para:', url);
        console.log('Opções da requisição:', options);

        const response = await fetch(url, options);
        
        if (!response.ok) {
            console.error('Erro na resposta da requisição:', response);
            throw new Error('Falha na requisição: ' + response.statusText);
        }
        
        return response;
    } catch (error) {
        console.error('Erro na authFetch:', error);
        throw error;
    }
}
