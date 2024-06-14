function navigateToPage(button) {
    const pageMapping = {
        "Dashboard": "../../view/Dashboard/dashboard.html",
        "Perfis": "../../view/Profile/profiles.html",
        "Usuários": "../../view/User/users.html",
        "Módulos":"../../view/Modules/modules.html",
        "Funções&Transações": "../../view/FunctionTransaction/functiontransaction.html",
    };

    const clickedButtonText = button.textContent.trim();
    const targetPage = pageMapping[clickedButtonText];

    if (targetPage) {
        window.location.href = targetPage;
    }

}
