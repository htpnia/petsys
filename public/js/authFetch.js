function authFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        return Promise.reject(new Error('Token não encontrado no localStorage'));
    }
    
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
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json().then(data => ({ data, response }));
        } else {
            return response.text().then(text => ({ data: text, response }));
        }
    });
}
