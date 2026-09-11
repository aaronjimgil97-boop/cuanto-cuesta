/* ============================================================
   Calculadora de coste de ser autónomo.
   Tramos de cotización en js/autonomo-datos.js.
   ============================================================ */

const STORAGE_KEY = "cc_autonomo";
const SEGURO_RC_MES = 20;

function actualizarVisibilidad() {
  const tarifaPlana = document.getElementById("tarifaPlana").value === "si";
  document.getElementById("campo-rendimiento").style.display = tarifaPlana ? "none" : "block";
}

function calcular() {
  const tarifaPlana = document.getElementById("tarifaPlana").value === "si";
  const rendimientoNeto = Number(document.getElementById("rendimientoNeto").value) || 0;
  const gestoria = Number(document.getElementById("gestoria").value) || 0;
  const conSeguroRC = document.getElementById("seguroRC").value === "si";

  const cuota = tarifaPlana ? TARIFA_PLANA : cuotaPorRendimiento(rendimientoNeto);

  const items = [
    { nombre: tarifaPlana ? "Cuota de autónomos (tarifa plana)" : "Cuota de autónomos (RETA, por tramo)", valor: cuota },
    { nombre: "Gestoría", valor: gestoria },
  ];

  if (conSeguroRC) items.push({ nombre: "Seguro de responsabilidad civil", valor: SEGURO_RC_MES });

  const total = items.reduce((sum, item) => sum + item.valor, 0);

  CC.pintarRecibo("receipt", {
    icon: "💼",
    titulo: "Coste fijo de ser autónomo",
    items,
    total,
    totalLabel: "Total al mes",
    nota: tarifaPlana
      ? "La tarifa plana de 80 €/mes aplica el primer año (prorrogable) para nuevas altas. No incluye IRPF ni IVA."
      : "Cuota mínima del tramo que corresponde a tu rendimiento neto. Puedes elegir una base de cotización más alta dentro del tramo. No incluye IRPF ni IVA.",
  });

  CC.pintarBreadcrumb("breadcrumb", [
    { texto: "Inicio", href: "../index.html" },
    { texto: "Finanzas", href: "../index.html#finanzas" },
    { texto: "Autónomo" },
  ]);

  const form = document.getElementById("calc-form");
  CC.guardarFormulario(STORAGE_KEY, form);
  CC.sincronizarURL(form);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calc-form");
  CC.restaurarFormulario(STORAGE_KEY, form);
  CC.aplicarParamsAFormulario(form);

  actualizarVisibilidad();

  document.getElementById("tarifaPlana").addEventListener("change", () => {
    actualizarVisibilidad();
    calcular();
  });
  document.getElementById("calc-form").addEventListener("input", calcular);
  calcular();
});
