const container = document.getElementById("toast-container");

function showToast(message, type = "info", duration = 3000) {
	const icons = {
		success: "✔",
		error: "✖",
		warning: "⚠",
		info: "ℹ"
	};

	const toast = document.createElement("div");
	toast.className = `toast ${type}`;

	const icon = document.createElement("div");
	icon.className = "toast-icon";
	icon.textContent = icons[type];

	icon.addEventListener("mouseenter", () => {
		icon.textContent = "✕";
	});

	icon.addEventListener("mouseleave", () => {
		icon.textContent = icons[type];
	});

	const content = document.createElement("div");
	content.className = "toast-content";
	content.textContent = message;

	const progress = document.createElement("div");
	progress.className = "toast-progress";

	toast.appendChild(icon);
	toast.appendChild(content);
	toast.appendChild(progress);
	container.appendChild(toast);

	// Mostrar
	requestAnimationFrame(() => {
	toast.classList.add("show");
	});

	// Barra animada
	let start = Date.now();
	let remaining = duration;
	let frame;

	function animate() {
		const elapsed = Date.now() - start;
		const percent = Math.max(0, 1 - elapsed / remaining);
		progress.style.transform = `scaleX(${percent})`;

		if (elapsed < remaining) {
		  frame = requestAnimationFrame(animate);
		} else {
		  hide();
		}
	}

	function hide() {
		cancelAnimationFrame(frame); 
		toast.classList.remove("show");
		setTimeout(() => toast.remove(), 350);
	}

	frame = requestAnimationFrame(animate);

	// Hover pausa
	toast.addEventListener("mouseenter", () => {
		cancelAnimationFrame(frame);
		remaining -= (Date.now() - start);
	});

	toast.addEventListener("mouseleave", () => {
		start = Date.now();
		frame = requestAnimationFrame(animate);
	});
  
	icon.addEventListener("click", (e) => {
		e.stopPropagation(); // evita efectos raros
		hide();
	});
}