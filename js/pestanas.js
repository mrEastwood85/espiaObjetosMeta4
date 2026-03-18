// ===== Tabs =====
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");
const indicator = document.querySelector(".tab-indicator");

function moveIndicator(el) {
  indicator.style.width = el.offsetWidth + "px";
  indicator.style.left = el.offsetLeft + "px";
}

// Inicializar línea
moveIndicator(document.querySelector(".tab.active"));

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");

    moveIndicator(tab);

  });
});
