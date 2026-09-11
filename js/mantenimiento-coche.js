/* ============================================================
   Lógica de la calculadora de mantenimiento de coche.
   Los datos (marcas, modelos, motorizaciones, precios) viven
   en coches-datos.js. Utilidades compartidas en common.js.
   ============================================================ */

const ANIO_ACTUAL = 2026;
const STORAGE_KEY = "cc_coche";

function poblarMarcas() {
  const select = document.getElementById("marca");
  const idsOrdenados = Object.keys(MARCAS).sort((a, b) =>
    MARCAS[a].nombre.localeCompare(MARCAS[b].nombre, "es")
  );
  select.innerHTML = idsOrdenados
    .map((id) => `<option value="${id}">${MARCAS[id].nombre}</option>`)
    .join("");
}

function poblarModelos(marcaId) {
  const select = document.getElementById("modelo");
  const modelos = MARCAS[marcaId].modelos;
  select.innerHTML = Object.keys(modelos)
    .map((id) => `<option value="${id}">${modelos[id].nombre}</option>`)
    .join("");
}

function poblarMotorizaciones(marcaId, modeloId) {
  const select = document.getElementById("motorizacion");
  const motorizaciones = MARCAS[marcaId].modelos[modeloId].motorizaciones;
  select.innerHTML = motorizaciones
    .map((m) => `<option value="${m.id}">${m.nombre}</option>`)
    .join("");
}

function poblarAnios(marcaId, modeloId) {
  const select = document.getElementById("anio");
  const anioMin = MARCAS[marcaId].modelos[modeloId].anioMin;
  const anios = [];
  for (let a = ANIO_ACTUAL; a >= anioMin; a--) anios.push(a);
  select.innerHTML = anios.map((a) => `<option value="${a}">${a}</option>`).join("");
}

function alCambiarMarca() {
  const marcaId = document.getElementById("marca").value;
  poblarModelos(marcaId);
  alCambiarModelo();
}

function alCambiarModelo() {
  const marcaId = document.getElementById("marca").value;
  const modeloId = document.getElementById("modelo").value;
  poblarMotorizaciones(marcaId, modeloId);
  poblarAnios(marcaId, modeloId);
  actualizarSilueta();
  calcular();
}

function actualizarSilueta() {
  const marcaId = document.getElementById("marca").value;
  const modeloId = document.getElementById("modelo").value;
  const carroceria = MARCAS[marcaId].modelos[modeloId].carroceria;

  ["hatchback", "sedan", "suv"].forEach((tipo) => {
    document.getElementById(`car-${tipo}`).style.display = tipo === carroceria ? "block" : "none";
  });

  actualizarColorSilueta();
}

function actualizarColorSilueta() {
  const colorId = document.getElementById("color").value;
  const hex = COLORES_COCHE[colorId].hex;
  document.querySelectorAll(".car-shape").forEach((el) => {
    el.style.fill = hex;
  });
}

function factorSeguroPorAntiguedad(antiguedad) {
  if (antiguedad <= 3) return 1.15;
  if (antiguedad <= 8) return 1.0;
  return 0.85;
}

function factorRevisionPorAntiguedad(antiguedad) {
  if (antiguedad <= 3) return 0.7;
  if (antiguedad <= 8) return 1.0;
  return 1.4;
}

function calcular() {
  const marcaId = document.getElementById("marca").value;
  const modeloId = document.getElementById("modelo").value;
  const motorId = document.getElementById("motorizacion").value;
  const anio = Number(document.getElementById("anio").value);
  const kmAnual = Number(document.getElementById("km").value);
  const conParking = document.getElementById("parking").value === "si";

  const marca = MARCAS[marcaId];
  const modelo = marca.modelos[modeloId];
  const motor = modelo.motorizaciones.find((m) => m.id === motorId);
  if (!motor) return; // el select de motorizaciones aún no se ha poblado

  const base = SEGMENTO_BASE[marca.segmento];
  const carroceriaFactor = CARROCERIA_MULT[modelo.carroceria];
  const antiguedad = ANIO_ACTUAL - anio;
  const esElectrico = motor.tipo === "electrico";

  const seguro = Math.round(
    base.seguro * carroceriaFactor * factorSeguroPorAntiguedad(antiguedad) * (esElectrico ? 1.15 : 1)
  );
  const revision = Math.round(
    base.revision * carroceriaFactor * factorRevisionPorAntiguedad(antiguedad) * (esElectrico ? 0.75 : 1)
  );
  const impuesto = Math.round(base.impuesto * (esElectrico ? 0.25 : 1));
  const itv = esElectrico ? 2 : 3;

  const kmMes = kmAnual / 12;
  let gastoEnergia;
  let nombreEnergia;

  if (esElectrico) {
    const kwhMes = (kmMes / 100) * motor.consumoKwh;
    gastoEnergia = Math.round(kwhMes * PRECIO_ELECTRICIDAD);
    nombreEnergia = "Electricidad (carga en casa)";
  } else {
    const precioLitro = PRECIO_COMBUSTIBLE[motor.tipo] || PRECIO_COMBUSTIBLE.gasolina;
    const litrosMes = (kmMes / 100) * motor.consumo;
    gastoEnergia = Math.round(litrosMes * precioLitro);
    nombreEnergia = motor.tipo === "hibrido" ? "Combustible (híbrido)" : "Combustible";
  }

  const items = [
    { nombre: "Seguro", valor: seguro },
    { nombre: "Impuesto de circulación", valor: impuesto },
    { nombre: "ITV (prorrateada)", valor: itv },
    { nombre: "Revisiones y averías", valor: revision },
    { nombre: nombreEnergia, valor: gastoEnergia },
  ];

  if (conParking) items.push({ nombre: "Plaza de garaje", valor: PARKING_MES });

  const total = items.reduce((sum, item) => sum + item.valor, 0);

  CC.pintarRecibo("receipt", {
    icon: esElectrico ? "🔋" : "🚗",
    titulo: `${marca.nombre} ${modelo.nombre} (${anio})`,
    subtitulo: motor.nombre,
    items,
    total,
    totalLabel: "Total al mes",
    nota: "Estimación orientativa. El seguro y el consumo real dependen de tu perfil de conductor, provincia y estilo de conducción.",
  });

  CC.pintarBreadcrumb("breadcrumb", [
    { texto: "Inicio", href: "../index.html" },
    { texto: "Vehículos", href: "../index.html#vehiculos" },
    { texto: `${marca.nombre} ${modelo.nombre}` },
  ]);

  const form = document.getElementById("calc-form");
  CC.guardarFormulario(STORAGE_KEY, form);
  CC.sincronizarURL(form);
}

document.addEventListener("DOMContentLoaded", () => {
  poblarMarcas();
  const form = document.getElementById("calc-form");

  CC.restaurarFormulario(STORAGE_KEY, form);
  CC.aplicarParamsAFormulario(form);

  const marcaInicial = MARCAS[document.getElementById("marca").value]
    ? document.getElementById("marca").value
    : "volkswagen";
  document.getElementById("marca").value = marcaInicial;
  poblarModelos(marcaInicial);

  CC.restaurarFormulario(STORAGE_KEY, form);
  CC.aplicarParamsAFormulario(form);

  const modelosDisponibles = MARCAS[marcaInicial].modelos;
  const modeloInicial = modelosDisponibles[document.getElementById("modelo").value]
    ? document.getElementById("modelo").value
    : Object.keys(modelosDisponibles)[0];
  document.getElementById("modelo").value = modeloInicial;

  poblarMotorizaciones(marcaInicial, modeloInicial);
  poblarAnios(marcaInicial, modeloInicial);

  CC.restaurarFormulario(STORAGE_KEY, form);
  CC.aplicarParamsAFormulario(form);

  actualizarSilueta();

  document.getElementById("marca").addEventListener("change", alCambiarMarca);
  document.getElementById("modelo").addEventListener("change", alCambiarModelo);
  document.getElementById("color").addEventListener("change", actualizarColorSilueta);
  document.getElementById("calc-form").addEventListener("input", calcular);

  calcular();
});
