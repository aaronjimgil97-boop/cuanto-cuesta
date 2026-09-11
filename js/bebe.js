/* ============================================================
   Datos base del primer año de un bebé (€ / mes).
   Referencias: estudios de Save the Children, OCU y guías
   de gasto de bebés en España. No incluye el gasto inicial
   (carrito, cuna, canastilla...). AJUSTA A TU CASO.
   ============================================================ */
const PANALES_MES = {
  economica: 45,
  estandar: 65,
  premium: 90,
};

const ALIMENTACION_MES = {
  lactancia: 15, // extractor, discos, complementos de la madre
  formula: 100,
};

const HIGIENE_MES = 25; // gel, champú, crema, colonia
const ROPA_MES = 45; // renovación por crecimiento

const GUARDERIA_MES = {
  no: 0,
  publica: 200,
  privada: 400,
};

const SEGURO_MEDICO_MES = 55;
const STORAGE_KEY = "cc_bebe";

function calcular() {
  const panales = document.getElementById("panales").value;
  const alimentacion = document.getElementById("alimentacion").value;
  const guarderia = document.getElementById("guarderia").value;
  const seguro = document.getElementById("seguro").value === "si";

  const items = [
    { nombre: "Pañales y toallitas", valor: PANALES_MES[panales] },
    { nombre: "Alimentación", valor: ALIMENTACION_MES[alimentacion] },
    { nombre: "Higiene", valor: HIGIENE_MES },
    { nombre: "Ropa y calzado", valor: ROPA_MES },
  ];

  if (guarderia !== "no") {
    items.push({
      nombre: guarderia === "publica" ? "Guardería pública" : "Guardería privada",
      valor: GUARDERIA_MES[guarderia],
    });
  }

  if (seguro) items.push({ nombre: "Seguro médico privado", valor: SEGURO_MEDICO_MES });

  const total = items.reduce((sum, item) => sum + item.valor, 0);

  CC.pintarRecibo("receipt", {
    icon: "👶",
    titulo: "Bebé — primer año",
    items,
    total,
    totalLabel: "Total al mes",
    nota: "Estimación orientativa del gasto recurrente mensual. No incluye el desembolso inicial en mobiliario y canastilla (carrito, cuna, trona...), que suele rondar entre 1.000 € y 2.000 €.",
  });

  CC.pintarBreadcrumb("breadcrumb", [
    { texto: "Inicio", href: "../index.html" },
    { texto: "Eventos", href: "../index.html#eventos" },
    { texto: "Bebé" },
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
