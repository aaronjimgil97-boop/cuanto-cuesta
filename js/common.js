const CC = {};

CC.initThemeToggle = function () {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const actual = () =>
    document.documentElement.getAttribute("data-theme") === "oscuro";

  const pintarBoton = () => {
    btn.textContent = actual() ? "☀️ Claro" : "🌙 Oscuro";
  };

  pintarBoton();

  btn.addEventListener("click", () => {
    const nuevoOscuro = !actual();

    if (nuevoOscuro) {
      document.documentElement.setAttribute("data-theme", "oscuro");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    try {
      localStorage.setItem(
        "cc-tema",
        nuevoOscuro ? "oscuro" : "claro"
      );
    } catch (e) {}

    pintarBoton();
  });
};

document.addEventListener("DOMContentLoaded", () => {
  CC.initThemeToggle();
});