function authFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        return Promise.reject(new Error('Token não encontrado no localStorage'));
    }

    const headers = {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
        ...options.headers
    };

    console.log('URL:', url);
    console.log('Token sendo enviado:', token);
    console.log('Headers sendo enviados:', headers);

    return fetch(url, {
        ...options,
        headers
    })
    .then(response => {
        console.log('Resposta do servidor:', response);

        if (response.status === 204 || response.status === 205) {
            return { data: null, response }; 
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
