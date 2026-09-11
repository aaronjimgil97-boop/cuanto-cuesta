/* ============================================================
   Calculadora de coste de un hijo según la etapa.
   Datos en js/hijo-datos.js.
   ============================================================ */

const STORAGE_KEY = "cc_hijo";

function actualizarCamposVisibles() {
  const etapa = document.getElementById("etapa").value;
  const esUniversidad = etapa === "universidad";

  document.getElementById("campo-alojamiento").style.display = esUniversidad ? "block" : "none";
  document.getElementById("campo-extraescolares").style.display = esUniversidad ? "none" : "block";
  document.getElementById("campo-comedor").style.display = esUniversidad ? "none" : "block";
  document.getElementById("campo-campamento").style.display = esUniversidad ? "none" : "block";

  document.getElementById("label-centro").textContent = esUniversidad ? "Tipo de universidad" : "Tipo de colegio";
  document.getElementById("hint-centro").textContent = esUniversidad
    ? "Tasas de matrícula prorrateadas a lo largo del curso."
    : "Incluye la mensualidad y el material escolar.";
}

function calcular() {
  const etapaId = document.getElementById("etapa").value;
  const centroId = document.getElementById("centro").value;
  const nivelExtra = document.getElementById("extraescolares").value;
  const conComedor = document.getElementById("comedor").value === "si";
  const alojamientoId = document.getElementById("alojamiento").value;
  const conCampamento = document.getElementById("campamento").value === "si";

  const etapa = ETAPAS_HIJO[etapaId];
  const esUniversidad = etapaId === "universidad";

  const items = [{ nombre: esUniversidad ? "Matrícula (prorrateada)" : "Colegio", valor: etapa.centro[centroId] }];

  if (!esUniversidad && conComedor) items.push({ nombre: "Comedor escolar", valor: etapa.comedor });
  if (!esUniversidad) items.push({ nombre: "Extraescolares", valor: etapa.extraescolares[nivelExtra] });
  if (esUniversidad) items.push({ nombre: "Alojamiento", valor: etapa.alojamiento[alojamientoId] });

  items.push({ nombre: "Ropa y calzado", valor: etapa.ropa });
  items.push({ nombre: "Ocio", valor: etapa.ocio });

  if (!esUniversidad && conCampamento) items.push({ nombre: "Campamento de verano (amortizado)", valor: CAMPAMENTO_MES });

  const total = items.reduce((sum, item) => sum + item.valor, 0);

  CC.pintarRecibo("receipt", {
    icon: esUniversidad ? "🎓" : etapaId === "adolescente" ? "🧑" : "🎒",
    titulo: etapa.nombre,
    items,
    total,
    totalLabel: "Total al mes",
    nota: "Estimación orientativa. No incluye el gasto puntual de material al inicio de curso ni actividades extraordinarias (viajes de estudios, graduaciones...).",
  });

  CC.pintarBreadcrumb("breadcrumb", [
    { texto: "Inicio", href: "../index.html" },
    { texto: "Eventos", href: "../index.html#eventos" },
    { texto: etapa.nombre },
  ]);

  const form = document.getElementById("calc-form");
  CC.guardarFormulario(STORAGE_KEY, form);
  CC.sincronizarURL(form);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calc-form");
  CC.restaurarFormulario(STORAGE_KEY, form);
  CC.aplicarParamsAFormulario(form);

  actualizarCamposVisibles();

  document.getElementById("etapa").addEventListener("change", () => {
    actualizarCamposVisibles();
    calcular();
  });
  document.getElementById("calc-form").addEventListener("input", calcular);
  calcular();
});
