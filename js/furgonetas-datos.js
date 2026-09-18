const SEGMENTO_BASE_FURGONETA = {
  pequena: {
    seguro: 55,
    revision: 35,
    impuesto: 9,
  },

  media: {
    seguro: 70,
    revision: 50,
    impuesto: 13,
  },

  grande: {
    seguro: 90,
    revision: 70,
    impuesto: 17,
  },
};

const CARROCERIA_MULT_FURGONETA = {
  pequena: 0.9,
  media: 1.0,
  grande: 1.15,
};

const PRECIO_COMBUSTIBLE_FURGONETA = {
  gasolina: 1.65,
  diesel: 1.55,
  hibrido: 1.65,
};

const PRECIO_ELECTRICIDAD_FURGONETA = 0.20;

const PARKING_MES_FURGONETA = 100;

const COLORES_FURGONETA = {
  blanco: { nombre: "Blanco", hex: "#f2efe4" },
  gris: { nombre: "Gris", hex: "#8a8a7c" },
  negro: { nombre: "Negro", hex: "#23281f" },
  azul: { nombre: "Azul", hex: "#2b4c7e" },
  rojo: { nombre: "Rojo", hex: "#a63a2e" },
};


const MARCAS_FURGONETAS = {

  volkswagen: {
    nombre: "Volkswagen",
    segmento: "media",
    modelos: {

      caddy: {
        nombre: "Caddy",
        carroceria: "media",
        anioMin: 2015,
        motorizaciones: [
          { id: "15-tsi", nombre: "1.5 TSI gasolina", tipo: "gasolina", consumo: 7.2 },
          { id: "20-tdi", nombre: "2.0 TDI diésel", tipo: "diesel", consumo: 5.8 },
          { id: "caddy-e", nombre: "e-Caddy eléctrica", tipo: "electrico", consumoKwh: 19.0 },
        ],
      },

      transporter: {
        nombre: "Transporter",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "20-tdi", nombre: "2.0 TDI diésel", tipo: "diesel", consumo: 7.8 },
          { id: "20-tdi-4motion", nombre: "2.0 TDI 4Motion diésel", tipo: "diesel", consumo: 8.4 },
        ],
      },

      crafter: {
        nombre: "Crafter",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "20-tdi", nombre: "2.0 TDI diésel", tipo: "diesel", consumo: 8.5 },
          { id: "20-tdi-177", nombre: "2.0 TDI 177 CV diésel", tipo: "diesel", consumo: 9.0 },
          { id: "ecrafter", nombre: "e-Crafter eléctrica", tipo: "electrico", consumoKwh: 28.0 },
        ],
      },
    },
  },

  ford: {
    nombre: "Ford",
    segmento: "media",
    modelos: {

      transitCourier: {
        nombre: "Transit Courier",
        carroceria: "pequena",
        anioMin: 2015,
        motorizaciones: [
          { id: "10-ecoboost", nombre: "1.0 EcoBoost gasolina", tipo: "gasolina", consumo: 6.8 },
          { id: "15-tdci", nombre: "1.5 TDCi diésel", tipo: "diesel", consumo: 5.5 },
        ],
      },

      transitConnect: {
        nombre: "Transit Connect",
        carroceria: "media",
        anioMin: 2015,
        motorizaciones: [
          { id: "15-ecoblue", nombre: "1.5 EcoBlue diésel", tipo: "diesel", consumo: 6.1 },
          { id: "20-ecoblue", nombre: "2.0 EcoBlue diésel", tipo: "diesel", consumo: 6.7 },
        ],
      },

      transitCustom: {
        nombre: "Transit Custom",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "20-ecoblue", nombre: "2.0 EcoBlue diésel", tipo: "diesel", consumo: 7.4 },
          { id: "20-ecoblue-awd", nombre: "2.0 EcoBlue AWD diésel", tipo: "diesel", consumo: 8.0 },
          { id: "transit-custom-phev", nombre: "Híbrida enchufable", tipo: "hibrido", consumo: 6.5 },
          { id: "e-transit-custom", nombre: "E-Transit Custom eléctrica", tipo: "electrico", consumoKwh: 24.0 },
        ],
      },

      transit: {
        nombre: "Transit",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "20-tdci", nombre: "2.0 TDCi diésel", tipo: "diesel", consumo: 8.5 },
          { id: "20-ecoblue", nombre: "2.0 EcoBlue diésel", tipo: "diesel", consumo: 8.2 },
          { id: "e-transit", nombre: "E-Transit eléctrica", tipo: "electrico", consumoKwh: 28.0 },
        ],
      },
    },
  },

  renault: {
    nombre: "Renault",
    segmento: "media",
    modelos: {

      kangoo: {
        nombre: "Kangoo",
        carroceria: "pequena",
        anioMin: 2015,
        motorizaciones: [
          { id: "12-tce", nombre: "1.2 TCe gasolina", tipo: "gasolina", consumo: 7.0 },
          { id: "15-dci", nombre: "1.5 dCi diésel", tipo: "diesel", consumo: 5.6 },
          { id: "kangoo-e", nombre: "Kangoo E-Tech eléctrica", tipo: "electrico", consumoKwh: 18.5 },
        ],
      },

      trafic: {
        nombre: "Trafic",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "16-dci", nombre: "1.6 dCi diésel", tipo: "diesel", consumo: 7.2 },
          { id: "20-dci", nombre: "2.0 dCi diésel", tipo: "diesel", consumo: 7.5 },
          { id: "trafic-e", nombre: "Trafic E-Tech eléctrica", tipo: "electrico", consumoKwh: 25.0 },
        ],
      },

      master: {
        nombre: "Master",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "23-dci", nombre: "2.3 dCi diésel", tipo: "diesel", consumo: 9.0 },
          { id: "22-dci", nombre: "2.2 dCi diésel", tipo: "diesel", consumo: 9.2 },
          { id: "master-e", nombre: "Master E-Tech eléctrica", tipo: "electrico", consumoKwh: 29.0 },
        ],
      },
    },
  },

  peugeot: {
    nombre: "Peugeot",
    segmento: "media",
    modelos: {

      partner: {
        nombre: "Partner",
        carroceria: "pequena",
        anioMin: 2015,
        motorizaciones: [
          { id: "12-puretech", nombre: "1.2 PureTech gasolina", tipo: "gasolina", consumo: 6.8 },
          { id: "15-bluehdi", nombre: "1.5 BlueHDi diésel", tipo: "diesel", consumo: 5.5 },
          { id: "e-partner", nombre: "E-Partner eléctrica", tipo: "electrico", consumoKwh: 19.0 },
        ],
      },

      expert: {
        nombre: "Expert",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "15-bluehdi", nombre: "1.5 BlueHDi diésel", tipo: "diesel", consumo: 6.5 },
          { id: "20-bluehdi", nombre: "2.0 BlueHDi diésel", tipo: "diesel", consumo: 7.0 },
          { id: "e-expert", nombre: "E-Expert eléctrica", tipo: "electrico", consumoKwh: 25.0 },
        ],
      },

      boxer: {
        nombre: "Boxer",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "22-hdi", nombre: "2.2 HDi diésel", tipo: "diesel", consumo: 9.0 },
          { id: "20-bluehdi", nombre: "2.0 BlueHDi diésel", tipo: "diesel", consumo: 8.8 },
          { id: "e-boxer", nombre: "E-Boxer eléctrica", tipo: "electrico", consumoKwh: 30.0 },
        ],
      },
    },
  },

  citroen: {
    nombre: "Citroën",
    segmento: "media",
    modelos: {

      berlingo: {
        nombre: "Berlingo",
        carroceria: "pequena",
        anioMin: 2015,
        motorizaciones: [
          { id: "12-puretech", nombre: "1.2 PureTech gasolina", tipo: "gasolina", consumo: 6.8 },
          { id: "15-bluehdi", nombre: "1.5 BlueHDi diésel", tipo: "diesel", consumo: 5.5 },
          { id: "e-berlingo", nombre: "ë-Berlingo eléctrica", tipo: "electrico", consumoKwh: 19.0 },
        ],
      },

      jumpy: {
        nombre: "Jumpy",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "15-bluehdi", nombre: "1.5 BlueHDi diésel", tipo: "diesel", consumo: 6.5 },
          { id: "20-bluehdi", nombre: "2.0 BlueHDi diésel", tipo: "diesel", consumo: 7.0 },
          { id: "e-jumpy", nombre: "ë-Jumpy eléctrica", tipo: "electrico", consumoKwh: 25.0 },
        ],
      },

      jumper: {
        nombre: "Jumper",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "22-bluehdi", nombre: "2.2 BlueHDi diésel", tipo: "diesel", consumo: 8.9 },
          { id: "20-bluehdi", nombre: "2.0 BlueHDi diésel", tipo: "diesel", consumo: 8.8 },
        ],
      },
    },
  },

  fiat: {
    nombre: "Fiat",
    segmento: "media",
    modelos: {

      doblo: {
        nombre: "Doblò",
        carroceria: "pequena",
        anioMin: 2015,
        motorizaciones: [
          { id: "14-tjet", nombre: "1.4 T-Jet gasolina", tipo: "gasolina", consumo: 7.4 },
          { id: "16-mjet", nombre: "1.6 MultiJet diésel", tipo: "diesel", consumo: 5.8 },
          { id: "e-doblo", nombre: "E-Doblò eléctrica", tipo: "electrico", consumoKwh: 19.0 },
        ],
      },

      scudo: {
        nombre: "Scudo",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "20-mjet", nombre: "2.0 MultiJet diésel", tipo: "diesel", consumo: 7.0 },
          { id: "e-scudo", nombre: "E-Scudo eléctrica", tipo: "electrico", consumoKwh: 25.0 },
        ],
      },

      ducato: {
        nombre: "Ducato",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "23-mjet", nombre: "2.3 MultiJet diésel", tipo: "diesel", consumo: 9.0 },
          { id: "22-mjet", nombre: "2.2 MultiJet diésel", tipo: "diesel", consumo: 8.8 },
          { id: "e-ducato", nombre: "E-Ducato eléctrica", tipo: "electrico", consumoKwh: 30.0 },
        ],
      },
    },
  },

  opel: {
    nombre: "Opel",
    segmento: "media",
    modelos: {

      combo: {
        nombre: "Combo",
        carroceria: "pequena",
        anioMin: 2015,
        motorizaciones: [
          { id: "12-turbo", nombre: "1.2 Turbo gasolina", tipo: "gasolina", consumo: 6.8 },
          { id: "15-diesel", nombre: "1.5 diésel", tipo: "diesel", consumo: 5.6 },
          { id: "combo-e", nombre: "Combo-e eléctrica", tipo: "electrico", consumoKwh: 19.0 },
        ],
      },

      vivaro: {
        nombre: "Vivaro",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "15-diesel", nombre: "1.5 diésel", tipo: "diesel", consumo: 6.6 },
          { id: "20-diesel", nombre: "2.0 diésel", tipo: "diesel", consumo: 7.0 },
          { id: "vivaro-e", nombre: "Vivaro-e eléctrica", tipo: "electrico", consumoKwh: 25.0 },
        ],
      },

      movano: {
        nombre: "Movano",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "22-diesel", nombre: "2.2 diésel", tipo: "diesel", consumo: 9.0 },
          { id: "movano-e", nombre: "Movano-e eléctrica", tipo: "electrico", consumoKwh: 30.0 },
        ],
      },
    },
  },

  toyota: {
    nombre: "Toyota",
    segmento: "media",
    modelos: {

      proaceCity: {
        nombre: "Proace City",
        carroceria: "pequena",
        anioMin: 2020,
        motorizaciones: [
          { id: "15-d4d", nombre: "1.5 diésel", tipo: "diesel", consumo: 5.6 },
          { id: "proace-city-electric", nombre: "Proace City Electric", tipo: "electrico", consumoKwh: 19.0 },
        ],
      },

      proace: {
        nombre: "Proace",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "15-d4d", nombre: "1.5 diésel", tipo: "diesel", consumo: 6.5 },
          { id: "20-d4d", nombre: "2.0 diésel", tipo: "diesel", consumo: 7.0 },
          { id: "proace-electric", nombre: "Proace Electric", tipo: "electrico", consumoKwh: 25.0 },
        ],
      },

      proaceMax: {
        nombre: "Proace Max",
        carroceria: "grande",
        anioMin: 2024,
        motorizaciones: [
          { id: "22-diesel", nombre: "2.2 diésel", tipo: "diesel", consumo: 8.8 },
          { id: "proace-max-electric", nombre: "Proace Max Electric", tipo: "electrico", consumoKwh: 30.0 },
        ],
      },
    },
  },

  mercedes: {
    nombre: "Mercedes-Benz",
    segmento: "grande",
    modelos: {

      citan: {
        nombre: "Citan",
        carroceria: "pequena",
        anioMin: 2015,
        motorizaciones: [
          { id: "13-turbo", nombre: "1.3 gasolina", tipo: "gasolina", consumo: 7.0 },
          { id: "15-diesel", nombre: "1.5 diésel", tipo: "diesel", consumo: 5.8 },
          { id: "e-citan", nombre: "eCitan eléctrica", tipo: "electrico", consumoKwh: 19.0 },
        ],
      },

      vito: {
        nombre: "Vito",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "16-cdi", nombre: "1.6 CDI diésel", tipo: "diesel", consumo: 7.2 },
          { id: "20-cdi", nombre: "2.0 CDI diésel", tipo: "diesel", consumo: 7.5 },
          { id: "evito", nombre: "eVito eléctrica", tipo: "electrico", consumoKwh: 25.0 },
        ],
      },

      sprinter: {
        nombre: "Sprinter",
        carroceria: "grande",
        anioMin: 2015,
        motorizaciones: [
          { id: "20-cdi", nombre: "2.0 CDI diésel", tipo: "diesel", consumo: 9.0 },
          { id: "e-sprinter", nombre: "eSprinter eléctrica", tipo: "electrico", consumoKwh: 30.0 },
        ],
      },
    },
  },

  nissan: {
    nombre: "Nissan",
    segmento: "media",
    modelos: {

      townstar: {
        nombre: "Townstar",
        carroceria: "pequena",
        anioMin: 2015,
        motorizaciones: [
          { id: "16-d4d", nombre: "1.6 diésel", tipo: "diesel", consumo: 6.0 },
          { id: "townstar-electric", nombre: "Townstar Electric", tipo: "electrico", consumoKwh: 20.0 },
        ],
      },
    },
  },
}