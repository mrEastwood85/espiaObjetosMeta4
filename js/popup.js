const overlay = document.getElementById("popup-overlay");
const title = document.getElementById("popup-title");
const body = document.getElementById("popup-body");
const btnClose = document.getElementById("popup-close");
const btnOk = document.getElementById("popup-ok");

// Mostrar popup
function showPopup(message, type = "info") {
  const config = {
    success: { title: "Éxito", color: "#16a34a" },
    error: { title: "Error", color: "#dc2626" },
    warning: { title: "Aviso", color: "#f59e0b" },
    info: { title: "Info", color: "#2563eb" }
  };

  const t = config[type];

  title.textContent = t.title;
  body.textContent = message;
  btnOk.style.background = t.color;

  overlay.classList.add("active");
}

// Ocultar popup (con animación)
function closePopup() {
  overlay.classList.remove("active");
}

// Eventos
btnClose.addEventListener("click", closePopup);
btnOk.addEventListener("click", closePopup);

// Click fuera
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closePopup();
});

// ESC para cerrar
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePopup();
});