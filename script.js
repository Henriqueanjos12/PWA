let installPromptEvent;

// Captura o evento beforeinstallprompt e exibe o botão de instalação
window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault(); // Evita que o popup padrão do navegador apareça
    installPromptEvent = event; // Armazena o evento

    // Exibe o botão de instalação
    const installButton = document.getElementById("installButton");
    installButton.style.display = "block";

    // Define o que acontece quando o botão é clicado
    installButton.addEventListener("click", () => {
        installPromptEvent.prompt(); // Exibe o popup de instalação

        installPromptEvent.userChoice.then((choice) => {
            if (choice.outcome === "accepted") {
                console.log("Usuário aceitou a instalação");
            } else {
                console.log("Usuário recusou a instalação");
            }
            installPromptEvent = null; // Reseta o evento após a interação
            installButton.style.display = "none"; // Oculta o botão após a escolha do usuário
        });
    });
});

// Oculta o botão se o app já estiver instalado
window.addEventListener("appinstalled", () => {
    console.log("PWA foi instalado!");
    document.getElementById("installButton").style.display = "none";
});

// Registra o Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker registrado com sucesso!"))
    .catch(err => console.log("Erro ao registrar o Service Worker:", err));
}
