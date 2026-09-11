/* ============================================================
   Calculadora de coste de un viaje por destino.
   Datos en js/viajes-datos.js.
   ============================================================ */

const STORAGE_KEY = "cc_vacaciones";

function calcular() {
  const destinoId = document.getElementById("destino").value;
  const dias = Number(document.getElementById("dias").value) || 0;
  const personas = Number(document.getElementById("personas").value) || 0;
  const nivel = document.getElementById("nivel").value;

  const destino = DESTINOS[destinoId];

  const vuelos = Math.round(destino.vueloIda * 2 * personas);
  const habitaciones = Math.ceil(personas / 2);
  const hotel = Math.round(destino.hotelNoche[nivel] * dias * habitaciones);
  const comida = Math.round(destino.comidaDia[nivel] * dias * personas);
  const transporte = Math.round(destino.transporteDia * dias * personas);
  const entradas = Math.round(destino.entradasDia * dias * personas);

  const items = [
    { nombre: `Vuelos ida y vuelta (${personas} personas)`, valor: vuelos },
    { nombre: `Hotel (${dias} noches, ${habitaciones} habitación/es)`, valor: hotel },
    { nombre: "Comida", valor: comida },
    { nombre: "Transporte local", valor: transporte },
    { nombre: "Entradas y actividades", valor: entradas },
  ];

  const total = items.reduce((sum, item) => sum + item.valor, 0);
  const porPersona = personas > 0 ? Math.round(total / personas) : 0;

  CC.pintarRecibo("receipt", {
    icon: "✈️",
    titulo: `Viaje a ${destino.nombre}`,
    subtitulo: `${dias} días · ${personas} persona(s)`,
    items,
    total,
    totalLabel: "Coste total del viaje",
    nota: `Equivale a unos ${CC.euros(porPersona)} por persona. Los precios de vuelos varían mucho según antelación y temporada; ajusta los datos de "${destino.nombre === "Otro destino (ajusta los datos a mano)" ? "tu destino" : destino.nombre}" en el archivo de datos si viajas en fechas muy señaladas.`,
  });

  CC.pintarBreadcrumb("breadcrumb", [
    { texto: "Inicio", href: "../index.html" },
    { texto: "Eventos", href: "../index.html#eventos" },
    { texto: destino.nombre },
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
