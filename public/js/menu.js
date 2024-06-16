function navigateToPage(button) {
    const pageMapping = {
        "Dashboard": "/dashboard",
        "Perfis": "/perfis",
        "Usuários": "/users",
        "Módulos":"/modulos",
        "Funções&Transações": "/funcoestransacoes",
    };

    const clickedButtonText = button.textContent.trim();
    const targetPage = pageMapping[clickedButtonText];

    if (targetPage) {
        window.location.href = targetPage;
    }

}
