/* ============================================================
   Calculadora del coste total de la campaña de Navidad.
   ============================================================ */

const STORAGE_KEY = "cc_navidad";

function calcular() {
  const comensales = Number(document.getElementById("comensales").value) || 0;
  const numComidas = Number(document.getElementById("numComidas").value) || 0;
  const presupuestoComida = Number(document.getElementById("presupuestoComida").value) || 0;
  const numRegalos = Number(document.getElementById("numRegalos").value) || 0;
  const presupuestoRegalo = Number(document.getElementById("presupuestoRegalo").value) || 0;
  const decoracion = Number(document.getElementById("decoracion").value) || 0;
  const loteria = Number(document.getElementById("loteria").value) || 0;

  const comida = Math.round(comensales * numComidas * presupuestoComida);
  const regalos = Math.round(numRegalos * presupuestoRegalo);

  const items = [
    { nombre: `Comidas familiares (${comensales} personas × ${numComidas})`, valor: comida },
    { nombre: `Regalos (${numRegalos} personas)`, valor: regalos },
    { nombre: "Decoración", valor: decoracion },
    { nombre: "Lotería de Navidad", valor: loteria },
  ];

  const total = items.reduce((sum, item) => sum + item.valor, 0);

  CC.pintarRecibo("receipt", {
    icon: "🎄",
    titulo: "Navidad",
    items,
    total,
    totalLabel: "Total de la campaña",
    nota: "Estimación orientativa del coste total de las fiestas, no es un gasto mensual. Ajusta comensales, comidas y presupuestos a tu caso.",
  });

  CC.pintarBreadcrumb("breadcrumb", [
    { texto: "Inicio", href: "../index.html" },
    { texto: "Eventos", href: "../index.html#eventos" },
    { texto: "Navidad" },
  ]);

  const form = document.getElementById("calc-form");
  CC.guardarFormulario(STORAGE_KEY, form);
  CC.sincronizarURL(form);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calc-form");
  CC.restaurarFormulario(STORAGE_KEY, form);
  CC.aplicarParamsAFormulario(form);

  document.getElementById("calc-form").addEventListener("input", calcular);
  calcular();
});
