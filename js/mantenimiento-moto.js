/* ============================================================
   Calculadora de mantenimiento de moto/scooter.
   Datos en js/motos-datos.js.
   ============================================================ */

const PRECIO_GASOLINA_MOTO = 1.65;
const PRECIO_ELECTRICIDAD_MOTO = 0.2;
const PARKING_MOTO_MES = 40;
const STORAGE_KEY = "cc_moto";

function calcular() {
  const tipoId = document.getElementById("tipo").value;
  const antiguedadId = document.getElementById("antiguedad").value;
  const kmAnual = Number(document.getElementById("km").value);
  const conParking = document.getElementById("parking").value === "si";

  const tipo = TIPOS_MOTO[tipoId];
  const mult = ANTIGUEDAD_MOTO_MULT[antiguedadId];

  const seguro = Math.round(tipo.seguro * mult.seguro);
  const mantenimiento = Math.round(tipo.mantenimiento * mult.mantenimiento);

  const kmMes = kmAnual / 12;
  let gastoEnergia;
  let nombreEnergia;

  if (tipo.esElectrica) {
    const kwhMes = (kmMes / 100) * tipo.consumoKwh;
    gastoEnergia = Math.round(kwhMes * PRECIO_ELECTRICIDAD_MOTO);
    nombreEnergia = "Electricidad (carga en casa)";
  } else {
    const litrosMes = (kmMes / 100) * tipo.consumo;
    gastoEnergia = Math.round(litrosMes * PRECIO_GASOLINA_MOTO);
    nombreEnergia = "Combustible";
  }

  const items = [
    { nombre: "Seguro", valor: seguro },
    { nombre: "ITV (prorrateada)", valor: tipo.itv },
    { nombre: "Mantenimiento", valor: mantenimiento },
    { nombre: "Neumáticos (amortizados)", valor: tipo.neumaticos },
    { nombre: nombreEnergia, valor: gastoEnergia },
  ];

  if (conParking) items.push({ nombre: "Plaza de garaje", valor: PARKING_MOTO_MES });

  const total = items.reduce((sum, item) => sum + item.valor, 0);

  CC.pintarRecibo("receipt", {
    icon: tipo.esElectrica ? "🔋" : "🏍️",
    titulo: tipo.nombre,
    items,
    total,
    totalLabel: "Total al mes",
    nota: "Estimación orientativa. El seguro real depende de tu edad, años de carné y provincia.",
  });

  CC.pintarBreadcrumb("breadcrumb", [
    { texto: "Inicio", href: "../index.html" },
    { texto: "Vehículos", href: "../index.html#vehiculos" },
    { texto: tipo.nombre },
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
