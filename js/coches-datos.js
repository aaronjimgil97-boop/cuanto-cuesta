/* ============================================================
   Catálogo de coches: marca -> modelo -> motorización.
   Cobertura: ~25 de las marcas más vendidas en España, con 2-3
   modelos representativos cada una (compacto, familiar, SUV) y
   sus motorizaciones más habituales. No es un catálogo exhaustivo
   de todas las versiones existentes: añade más siguiendo el mismo
   patrón si necesitas un modelo o motor que no esté aquí.

   anioMin: año del primer modelo de esa generación en el mercado
   (se usa para acotar el desplegable de años).
   consumo: litros/100km (gasolina, diésel, híbrido)
   consumoKwh: kWh/100km (eléctrico)
   ============================================================ */

/* ============================================================
   Segmento de precio de cada marca (afecta a seguro, revisión
   e impuesto de circulación) y tipo de carrocería (afecta a la
   silueta que se dibuja y también un poco al gasto).
   ============================================================ */
const SEGMENTO_BASE = {
  economico: { seguro: 40, revision: 25, impuesto: 6 },
  medio: { seguro: 55, revision: 35, impuesto: 10 },
  premium: { seguro: 75, revision: 55, impuesto: 15 },
  lujo: { seguro: 110, revision: 90, impuesto: 20 },
};

const CARROCERIA_MULT = { hatchback: 0.9, sedan: 1.0, suv: 1.15 };

const PRECIO_COMBUSTIBLE = { gasolina: 1.65, diesel: 1.55 }; // €/litro
const PRECIO_ELECTRICIDAD = 0.2; // €/kWh, carga doméstica media
const PARKING_MES = 90;

const COLORES_COCHE = {
  rojo: { nombre: "Rojo", hex: "#a63a2e" },
  azul: { nombre: "Azul", hex: "#2b4c7e" },
  blanco: { nombre: "Blanco", hex: "#f2efe4" },
  negro: { nombre: "Negro", hex: "#23281f" },
  gris: { nombre: "Gris", hex: "#8a8a7c" },
  verde: { nombre: "Verde", hex: "#3f7d58" },
};

const MARCAS = {
  "volkswagen": {
    nombre: "Volkswagen",
    segmento: "medio",
    modelos: {
      "golf": {
        nombre: "Golf",
        carroceria: "hatchback",
        anioMin: 2013,
        motorizaciones: [
          { id: "1.0-tsi", nombre: "1.0 TSI Gasolina 116cv", tipo: "gasolina", consumo: 6.0 },
          { id: "2.0-tdi", nombre: "2.0 TDI Diésel 150cv", tipo: "diesel", consumo: 5.0 },
          { id: "1.5-etsi", nombre: "1.5 eTSI Híbrido 150cv", tipo: "hibrido", consumo: 5.3 },
        ],
      },
      "polo": {
        nombre: "Polo",
        carroceria: "hatchback",
        anioMin: 2014,
        motorizaciones: [
          { id: "1.0-tsi", nombre: "1.0 TSI Gasolina 95cv", tipo: "gasolina", consumo: 5.4 },
          { id: "1.6-tdi", nombre: "1.6 TDI Diésel 95cv", tipo: "diesel", consumo: 4.5 },
        ],
      },
      "tiguan": {
        nombre: "Tiguan",
        carroceria: "suv",
        anioMin: 2016,
        motorizaciones: [
          { id: "1.5-tsi", nombre: "1.5 TSI Gasolina 150cv", tipo: "gasolina", consumo: 7.2 },
          { id: "2.0-tdi", nombre: "2.0 TDI Diésel 150cv", tipo: "diesel", consumo: 6.0 },
        ],
      },
    },
  },
  "audi": {
    nombre: "Audi",
    segmento: "premium",
    modelos: {
      "a3": {
        nombre: "A3",
        carroceria: "hatchback",
        anioMin: 2013,
        motorizaciones: [
          { id: "1.5-tfsi", nombre: "1.5 TFSI Gasolina 150cv", tipo: "gasolina", consumo: 6.2 },
          { id: "2.0-tdi", nombre: "2.0 TDI Diésel 150cv", tipo: "diesel", consumo: 5.1 },
        ],
      },
      "a4": {
        nombre: "A4",
        carroceria: "sedan",
        anioMin: 2015,
        motorizaciones: [
          { id: "2.0-tfsi", nombre: "2.0 TFSI Gasolina 190cv", tipo: "gasolina", consumo: 7.2 },
          { id: "2.0-tdi", nombre: "2.0 TDI Diésel 150cv", tipo: "diesel", consumo: 5.9 },
        ],
      },
      "q5": {
        nombre: "Q5",
        carroceria: "suv",
        anioMin: 2017,
        motorizaciones: [
          { id: "2.0-tfsi", nombre: "2.0 TFSI Gasolina 249cv", tipo: "gasolina", consumo: 8.5 },
          { id: "2.0-tdi", nombre: "2.0 TDI Diésel 204cv", tipo: "diesel", consumo: 6.5 },
        ],
      },
    },
  },
  "bmw": {
    nombre: "BMW",
    segmento: "premium",
    modelos: {
      "serie-1": {
        nombre: "Serie 1",
        carroceria: "hatchback",
        anioMin: 2015,
        motorizaciones: [
          { id: "118i", nombre: "118i Gasolina 136cv", tipo: "gasolina", consumo: 6.3 },
          { id: "116d", nombre: "116d Diésel 116cv", tipo: "diesel", consumo: 4.9 },
        ],
      },
      "serie-3": {
        nombre: "Serie 3",
        carroceria: "sedan",
        anioMin: 2012,
        motorizaciones: [
          { id: "320i", nombre: "320i Gasolina 184cv", tipo: "gasolina", consumo: 7.5 },
          { id: "320d", nombre: "320d Diésel 190cv", tipo: "diesel", consumo: 6.2 },
        ],
      },
      "x3": {
        nombre: "X3",
        carroceria: "suv",
        anioMin: 2017,
        motorizaciones: [
          { id: "xdrive20i", nombre: "xDrive20i Gasolina 184cv", tipo: "gasolina", consumo: 8.2 },
          { id: "xdrive20d", nombre: "xDrive20d Diésel 190cv", tipo: "diesel", consumo: 6.4 },
        ],
      },
    },
  },
  "mercedes": {
    nombre: "Mercedes-Benz",
    segmento: "premium",
    modelos: {
      "clase-a": {
        nombre: "Clase A",
        carroceria: "hatchback",
        anioMin: 2015,
        motorizaciones: [
          { id: "a180", nombre: "A 180 Gasolina 136cv", tipo: "gasolina", consumo: 6.4 },
          { id: "a180d", nombre: "A 180 d Diésel 116cv", tipo: "diesel", consumo: 5.0 },
        ],
      },
      "clase-c": {
        nombre: "Clase C",
        carroceria: "sedan",
        anioMin: 2014,
        motorizaciones: [
          { id: "c180", nombre: "C 180 Gasolina 170cv", tipo: "gasolina", consumo: 7.1 },
          { id: "c220d", nombre: "C 220 d Diésel 194cv", tipo: "diesel", consumo: 5.5 },
        ],
      },
      "glc": {
        nombre: "GLC",
        carroceria: "suv",
        anioMin: 2016,
        motorizaciones: [
          { id: "glc200", nombre: "GLC 200 Gasolina 204cv", tipo: "gasolina", consumo: 8.3 },
          { id: "glc220d", nombre: "GLC 220 d Diésel 194cv", tipo: "diesel", consumo: 6.6 },
        ],
      },
    },
  },
  "seat": {
    nombre: "SEAT",
    segmento: "medio",
    modelos: {
      "ibiza": {
        nombre: "Ibiza",
        carroceria: "hatchback",
        anioMin: 2017,
        motorizaciones: [
          { id: "1.0-tsi", nombre: "1.0 TSI Gasolina 95cv", tipo: "gasolina", consumo: 5.3 },
        ],
      },
      "leon": {
        nombre: "León",
        carroceria: "hatchback",
        anioMin: 2013,
        motorizaciones: [
          { id: "1.0-tsi", nombre: "1.0 TSI Gasolina 110cv", tipo: "gasolina", consumo: 5.8 },
          { id: "2.0-tdi", nombre: "2.0 TDI Diésel 150cv", tipo: "diesel", consumo: 4.8 },
        ],
      },
      "ateca": {
        nombre: "Ateca",
        carroceria: "suv",
        anioMin: 2016,
        motorizaciones: [
          { id: "1.5-tsi", nombre: "1.5 TSI Gasolina 150cv", tipo: "gasolina", consumo: 7.0 },
          { id: "2.0-tdi", nombre: "2.0 TDI Diésel 150cv", tipo: "diesel", consumo: 5.8 },
        ],
      },
    },
  },
  "skoda": {
    nombre: "Škoda",
    segmento: "medio",
    modelos: {
      "fabia": {
        nombre: "Fabia",
        carroceria: "hatchback",
        anioMin: 2015,
        motorizaciones: [
          { id: "1.0-tsi", nombre: "1.0 TSI Gasolina 95cv", tipo: "gasolina", consumo: 5.2 },
        ],
      },
      "octavia": {
        nombre: "Octavia",
        carroceria: "hatchback",
        anioMin: 2013,
        motorizaciones: [
          { id: "1.5-tsi", nombre: "1.5 TSI Gasolina 150cv", tipo: "gasolina", consumo: 6.0 },
          { id: "2.0-tdi", nombre: "2.0 TDI Diésel 150cv", tipo: "diesel", consumo: 4.9 },
        ],
      },
      "karoq": {
        nombre: "Karoq",
        carroceria: "suv",
        anioMin: 2017,
        motorizaciones: [
          { id: "1.5-tsi", nombre: "1.5 TSI Gasolina 150cv", tipo: "gasolina", consumo: 6.9 },
          { id: "2.0-tdi", nombre: "2.0 TDI Diésel 150cv", tipo: "diesel", consumo: 5.7 },
        ],
      },
    },
  },
  "renault": {
    nombre: "Renault",
    segmento: "medio",
    modelos: {
      "clio": {
        nombre: "Clio",
        carroceria: "hatchback",
        anioMin: 2012,
        motorizaciones: [
          { id: "1.0-tce", nombre: "1.0 TCe Gasolina 100cv", tipo: "gasolina", consumo: 5.5 },
          { id: "1.5-dci", nombre: "1.5 dCi Diésel 85cv", tipo: "diesel", consumo: 4.3 },
        ],
      },
      "megane": {
        nombre: "Mégane",
        carroceria: "hatchback",
        anioMin: 2016,
        motorizaciones: [
          { id: "1.3-tce", nombre: "1.3 TCe Gasolina 140cv", tipo: "gasolina", consumo: 6.3 },
          { id: "1.5-dci", nombre: "1.5 dCi Diésel 115cv", tipo: "diesel", consumo: 4.7 },
        ],
      },
      "captur": {
        nombre: "Captur",
        carroceria: "suv",
        anioMin: 2013,
        motorizaciones: [
          { id: "1.0-tce", nombre: "1.0 TCe Gasolina 100cv", tipo: "gasolina", consumo: 6.1 },
          { id: "1.5-dci", nombre: "1.5 dCi Diésel 95cv", tipo: "diesel", consumo: 4.6 },
        ],
      },
    },
  },
  "peugeot": {
    nombre: "Peugeot",
    segmento: "medio",
    modelos: {
      "208": {
        nombre: "208",
        carroceria: "hatchback",
        anioMin: 2012,
        motorizaciones: [
          { id: "1.2-puretech", nombre: "1.2 PureTech Gasolina 100cv", tipo: "gasolina", consumo: 5.4 },
        ],
      },
      "308": {
        nombre: "308",
        carroceria: "hatchback",
        anioMin: 2013,
        motorizaciones: [
          { id: "1.2-puretech", nombre: "1.2 PureTech Gasolina 130cv", tipo: "gasolina", consumo: 6.0 },
          { id: "1.5-bluehdi", nombre: "1.5 BlueHDi Diésel 130cv", tipo: "diesel", consumo: 4.6 },
        ],
      },
      "3008": {
        nombre: "3008",
        carroceria: "suv",
        anioMin: 2016,
        motorizaciones: [
          { id: "1.2-puretech", nombre: "1.2 PureTech Gasolina 130cv", tipo: "gasolina", consumo: 6.8 },
          { id: "1.5-bluehdi", nombre: "1.5 BlueHDi Diésel 130cv", tipo: "diesel", consumo: 5.3 },
        ],
      },
    },
  },
  "citroen": {
    nombre: "Citroën",
    segmento: "economico",
    modelos: {
      "c3": {
        nombre: "C3",
        carroceria: "hatchback",
        anioMin: 2016,
        motorizaciones: [
          { id: "1.2-puretech", nombre: "1.2 PureTech Gasolina 83cv", tipo: "gasolina", consumo: 5.5 },
        ],
      },
      "c4": {
        nombre: "C4",
        carroceria: "hatchback",
        anioMin: 2020,
        motorizaciones: [
          { id: "1.2-puretech", nombre: "1.2 PureTech Gasolina 130cv", tipo: "gasolina", consumo: 6.1 },
          { id: "1.5-bluehdi", nombre: "1.5 BlueHDi Diésel 130cv", tipo: "diesel", consumo: 4.7 },
        ],
      },
      "c5-aircross": {
        nombre: "C5 Aircross",
        carroceria: "suv",
        anioMin: 2018,
        motorizaciones: [
          { id: "1.2-puretech", nombre: "1.2 PureTech Gasolina 130cv", tipo: "gasolina", consumo: 6.9 },
          { id: "1.5-bluehdi", nombre: "1.5 BlueHDi Diésel 130cv", tipo: "diesel", consumo: 5.4 },
        ],
      },
    },
  },
  "opel": {
    nombre: "Opel",
    segmento: "economico",
    modelos: {
      "corsa": {
        nombre: "Corsa",
        carroceria: "hatchback",
        anioMin: 2014,
        motorizaciones: [
          { id: "1.2-turbo", nombre: "1.2 Turbo Gasolina 100cv", tipo: "gasolina", consumo: 5.4 },
        ],
      },
      "astra": {
        nombre: "Astra",
        carroceria: "hatchback",
        anioMin: 2015,
        motorizaciones: [
          { id: "1.2-turbo", nombre: "1.2 Turbo Gasolina 130cv", tipo: "gasolina", consumo: 6.0 },
          { id: "1.5-diesel", nombre: "1.5 Diésel 122cv", tipo: "diesel", consumo: 4.6 },
        ],
      },
      "mokka": {
        nombre: "Mokka",
        carroceria: "suv",
        anioMin: 2016,
        motorizaciones: [
          { id: "1.2-turbo", nombre: "1.2 Turbo Gasolina 130cv", tipo: "gasolina", consumo: 6.7 },
        ],
      },
    },
  },
  "ford": {
    nombre: "Ford",
    segmento: "medio",
    modelos: {
      "fiesta": {
        nombre: "Fiesta",
        carroceria: "hatchback",
        anioMin: 2013,
        motorizaciones: [
          { id: "1.0-ecoboost", nombre: "1.0 EcoBoost Gasolina 100cv", tipo: "gasolina", consumo: 5.3 },
        ],
      },
      "focus": {
        nombre: "Focus",
        carroceria: "hatchback",
        anioMin: 2015,
        motorizaciones: [
          { id: "1.0-ecoboost", nombre: "1.0 EcoBoost Gasolina 125cv", tipo: "gasolina", consumo: 6.1 },
          { id: "1.5-tdci", nombre: "1.5 TDCi Diésel 120cv", tipo: "diesel", consumo: 4.8 },
        ],
      },
      "kuga": {
        nombre: "Kuga",
        carroceria: "suv",
        anioMin: 2016,
        motorizaciones: [
          { id: "1.5-ecoboost", nombre: "1.5 EcoBoost Gasolina 150cv", tipo: "gasolina", consumo: 7.1 },
          { id: "2.0-tdci", nombre: "2.0 TDCi Diésel 150cv", tipo: "diesel", consumo: 5.6 },
        ],
      },
    },
  },
  "toyota": {
    nombre: "Toyota",
    segmento: "medio",
    modelos: {
      "yaris": {
        nombre: "Yaris",
        carroceria: "hatchback",
        anioMin: 2014,
        motorizaciones: [
          { id: "1.5-hibrido", nombre: "1.5 Híbrido 116cv", tipo: "hibrido", consumo: 4.0 },
        ],
      },
      "corolla": {
        nombre: "Corolla",
        carroceria: "hatchback",
        anioMin: 2019,
        motorizaciones: [
          { id: "1.8-hibrido", nombre: "1.8 Híbrido 122cv", tipo: "hibrido", consumo: 4.3 },
        ],
      },
      "rav4": {
        nombre: "RAV4",
        carroceria: "suv",
        anioMin: 2019,
        motorizaciones: [
          { id: "2.5-hibrido", nombre: "2.5 Híbrido 218cv", tipo: "hibrido", consumo: 5.5 },
        ],
      },
    },
  },
  "hyundai": {
    nombre: "Hyundai",
    segmento: "medio",
    modelos: {
      "i20": {
        nombre: "i20",
        carroceria: "hatchback",
        anioMin: 2014,
        motorizaciones: [
          { id: "1.2-mpi", nombre: "1.2 MPI Gasolina 84cv", tipo: "gasolina", consumo: 5.6 },
        ],
      },
      "tucson": {
        nombre: "Tucson",
        carroceria: "suv",
        anioMin: 2015,
        motorizaciones: [
          { id: "1.6-t-gdi", nombre: "1.6 T-GDI Gasolina 150cv", tipo: "gasolina", consumo: 7.3 },
          { id: "1.6-crdi", nombre: "1.6 CRDi Diésel 136cv", tipo: "diesel", consumo: 5.6 },
        ],
      },
      "ioniq-5": {
        nombre: "Ioniq 5",
        carroceria: "suv",
        anioMin: 2021,
        motorizaciones: [
          { id: "73kwh", nombre: "73 kWh Eléctrico 229cv", tipo: "electrico", consumoKwh: 16.5 },
        ],
      },
    },
  },
  "kia": {
    nombre: "Kia",
    segmento: "medio",
    modelos: {
      "rio": {
        nombre: "Rio",
        carroceria: "hatchback",
        anioMin: 2017,
        motorizaciones: [
          { id: "1.25-mpi", nombre: "1.25 MPI Gasolina 84cv", tipo: "gasolina", consumo: 5.7 },
        ],
      },
      "sportage": {
        nombre: "Sportage",
        carroceria: "suv",
        anioMin: 2016,
        motorizaciones: [
          { id: "1.6-t-gdi", nombre: "1.6 T-GDI Gasolina 150cv", tipo: "gasolina", consumo: 7.4 },
          { id: "1.6-crdi", nombre: "1.6 CRDi Diésel 136cv", tipo: "diesel", consumo: 5.7 },
        ],
      },
      "ev6": {
        nombre: "EV6",
        carroceria: "suv",
        anioMin: 2021,
        motorizaciones: [
          { id: "77kwh", nombre: "77 kWh Eléctrico 229cv", tipo: "electrico", consumoKwh: 16.8 },
        ],
      },
    },
  },
  "nissan": {
    nombre: "Nissan",
    segmento: "medio",
    modelos: {
      "micra": {
        nombre: "Micra",
        carroceria: "hatchback",
        anioMin: 2017,
        motorizaciones: [
          { id: "1.0-ig-t", nombre: "1.0 IG-T Gasolina 100cv", tipo: "gasolina", consumo: 5.5 },
        ],
      },
      "qashqai": {
        nombre: "Qashqai",
        carroceria: "suv",
        anioMin: 2014,
        motorizaciones: [
          { id: "1.3-dig-t", nombre: "1.3 DIG-T Gasolina 140cv", tipo: "gasolina", consumo: 6.9 },
          { id: "1.5-dci", nombre: "1.5 dCi Diésel 115cv", tipo: "diesel", consumo: 4.9 },
        ],
      },
    },
  },
  "mazda": {
    nombre: "Mazda",
    segmento: "medio",
    modelos: {
      "mazda2": {
        nombre: "Mazda2",
        carroceria: "hatchback",
        anioMin: 2015,
        motorizaciones: [
          { id: "1.5-skyactiv", nombre: "1.5 Skyactiv-G Gasolina 90cv", tipo: "gasolina", consumo: 5.4 },
        ],
      },
      "mazda3": {
        nombre: "Mazda3",
        carroceria: "hatchback",
        anioMin: 2019,
        motorizaciones: [
          { id: "2.0-skyactiv", nombre: "2.0 Skyactiv-X Gasolina 180cv", tipo: "gasolina", consumo: 6.2 },
        ],
      },
      "cx-5": {
        nombre: "CX-5",
        carroceria: "suv",
        anioMin: 2017,
        motorizaciones: [
          { id: "2.0-skyactiv", nombre: "2.0 Skyactiv-G Gasolina 165cv", tipo: "gasolina", consumo: 7.6 },
          { id: "2.2-skyactiv-d", nombre: "2.2 Skyactiv-D Diésel 184cv", tipo: "diesel", consumo: 5.9 },
        ],
      },
    },
  },
  "honda": {
    nombre: "Honda",
    segmento: "medio",
    modelos: {
      "civic": {
        nombre: "Civic",
        carroceria: "hatchback",
        anioMin: 2017,
        motorizaciones: [
          { id: "1.0-vtec", nombre: "1.0 VTEC Turbo Gasolina 126cv", tipo: "gasolina", consumo: 6.0 },
          { id: "2.0-hibrido", nombre: "2.0 e:HEV Híbrido 184cv", tipo: "hibrido", consumo: 4.5 },
        ],
      },
      "cr-v": {
        nombre: "CR-V",
        carroceria: "suv",
        anioMin: 2018,
        motorizaciones: [
          { id: "2.0-hibrido", nombre: "2.0 e:HEV Híbrido 184cv", tipo: "hibrido", consumo: 5.8 },
        ],
      },
    },
  },
  "fiat": {
    nombre: "Fiat",
    segmento: "economico",
    modelos: {
      "500": {
        nombre: "500",
        carroceria: "hatchback",
        anioMin: 2007,
        motorizaciones: [
          { id: "1.0-hybrid", nombre: "1.0 Hybrid Gasolina 70cv", tipo: "gasolina", consumo: 4.9 },
        ],
      },
      "panda": {
        nombre: "Panda",
        carroceria: "hatchback",
        anioMin: 2012,
        motorizaciones: [
          { id: "1.0-hybrid", nombre: "1.0 Hybrid Gasolina 70cv", tipo: "gasolina", consumo: 5.1 },
        ],
      },
      "tipo": {
        nombre: "Tipo",
        carroceria: "hatchback",
        anioMin: 2016,
        motorizaciones: [
          { id: "1.0-firefly", nombre: "1.0 Firefly Gasolina 100cv", tipo: "gasolina", consumo: 5.8 },
          { id: "1.3-multijet", nombre: "1.3 MultiJet Diésel 95cv", tipo: "diesel", consumo: 4.5 },
        ],
      },
    },
  },
  "dacia": {
    nombre: "Dacia",
    segmento: "economico",
    modelos: {
      "sandero": {
        nombre: "Sandero",
        carroceria: "hatchback",
        anioMin: 2020,
        motorizaciones: [
          { id: "1.0-tce", nombre: "1.0 TCe Gasolina 90cv", tipo: "gasolina", consumo: 5.5 },
        ],
      },
      "duster": {
        nombre: "Duster",
        carroceria: "suv",
        anioMin: 2018,
        motorizaciones: [
          { id: "1.0-tce", nombre: "1.0 TCe Gasolina 90cv", tipo: "gasolina", consumo: 6.5 },
          { id: "1.5-dci", nombre: "1.5 Blue dCi Diésel 115cv", tipo: "diesel", consumo: 5.2 },
        ],
      },
    },
  },
  "volvo": {
    nombre: "Volvo",
    segmento: "premium",
    modelos: {
      "xc40": {
        nombre: "XC40",
        carroceria: "suv",
        anioMin: 2018,
        motorizaciones: [
          { id: "t3", nombre: "T3 Gasolina 163cv", tipo: "gasolina", consumo: 7.0 },
          { id: "recharge", nombre: "Recharge Eléctrico 231cv", tipo: "electrico", consumoKwh: 18.0 },
        ],
      },
      "s60": {
        nombre: "S60",
        carroceria: "sedan",
        anioMin: 2018,
        motorizaciones: [
          { id: "t4", nombre: "T4 Gasolina 190cv", tipo: "gasolina", consumo: 7.2 },
        ],
      },
    },
  },
  "tesla": {
    nombre: "Tesla",
    segmento: "lujo",
    modelos: {
      "model-3": {
        nombre: "Model 3",
        carroceria: "sedan",
        anioMin: 2019,
        motorizaciones: [
          { id: "propulsion-trasera", nombre: "Propulsión Trasera Eléctrico 60kWh", tipo: "electrico", consumoKwh: 13.0 },
          { id: "gran-autonomia", nombre: "Gran Autonomía Eléctrico 78kWh", tipo: "electrico", consumoKwh: 14.7 },
        ],
      },
      "model-y": {
        nombre: "Model Y",
        carroceria: "suv",
        anioMin: 2021,
        motorizaciones: [
          { id: "propulsion-trasera", nombre: "Propulsión Trasera Eléctrico 60kWh", tipo: "electrico", consumoKwh: 15.0 },
          { id: "gran-autonomia", nombre: "Gran Autonomía Eléctrico 78kWh", tipo: "electrico", consumoKwh: 16.9 },
        ],
      },
    },
  },
  "cupra": {
    nombre: "Cupra",
    segmento: "premium",
    modelos: {
      "leon": {
        nombre: "León",
        carroceria: "hatchback",
        anioMin: 2020,
        motorizaciones: [
          { id: "2.0-tsi", nombre: "2.0 TSI Gasolina 300cv", tipo: "gasolina", consumo: 7.5 },
        ],
      },
      "formentor": {
        nombre: "Formentor",
        carroceria: "suv",
        anioMin: 2020,
        motorizaciones: [
          { id: "1.5-tsi", nombre: "1.5 TSI Gasolina 150cv", tipo: "gasolina", consumo: 6.9 },
          { id: "2.0-tsi", nombre: "2.0 TSI Gasolina 310cv", tipo: "gasolina", consumo: 8.2 },
        ],
      },
    },
  },
  "mini": {
    nombre: "Mini",
    segmento: "premium",
    modelos: {
      "cooper": {
        nombre: "Cooper",
        carroceria: "hatchback",
        anioMin: 2014,
        motorizaciones: [
          { id: "cooper", nombre: "Cooper Gasolina 136cv", tipo: "gasolina", consumo: 6.0 },
        ],
      },
      "countryman": {
        nombre: "Countryman",
        carroceria: "suv",
        anioMin: 2017,
        motorizaciones: [
          { id: "cooper", nombre: "Cooper Gasolina 136cv", tipo: "gasolina", consumo: 6.8 },
        ],
      },
    },
  },
  "landrover": {
    nombre: "Land Rover",
    segmento: "lujo",
    modelos: {
      "defender": {
        nombre: "Defender",
        carroceria: "suv",
        anioMin: 2020,
        motorizaciones: [
          { id: "d200", nombre: "D200 Diésel 200cv", tipo: "diesel", consumo: 8.5 },
        ],
      },
      "evoque": {
        nombre: "Range Rover Evoque",
        carroceria: "suv",
        anioMin: 2019,
        motorizaciones: [
          { id: "d165", nombre: "D165 Diésel 163cv", tipo: "diesel", consumo: 6.4 },
        ],
      },
    },
  },
};
