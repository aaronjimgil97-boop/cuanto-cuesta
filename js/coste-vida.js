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

// NUEVO: multiplicadores según tipo de vivienda
const VIVIENDA_MULT = {
  compartido: 0.55,
  individual: 1.00,
  piso_1: 1.00,
  piso_2: 1.25,
  piso_3: 1.50,
  piso_4: 1.80,
  casa_2: 1.40,
  casa_3: 1.70,
  casa_4: 2.00,
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
  const pagaVivienda = document.querySelector('.toggle-option[data-value="si"]').classList.contains("active");
    const provinciaId = document.getElementById("provincia").value;
  const municipioNombre = document.getElementById("municipio").value;
    const municipios = MUNICIPIOS[provinciaId] || [];
  const municipio = municipios.find((item) => item.n === municipioNombre);
    const provincia = PROVINCIAS[provinciaId];
  const tier = provincia ? provincia.tier : null;
  const base = tier ? TIER_BASE[tier] : null;
  const tamanoMult = municipio ? (TAMANO_MULT[municipio.t] || 1) : 1;
    const zonaId = document.getElementById("zona").value;
  const zona = ZONA[zonaId] || ZONA.centro;
  const viviendaTipo = document.getElementById("vivienda").value;
  const estilo = document.getElementById("estilo").value;
  const transporte = document.getElementById("transporte").value === "si";
 const gimnasio = document.querySelector(
  '.gimnasio-toggle .toggle-option.active'
).dataset.value === "si";

  const mult = ESTILO_MULT[estilo];

  const items = [
   {
  nombre: "Suministros (luz, agua, internet)",
  valor: Math.round(base.suministros * tamanoMult),
},
    {
  nombre: "Comida",
  valor: Math.round(base.comida * tamanoMult * mult),
},
    { nombre: "Ocio y salidas", valor: Math.round(OCIO_BASE * mult) },
  ];
if (pagaVivienda) {
  const alquiler = Math.round(
    base.alquiler *
    tamanoMult *
    zona.alquiler *
    VIVIENDA_MULT[viviendaTipo]
  );

  items.unshift({
    nombre: "Alquiler",
    valor: alquiler,
  });
} 
 if (transporte) {
  items.push({
    nombre: "Transporte público",
    valor: Math.round(base.transporte * tamanoMult * zona.transporte),
  });
}
  if (gimnasio) {
  items.push({
    nombre: "Gimnasio",
    valor: Math.round(base.gimnasio * tamanoMult),
  });
}

  const total = items.reduce((sum, item) => sum + item.valor, 0);
console.log("Municipio:", municipioNombre);
  pintarRecibo(municipioNombre, items, total);
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
  // BOTONES DE VIVIENDA
const viviendaToggles = document.querySelectorAll(
  '#vivienda-si, #vivienda-no'
);

  const viviendaField = document.getElementById("vivienda-field");

  viviendaToggles.forEach((button) => {
    button.addEventListener("click", () => {
      viviendaToggles.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      const pagaVivienda = button.dataset.value === "si";

      viviendaField.style.display = pagaVivienda ? "" : "none";

      calcular();
    });
  });


  // BOTONES DE GIMNASIO
  const gimnasioToggles = document.querySelectorAll(
    '.gimnasio-toggle .toggle-option[data-value]'
  );

  gimnasioToggles.forEach((button) => {
    button.addEventListener("click", () => {
      gimnasioToggles.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      calcular();
    });
  });


  // CALCULADORA
  document.getElementById("calc-form").addEventListener("input", calcular);

  calcular();
});
// Cargar provincias y municipios desde geo-datos.js
const provinciaSelect = document.getElementById("provincia");
const municipioSelect = document.getElementById("municipio");

if (
  provinciaSelect &&
  municipioSelect &&
  typeof PROVINCIAS !== "undefined" &&
  typeof MUNICIPIOS !== "undefined"
) {
  // Cargar provincias
  Object.entries(PROVINCIAS).forEach(([codigo, provincia]) => {
    const option = document.createElement("option");
    option.value = codigo;
    option.textContent = provincia.nombre;
    provinciaSelect.appendChild(option);
  });

  // Cambiar municipios al seleccionar provincia
  provinciaSelect.addEventListener("change", () => {
    const codigoProvincia = provinciaSelect.value;

    municipioSelect.innerHTML = "";

    if (!codigoProvincia) {
      municipioSelect.disabled = true;

      const option = document.createElement("option");
      option.value = "";
      option.textContent = "Selecciona primero una provincia";
      municipioSelect.appendChild(option);

      return;
    }

    const municipios = MUNICIPIOS[codigoProvincia] || [];

    municipios.forEach((municipio) => {
      const option = document.createElement("option");
      option.value = municipio.n;
      option.textContent = municipio.n;
      municipioSelect.appendChild(option);
    });

    municipioSelect.disabled = municipios.length === 0;
   if (municipios.length > 0) {
  municipioSelect.value = municipios[0].n;
}

calcular();
  });
}
