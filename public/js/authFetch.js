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
        console.log('Resposta do servidor:', response);
        
        // Verificar se a resposta tem conteúdo antes de tentar parsear
        if (response.status === 204 || response.status === 205) {
            return { data: null, response }; // Respostas sem conteúdo
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json().then(data => ({ data, response }));
        } else {
            return response.text().then(text => {
                try {
                    return { data: JSON.parse(text), response };
                } catch (error) {
                    return { data: text, response };
                }
            });
        }
    });
}
