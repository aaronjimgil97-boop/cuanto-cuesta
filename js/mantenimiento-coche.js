/* ============================================================
   Datos base por modelo (€ / mes).
   AJUSTA ESTOS NÚMEROS con tus propias tarifas de seguro,
   consumo real del coche, etc.
   ============================================================ */
const MODELOS = {
  "bmw-serie-3": {
    nombre: "BMW Serie 3",
    seguro: { nuevo: 75, usado: 60, viejo: 55 },
    impuesto: 14, // impuesto de circulación prorrateado al mes
    itv: 3, // coste anual de ITV prorrateado
    revision: { nuevo: 20, usado: 45, viejo: 70 },
    consumo_100km: { gasolina: 7.5, diesel: 6.2 },
  },
  "audi-a4": {
    nombre: "Audi A4",
    seguro: { nuevo: 78, usado: 63, viejo: 58 },
    impuesto: 15,
    itv: 3,
    revision: { nuevo: 22, usado: 48, viejo: 72 },
    consumo_100km: { gasolina: 7.2, diesel: 5.9 },
  },
};

const PRECIO_COMBUSTIBLE = { gasolina: 1.65, diesel: 1.55 }; // €/litro, ajusta según precio actual
const PARKING_MES = 90;

function euros(n) {
  return n.toLocaleString("es-ES", { maximumFractionDigits: 0 }) + " €";
}

function leerParametros() {
  const params = new URLSearchParams(window.location.search);
  return { modelo: params.get("modelo") };
}

function calcular() {
  const modeloId = document.getElementById("modelo").value;
  const antiguedad = document.getElementById("antiguedad").value;
  const kmAnual = Number(document.getElementById("km").value);
  const combustible = document.getElementById("combustible").value;
  const parking = document.getElementById("parking").value === "si";

  const coche = MODELOS[modeloId];

  const kmMes = kmAnual / 12;
  const litrosMes = (kmMes / 100) * coche.consumo_100km[combustible];
  const gastoCombustible = Math.round(litrosMes * PRECIO_COMBUSTIBLE[combustible]);

  const items = [
    { nombre: "Seguro", valor: coche.seguro[antiguedad] },
    { nombre: "Impuesto de circulación", valor: coche.impuesto },
    { nombre: "ITV (prorrateada)", valor: coche.itv },
    { nombre: "Revisiones y averías", valor: coche.revision[antiguedad] },
    { nombre: "Combustible", valor: gastoCombustible },
  ];

  if (parking) items.push({ nombre: "Plaza de garaje", valor: PARKING_MES });

  const total = items.reduce((sum, item) => sum + item.valor, 0);

  pintarRecibo(coche.nombre, items, total);
}

function pintarRecibo(nombreModelo, items, total) {
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
      <span>Mantener un ${nombreModelo}</span>
      <span class="stamp">estimado</span>
    </div>
    ${filas}
    <div class="receipt-total">
      <span class="label">Total al mes</span>
      <span class="value expense">${euros(total)}</span>
    </div>
    <p class="receipt-note">Estimación orientativa. El seguro y el consumo real dependen de tu perfil de conductor, provincia y estilo de conducción.</p>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const { modelo } = leerParametros();
  if (modelo && MODELOS[modelo]) {
    document.getElementById("modelo").value = modelo;
  }

  document.getElementById("calc-form").addEventListener("input", calcular);
  calcular();
});
