/* ============================================================
   Datos base por especie y tamaño/raza (€ / mes).
   Fuentes de referencia: Real Sociedad Canina de España (RSCE),
   guías veterinarias y comparadores de seguros. AJUSTA A TU CASO.
   ============================================================ */
const MASCOTAS = {
  perro: {
    nombre: "Perro",
    razas: {
      pequeno: {
        nombre: "Pequeño — Chihuahua, Yorkshire, Bichón maltés...",
        alimentacion: 25,
        higiene: 8,
        veterinario: 15,
        accesorios: 10,
      },
      mediano: {
        nombre: "Mediano — Beagle, Bulldog francés, Cocker...",
        alimentacion: 45,
        higiene: 10,
        veterinario: 18,
        accesorios: 12,
      },
      grande: {
        nombre: "Grande — Labrador, Pastor Alemán, Golden Retriever...",
        alimentacion: 65,
        higiene: 14,
        veterinario: 24,
        accesorios: 16,
      },
    },
  },
  gato: {
    nombre: "Gato",
    razas: {
      comun: {
        nombre: "Común europeo / doméstico",
        alimentacion: 35,
        higiene: 15,
        veterinario: 12,
        accesorios: 8,
      },
      pelolargo: {
        nombre: "Pelo largo — Persa, Maine Coon...",
        alimentacion: 45,
        higiene: 18,
        veterinario: 15,
        accesorios: 14,
      },
    },
  },
  conejo: {
    nombre: "Conejo",
    razas: {
      estandar: { nombre: "Enano, cabeza de león, ariete...", alimentacion: 18, higiene: 10, veterinario: 8, accesorios: 6 },
    },
  },
  hamster: {
    nombre: "Hámster",
    razas: {
      estandar: { nombre: "Sirio o enano", alimentacion: 6, higiene: 5, veterinario: 3, accesorios: 4 },
    },
  },
  cobaya: {
    nombre: "Cobaya",
    razas: {
      estandar: { nombre: "Estándar", alimentacion: 12, higiene: 8, veterinario: 5, accesorios: 5 },
    },
  },
  huron: {
    nombre: "Hurón",
    razas: {
      estandar: { nombre: "Estándar", alimentacion: 28, higiene: 12, veterinario: 15, accesorios: 8 },
    },
  },
  loro: {
    nombre: "Loro / ave",
    razas: {
      pequeno: { nombre: "Pequeño — periquito, agapornis...", alimentacion: 10, higiene: 5, veterinario: 6, accesorios: 6 },
      grande: { nombre: "Grande — guacamayo, yaco, cacatúa...", alimentacion: 35, higiene: 12, veterinario: 20, accesorios: 20 },
    },
  },
  pez: {
    nombre: "Peces de acuario",
    razas: {
      estandar: { nombre: "Acuario de agua dulce estándar", alimentacion: 6, higiene: 14, veterinario: 0, accesorios: 8 },
    },
  },
  tortuga: {
    nombre: "Tortuga",
    razas: {
      terrestre: { nombre: "Terrestre (mediterránea...)", alimentacion: 8, higiene: 6, veterinario: 8, accesorios: 6 },
      acuatica: { nombre: "Acuática (de Florida...)", alimentacion: 10, higiene: 14, veterinario: 8, accesorios: 10 },
    },
  },
  reptil: {
    nombre: "Reptil",
    razas: {
      estandar: { nombre: "Serpiente, gecko, iguana... (terrario + calefacción)", alimentacion: 15, higiene: 8, veterinario: 10, accesorios: 14 },
    },
  },
  caballo: {
    nombre: "Caballo",
    razas: {
      estandar: { nombre: "En cuadra de pupilaje", alimentacion: 180, higiene: 40, veterinario: 60, accesorios: 40 },
    },
  },
};

const ICONOS_MASCOTA = {
  perro: "🐶", gato: "🐱", conejo: "🐰", hamster: "🐹", cobaya: "🐹",
  huron: "🦡", loro: "🦜", pez: "🐠", tortuga: "🐢", reptil: "🦎", caballo: "🐴",
};

const NOTA_MASCOTA = {
  caballo: "Estimación orientativa para un caballo en pupilaje (box, forraje y cuidados básicos). Varía mucho según la zona y si incluye clases de monta.",
  pez: "Estimación orientativa para un acuario de agua dulce estándar. Los acuarios marinos tienen un coste de mantenimiento notablemente mayor.",
  default: "Estimación orientativa para un animal adulto sano. No incluye urgencias veterinarias graves ni el gasto inicial (adopción/compra, vacunas, esterilización).",
};

const SEGURO_MES = 20;
const STORAGE_KEY = "cc_mascotas";

function poblarRazas() {
  const especieId = document.getElementById("especie").value;
  const especie = MASCOTAS[especieId];
  const selectRaza = document.getElementById("raza");

  selectRaza.innerHTML = Object.entries(especie.razas)
    .map(([id, raza]) => `<option value="${id}">${raza.nombre}</option>`)
    .join("");
}

function calcular() {
  const especieId = document.getElementById("especie").value;
  const razaId = document.getElementById("raza").value;
  const conSeguro = document.getElementById("seguro").value === "si";

  const especie = MASCOTAS[especieId];
  const raza = especie.razas[razaId];
  if (!raza) return; // el select de razas aún no se ha poblado

  const items = [
    { nombre: "Alimentación", valor: raza.alimentacion },
    { nombre: "Higiene y limpieza", valor: raza.higiene },
    { nombre: "Veterinario básico", valor: raza.veterinario },
    { nombre: "Accesorios y ocio", valor: raza.accesorios },
  ];

  if (conSeguro) items.push({ nombre: "Seguro veterinario", valor: SEGURO_MES });

  const total = items.reduce((sum, item) => sum + item.valor, 0);
  const nombreCorto = raza.nombre.split("—")[0].trim();

  CC.pintarRecibo("receipt", {
    icon: ICONOS_MASCOTA[especieId] || "🐾",
    titulo: `${especie.nombre}: ${nombreCorto}`,
    items,
    total,
    totalLabel: "Total al mes",
    nota: NOTA_MASCOTA[especieId] || NOTA_MASCOTA.default,
  });

  CC.pintarBreadcrumb("breadcrumb", [
    { texto: "Inicio", href: "../index.html" },
    { texto: "Mascotas", href: "../index.html#mascotas" },
    { texto: nombreCorto },
  ]);

  const form = document.getElementById("calc-form");
  CC.guardarFormulario(STORAGE_KEY, form);
  CC.sincronizarURL(form);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calc-form");

  CC.restaurarFormulario(STORAGE_KEY, form);
  CC.aplicarParamsAFormulario(form);

  poblarRazas();

  CC.restaurarFormulario(STORAGE_KEY, form);
  CC.aplicarParamsAFormulario(form);

  document.getElementById("especie").addEventListener("change", () => {
    poblarRazas();
    calcular();
  });
  document.getElementById("calc-form").addEventListener("input", calcular);
  calcular();
});
