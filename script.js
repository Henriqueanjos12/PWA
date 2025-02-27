if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker registrado!"))
    .catch(err => console.log("Erro no registro do Service Worker", err));
}