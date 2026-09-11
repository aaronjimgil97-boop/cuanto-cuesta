/* ============================================================
   Datos base del coste de una boda en España (€).
   Referencia: Informe del Sector Nupcial (Bodas.net) y guías
   del sector, coste medio ~25.000 € para ~100-130 invitados.
   AJUSTA A TU CASO.
   ============================================================ */
const BANQUETE_PP = {
  economico: 90,
  medio: 150,
  premium: 240,
};

const BARRA_LIBRE_PP_HORA = 6;

const ESPACIO_ALQUILER = 3500; // finca con alquiler exclusivo aparte del catering

const EXTRAS_NIVEL = {
  basico: { fotografia: 900, musica: 500, flores: 300, vestuario: 1200, papeleria: 150 },
  medio: { fotografia: 1500, musica: 900, flores: 600, vestuario: 2200, papeleria: 250 },
  alto: { fotografia: 2500, musica: 1400, flores: 1200, vestuario: 4000, papeleria: 400 },
};

const STORAGE_KEY = "cc_boda";

function calcular() {
  const invitados = Number(document.getElementById("invitados").value) || 0;
  const banquete = document.getElementById("banquete").value;
  const horasBarraLibre = Number(document.getElementById("barraLibre").value);
  const conEspacio = document.getElementById("espacio").value === "si";
  const nivelExtras = document.getElementById("nivelExtras").value;

  const extras = EXTRAS_NIVEL[nivelExtras];

  const items = [
    { nombre: `Banquete (${invitados} invitados)`, valor: Math.round(invitados * BANQUETE_PP[banquete]) },
  ];

  if (horasBarraLibre > 0) {
    items.push({
      nombre: `Barra libre (${horasBarraLibre}h)`,
      valor: Math.round(invitados * BARRA_LIBRE_PP_HORA * horasBarraLibre),
    });
  }

  if (conEspacio) items.push({ nombre: "Alquiler del espacio", valor: ESPACIO_ALQUILER });

  items.push(
    { nombre: "Fotografía y vídeo", valor: extras.fotografia },
    { nombre: "Música / DJ", valor: extras.musica },
    { nombre: "Flores y decoración", valor: extras.flores },
    { nombre: "Vestuario y alianzas", valor: extras.vestuario },
    { nombre: "Invitaciones y papelería", valor: extras.papeleria }
  );

  const total = items.reduce((sum, item) => sum + item.valor, 0);
  const porInvitado = invitados > 0 ? Math.round(total / invitados) : 0;

  CC.pintarRecibo("receipt", {
    icon: "💒",
    titulo: "Boda estimada",
    items,
    total,
    totalLabel: "Total estimado",
    nota: `Equivale a unos ${CC.euros(porInvitado)} por invitado. No incluye luna de miel ni anillo de compromiso. El coste medio en España en 2026 ronda los 25.000 € para 100-130 invitados.`,
  });

  CC.pintarBreadcrumb("breadcrumb", [
    { texto: "Inicio", href: "../index.html" },
    { texto: "Eventos", href: "../index.html#eventos" },
    { texto: "Boda" },
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
