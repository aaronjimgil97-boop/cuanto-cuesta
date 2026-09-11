/* ============================================================
   Comparador gasolina/diésel vs. eléctrico para un coche de
   segmento equivalente. Cifras de seguro/mantenimiento/impuesto
   representativas de un segmento medio (ver SEGMENTO_BASE en
   coches-datos.js para el mismo criterio usado en mantenimiento-coche).
   ============================================================ */

const STORAGE_KEY = "cc_gasolina_electrico";

const PRECIO_GASOLINA = 1.65;
const PRECIO_ELECTRICIDAD = { casa: 0.2, publica: 0.45 };

// Seguro, impuesto y mantenimiento típicos de un coche de segmento medio
const BASE_GASOLINA = { seguro: 55, impuesto: 10, mantenimiento: 35 };
const BASE_ELECTRICO = { seguro: 63, impuesto: 3, mantenimiento: 26 };

function calcular() {
  const kmAnual = Number(document.getElementById("km").value);
  const consumoGasolina = Number(document.getElementById("consumoGasolina").value) || 0;
  const consumoElectrico = Number(document.getElementById("consumoElectrico").value) || 0;
  const tipoRecarga = document.getElementById("tipoRecarga").value;

  const kmMes = kmAnual / 12;

  const gastoGasolina = Math.round((kmMes / 100) * consumoGasolina * PRECIO_GASOLINA);
  const gastoElectrico = Math.round((kmMes / 100) * consumoElectrico * PRECIO_ELECTRICIDAD[tipoRecarga]);

  const totalGasolina = Math.round(
    BASE_GASOLINA.seguro + BASE_GASOLINA.impuesto + BASE_GASOLINA.mantenimiento + gastoGasolina
  );
  const totalElectrico = Math.round(
    BASE_ELECTRICO.seguro + BASE_ELECTRICO.impuesto + BASE_ELECTRICO.mantenimiento + gastoElectrico
  );

  CC.pintarComparador("comparador", {
    opciones: [
      {
        icon: "⛽",
        titulo: "Gasolina / diésel",
        total: totalGasolina,
        sub: `Combustible: ${CC.euros(gastoGasolina)}/mes`,
      },
      {
        icon: "🔋",
        titulo: "Eléctrico",
        total: totalElectrico,
        sub: `Electricidad: ${CC.euros(gastoElectrico)}/mes`,
      },
    ],
    nota: "Comparación de gasto de uso mensual (energía, seguro, impuesto y mantenimiento) para un coche de segmento equivalente. No incluye la diferencia de precio de compra entre ambos.",
  });

  CC.pintarBreadcrumb("breadcrumb", [
    { texto: "Inicio", href: "../index.html" },
    { texto: "Vehículos", href: "../index.html#vehiculos" },
    { texto: "Gasolina vs. eléctrico" },
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
