/* ============================================================
   Calculadora de préstamo personal (amortización francesa).
   ============================================================ */

const STORAGE_KEY = "cc_prestamo_personal";

function calcularCuota(capital, tipoAnualPct, meses) {
  const r = tipoAnualPct / 100 / 12;
  if (r === 0) return capital / meses;
  return (capital * r * Math.pow(1 + r, meses)) / (Math.pow(1 + r, meses) - 1);
}

function calcular() {
  const importe = Number(document.getElementById("importe").value) || 0;
  const interes = Number(document.getElementById("interes").value) || 0;
  const meses = Number(document.getElementById("meses").value);
  const comisionPct = Number(document.getElementById("comision").value) || 0;

  const cuota = calcularCuota(importe, interes, meses);
  const comisionEuros = Math.round(importe * (comisionPct / 100));
  const totalPagado = Math.round(cuota * meses) + comisionEuros;
  const totalIntereses = totalPagado - importe;

  const items = [
    { nombre: `Cuota mensual (${meses} meses al ${interes}%)`, valor: Math.round(cuota) },
    { nombre: "Total de intereses en todo el préstamo", valor: totalIntereses },
  ];

  if (comisionEuros > 0) items.push({ nombre: "Comisión de apertura (pago único)", valor: comisionEuros });

  CC.pintarRecibo("receipt", {
    icon: "💳",
    titulo: `Préstamo de ${CC.euros(importe)}`,
    subtitulo: `Coste total del préstamo: ${CC.euros(totalPagado)}`,
    items,
    total: Math.round(cuota),
    totalLabel: "Cuota mensual",
    nota: `En total pagarás ${CC.euros(totalPagado)} (capital + intereses${comisionEuros > 0 ? " + comisión" : ""}). Estimación informativa, no es una oferta vinculante de ninguna entidad.`,
  });

  CC.pintarBreadcrumb("breadcrumb", [
    { texto: "Inicio", href: "../index.html" },
    { texto: "Finanzas", href: "../index.html#finanzas" },
    { texto: "Préstamo personal" },
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
