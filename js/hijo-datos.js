/* ============================================================
   Datos por etapa (€ / mes). Cifras orientativas de coste de
   escolarización, comedor, extraescolares, ropa y ocio.
   ============================================================ */
const ETAPAS_HIJO = {
  nino: {
    nombre: "Niño (3-12 años)",
    centro: { publico: 0, concertado: 110, privado: 420 },
    comedor: 110,
    extraescolares: { ninguna: 0, algunas: 35, muchas: 80 },
    ropa: 45,
    ocio: 40,
  },
  adolescente: {
    nombre: "Adolescente (13-17 años)",
    centro: { publico: 0, concertado: 125, privado: 480 },
    comedor: 100,
    extraescolares: { ninguna: 0, algunas: 45, muchas: 100 },
    ropa: 65,
    ocio: 70,
  },
  universidad: {
    nombre: "Universidad",
    // en universidad la opción "concertado" no aplica: se trata como pública
    centro: { publico: 115, concertado: 115, privado: 650 },
    comedor: 0,
    extraescolares: { ninguna: 0, algunas: 0, muchas: 0 },
    ropa: 45,
    ocio: 90,
    alojamiento: { casa: 0, compartido: 350, colegioMayor: 550 },
  },
};

const CAMPAMENTO_MES = 25; // coste de un campamento de verano, amortizado a lo largo del año
