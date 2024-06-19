function loadProfiles() {
    fetch('/api/perfis')
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao carregar perfis');
            }
            return response.json();
        })
        .then(profiles => {
            const list = document.getElementById('profileList');
            list.innerHTML = '';
            if (Array.isArray(profiles)) {
                profiles.forEach(profile => {
                    const item = document.createElement('li');
                    item.textContent = `${profile.nomePerfil} - ${profile.descricao}`;
                    list.appendChild(item);
                });
            } else {
                console.error('Resposta não é um array:', profiles);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


document.addEventListener('DOMContentLoaded', loadProfiles);
