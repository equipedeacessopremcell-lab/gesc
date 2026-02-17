// ===============================
// SISTEMA GLOBAL DE ALERTAS
// ===============================

const container = document.getElementById("toast-container");

function showToast(message, type = "error") {

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 5000);
}


// ===============================
// CAPTURA ERROS JS GERAIS
// ===============================

window.onerror = function (message, source, lineno, colno, error) {
  showToast(`Erro JS: ${message}`, "error");
};


// ===============================
// CAPTURA ERROS DE PROMISE (FETCH)
// ===============================

window.addEventListener("unhandledrejection", function (event) {
  showToast(`Erro Assíncrono: ${event.reason}`, "error");
});


// ===============================
// INTERCEPTA console.error
// ===============================

const originalConsoleError = console.error;

console.error = function (...args) {
  showToast(args.join(" "), "error");
  originalConsoleError.apply(console, args);
};