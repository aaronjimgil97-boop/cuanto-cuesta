/* ============================================================
   Calculadora de eventos con invitados (comunión, bautizo,
   cumpleaños, despedida, aniversario, 18 años, jubilación).
   Datos en js/eventos-datos.js.
   ============================================================ */

const STORAGE_KEY = "cc_evento";

function calcular() {
  const tipoId = document.getElementById("tipo").value;
  const invitados = Number(document.getElementById("invitados").value) || 0;
  const nivel = document.getElementById("nivel").value;

  const evento = TIPOS_EVENTO[tipoId];
  const banquete = Math.round(invitados * evento.pp);
  const extras = evento.extras[nivel];

  const items = [
    { nombre: `Banquete / actividad (${invitados} invitados)`, valor: banquete },
    { nombre: "Decoración, fotos, regalos y detalles", valor: extras },
  ];

  const total = items.reduce((sum, item) => sum + item.valor, 0);
  const porInvitado = invitados > 0 ? Math.round(total / invitados) : 0;

  CC.pintarRecibo("receipt", {
    icon: evento.icon,
    titulo: evento.nombre,
    items,
    total,
    totalLabel: "Total estimado",
    nota: `Equivale a unos ${CC.euros(porInvitado)} por invitado. Estimación orientativa, ajusta el nivel según el proveedor y la zona.`,
  });

  CC.pintarBreadcrumb("breadcrumb", [
    { texto: "Inicio", href: "../index.html" },
    { texto: "Eventos", href: "../index.html#eventos" },
    { texto: evento.nombre },
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
