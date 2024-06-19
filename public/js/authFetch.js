function authFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    
    if (!options.headers) {
        options.headers = {};
    }

    options.headers['Authorization'] = `Bearer ${token}`;
    options.headers['Content-Type'] = 'application/json';

    console.log('Cabeçalhos da requisição:', options.headers); // Verifique os cabeçalhos no console

    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error('Falha na requisição: ' + err.message);
                });
            }
            return response.json();
        });
}
