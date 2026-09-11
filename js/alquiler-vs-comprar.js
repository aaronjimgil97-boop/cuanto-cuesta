/* ============================================================
   Comparador alquiler vs. comprar: mismo cálculo de cuota que
   hipoteca.js, con los gastos de compra repartidos entre los
   meses del préstamo solo a efectos de comparación mensual.
   ============================================================ */

const STORAGE_KEY = "cc_alquiler_vs_comprar";

function calcularCuota(capital, tipoAnualPct, anios) {
  const r = tipoAnualPct / 100 / 12;
  const n = anios * 12;
  if (r === 0) return capital / n;
  return (capital * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function calcular() {
  const alquilerMensual = Number(document.getElementById("alquilerMensual").value) || 0;

  const precio = Number(document.getElementById("precio").value) || 0;
  const entradaPct = Number(document.getElementById("entrada").value) || 0;
  const interes = Number(document.getElementById("interes").value) || 0;
  const anios = Number(document.getElementById("anios").value);
  const gastosCompraPct = Number(document.getElementById("gastosCompra").value) || 0;
  const ibiAnual = Number(document.getElementById("ibi").value) || 0;
  const comunidad = Number(document.getElementById("comunidad").value) || 0;
  const seguroHogar = Number(document.getElementById("seguroHogar").value) || 0;

  const entradaEuros = Math.round(precio * (entradaPct / 100));
  const financiado = Math.max(precio - entradaEuros, 0);
  const cuota = calcularCuota(financiado, interes, anios);
  const ibiMes = ibiAnual / 12;
  const gastosCompraEuros = precio * (gastosCompraPct / 100);
  const gastosCompraMes = gastosCompraEuros / (anios * 12);

  const totalComprar = Math.round(cuota + ibiMes + comunidad + seguroHogar + gastosCompraMes);
  const totalAlquilar = Math.round(alquilerMensual);

  CC.pintarComparador("comparador", {
    opciones: [
      {
        icon: "🔑",
        titulo: "Alquilar",
        total: totalAlquilar,
        sub: "Solo el alquiler mensual",
      },
      {
        icon: "🏦",
        titulo: "Comprar",
        total: totalComprar,
        sub: `Cuota + IBI + comunidad + seguro + gastos de compra repartidos`,
      },
    ],
    nota: `Entrada: ${CC.euros(entradaEuros)} + ${CC.euros(Math.round(gastosCompraEuros))} de gastos de compra (pago único al principio, no mensual). Comparación informativa: comprar además genera patrimonio que el alquiler no genera.`,
  });

  CC.pintarBreadcrumb("breadcrumb", [
    { texto: "Inicio", href: "../index.html" },
    { texto: "Finanzas", href: "../index.html#finanzas" },
    { texto: "Alquiler vs. comprar" },
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
