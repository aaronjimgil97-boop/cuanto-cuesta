/* ============================================================
   Calculadora de hipoteca: sistema de amortización francés
   (cuota fija, la que usan casi todos los bancos en España).
   ============================================================ */

const STORAGE_KEY = "cc_hipoteca";

function calcularCuota(capital, tipoAnualPct, anios) {
  const r = tipoAnualPct / 100 / 12;
  const n = anios * 12;
  if (r === 0) return capital / n;
  return (capital * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function calcular() {
  const precio = Number(document.getElementById("precio").value) || 0;
  const entradaPct = Number(document.getElementById("entrada").value) || 0;
  const tipo = document.getElementById("tipo").value;
  const interes = Number(document.getElementById("interes").value) || 0;
  const anios = Number(document.getElementById("anios").value);
  const gastosCompraPct = Number(document.getElementById("gastosCompra").value) || 0;
  const ibiAnual = Number(document.getElementById("ibi").value) || 0;
  const comunidad = Number(document.getElementById("comunidad").value) || 0;
  const seguroHogar = Number(document.getElementById("seguroHogar").value) || 0;

  const entradaEuros = Math.round(precio * (entradaPct / 100));
  const financiado = Math.max(precio - entradaEuros, 0);
  const cuota = Math.round(calcularCuota(financiado, interes, anios));
  const ibiMes = Math.round(ibiAnual / 12);
  const gastosCompraEuros = Math.round(precio * (gastosCompraPct / 100));

  const items = [
    { nombre: `Cuota del préstamo (${tipo === "fijo" ? "fijo" : "variable"}, ${interes}%, ${anios} años)`, valor: cuota },
    { nombre: "IBI (mensualizado)", valor: ibiMes },
    { nombre: "Comunidad de propietarios", valor: comunidad },
    { nombre: "Seguro de hogar", valor: seguroHogar },
  ];

  const total = items.reduce((sum, item) => sum + item.valor, 0);

  CC.pintarRecibo("receipt", {
    icon: "🏦",
    titulo: `Hipoteca de ${CC.euros(financiado)}`,
    subtitulo: `Entrada: ${CC.euros(entradaEuros)} (${entradaPct}%) · Precio vivienda: ${CC.euros(precio)}`,
    items,
    total,
    totalLabel: "Coste mensual real",
    nota: `Además, calcula unos gastos de compra de ${CC.euros(gastosCompraEuros)} (impuestos, notaría, registro y gestoría), un pago único al formalizar la compra que no está incluido en el total mensual. Estimación informativa, no es una oferta ni asesoramiento financiero.`,
  });

  CC.pintarBreadcrumb("breadcrumb", [
    { texto: "Inicio", href: "../index.html" },
    { texto: "Finanzas", href: "../index.html#finanzas" },
    { texto: "Hipoteca" },
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
