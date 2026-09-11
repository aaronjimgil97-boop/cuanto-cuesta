/* ============================================================
   Calculadora de ahorro con interés compuesto (aportación
   inicial + aportaciones mensuales, interés anual constante
   aplicado mensualmente).
   ============================================================ */

const STORAGE_KEY = "cc_ahorro";

function calcular() {
  const inicial = Number(document.getElementById("inicial").value) || 0;
  const mensual = Number(document.getElementById("mensual").value) || 0;
  const interesAnual = Number(document.getElementById("interes").value) || 0;
  const anios = Number(document.getElementById("anios").value) || 0;

  const r = interesAnual / 100 / 12;
  const n = anios * 12;

  let valorFinal;
  if (r === 0) {
    valorFinal = inicial + mensual * n;
  } else {
    valorFinal = inicial * Math.pow(1 + r, n) + mensual * ((Math.pow(1 + r, n) - 1) / r);
  }

  const totalAportado = inicial + mensual * n;
  const interesesGenerados = Math.round(valorFinal - totalAportado);

  const items = [
    { nombre: "Aportación inicial", valor: inicial },
    { nombre: `Aportaciones mensuales acumuladas (${n} meses)`, valor: Math.round(mensual * n) },
    { nombre: "Intereses generados", valor: interesesGenerados },
  ];

  CC.pintarRecibo("receipt", {
    icon: "📈",
    titulo: `Ahorro a ${anios} años`,
    items,
    total: Math.round(valorFinal),
    totalLabel: "Ahorro final estimado",
    esGasto: false,
    nota: `De los ${CC.euros(Math.round(valorFinal))} finales, ${CC.euros(Math.round(totalAportado))} son aportaciones tuyas y ${CC.euros(interesesGenerados)} son intereses generados. Proyección informativa, no garantiza rentabilidad futura.`,
  });

  CC.pintarBreadcrumb("breadcrumb", [
    { texto: "Inicio", href: "../index.html" },
    { texto: "Finanzas", href: "../index.html#finanzas" },
    { texto: "Ahorro" },
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
