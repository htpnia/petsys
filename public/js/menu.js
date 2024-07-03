document.addEventListener('DOMContentLoaded', function() {
    function navigateToPage(button) {
        const pageMapping = {
            "Dashboard": "/dashboard",
            "Perfis": "/perfis",
            "Usuários": "/users",
            "Módulos": "/modulos",
            "Funções&Transações": "/funcoestransacoes",
        };

        const clickedButtonText = button.textContent.trim();
        const targetPage = pageMapping[clickedButtonText];

        if (targetPage) {
            window.location.href = targetPage;
        }
    }

    function logout() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    document.querySelectorAll('.sideBarButtons button').forEach(button => {
        button.addEventListener('click', function() {
            navigateToPage(button);
        });
    });

    const logoutButton = document.querySelector('.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    } else {
        console.error('Elemento de logout não encontrado.');
    }
});
