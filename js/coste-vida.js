/* ============================================================
   Datos base por ciudad (€ / mes, persona sola).
   AJUSTA ESTOS NÚMEROS a la fuente que quieras usar
   (Idealista, Numbeo, tus propios datos, etc.)
   ============================================================ */
const CIUDADES = {
  madrid: {
    nombre: "Madrid",
    alquiler: { compartido: 480, individual: 950 },
    suministros: 110,
    comida: 220,
    transporte: 55,
    gimnasio: 35,
  },
  barcelona: {
    nombre: "Barcelona",
    alquiler: { compartido: 500, individual: 980 },
    suministros: 105,
    comida: 230,
    transporte: 45,
    gimnasio: 38,
  },
  valencia: {
    nombre: "Valencia",
    alquiler: { compartido: 350, individual: 700 },
    suministros: 90,
    comida: 190,
    transporte: 35,
    gimnasio: 30,
  },
};

// Multiplicador de ocio/comida según estilo de vida
const ESTILO_MULT = {
  ajustado: 0.75,
  moderado: 1,
  alto: 1.5,
};

const OCIO_BASE = 150; // € /mes en estilo "moderado"

function euros(n) {
  return n.toLocaleString("es-ES", { maximumFractionDigits: 0 }) + " €";
}

function leerParametros() {
  const params = new URLSearchParams(window.location.search);
  return { ciudad: params.get("ciudad") };
}

function calcular() {
  const ciudadId = document.getElementById("ciudad").value;
  const viviendaTipo = document.getElementById("vivienda").value;
  const estilo = document.getElementById("estilo").value;
  const transporte = document.getElementById("transporte").value === "si";
  const gimnasio = document.getElementById("gimnasio").value === "si";

  const ciudad = CIUDADES[ciudadId];
  const mult = ESTILO_MULT[estilo];

  const items = [
    { nombre: "Alquiler", valor: ciudad.alquiler[viviendaTipo] },
    { nombre: "Suministros (luz, agua, internet)", valor: ciudad.suministros },
    { nombre: "Comida", valor: Math.round(ciudad.comida * mult) },
    { nombre: "Ocio y salidas", valor: Math.round(OCIO_BASE * mult) },
  ];

  if (transporte) items.push({ nombre: "Transporte público", valor: ciudad.transporte });
  if (gimnasio) items.push({ nombre: "Gimnasio", valor: ciudad.gimnasio });

  const total = items.reduce((sum, item) => sum + item.valor, 0);

  pintarRecibo(ciudad.nombre, items, total);
}

function pintarRecibo(nombreCiudad, items, total) {
  const receipt = document.getElementById("receipt");

  const filas = items
    .map(
      (item) => `
      <div class="line-item">
        <span>${item.nombre}</span>
        <span class="amount">${euros(item.valor)}</span>
      </div>`
    )
    .join("");

  receipt.innerHTML = `
    <div class="receipt-title">
      <span>Vivir en ${nombreCiudad}</span>
      <span class="stamp">estimado</span>
    </div>
    ${filas}
    <div class="receipt-total">
      <span class="label">Total al mes</span>
      <span class="value expense">${euros(total)}</span>
    </div>
    <p class="receipt-note">Estimación orientativa para una persona. Los precios reales varían según barrio, antigüedad del contrato y hábitos personales.</p>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const { ciudad } = leerParametros();
  if (ciudad && CIUDADES[ciudad]) {
    document.getElementById("ciudad").value = ciudad;
  }

  document.getElementById("calc-form").addEventListener("input", calcular);
  calcular();
});
