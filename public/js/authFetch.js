function authFetch(url, options = {}) {
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Supondo que o token JWT esteja armazenado no localStorage
        'Content-Type': 'application/json',
        ...options.headers
    };

    return fetch(url, {
        ...options,
        headers
    })
    .then(response => {
        // Verificar se a resposta tem conteúdo antes de tentar parsear
        if (response.status === 204 || response.status === 205) {
            return null; // Respostas sem conteúdo
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            return response.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch (error) {
                    return text;
                }
            });
        }
    });
}
