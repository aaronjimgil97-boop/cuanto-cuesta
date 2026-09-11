/* ============================================================
   Datos orientativos por destino (€). Vuelo ida (se calcula
   ida y vuelta x2), hotel por noche y comida/transporte/entradas
   por día, en 3 niveles de gasto.
   ============================================================ */
const DESTINOS = {
  japon: {
    nombre: "Japón (Tokio)",
    vueloIda: 750,
    hotelNoche: { economico: 45, medio: 90, alto: 180 },
    comidaDia: { economico: 25, medio: 45, alto: 80 },
    transporteDia: 15,
    entradasDia: 20,
  },
  londres: {
    nombre: "Londres",
    vueloIda: 150,
    hotelNoche: { economico: 70, medio: 130, alto: 250 },
    comidaDia: { economico: 35, medio: 55, alto: 100 },
    transporteDia: 12,
    entradasDia: 25,
  },
  paris: {
    nombre: "París",
    vueloIda: 130,
    hotelNoche: { economico: 60, medio: 120, alto: 230 },
    comidaDia: { economico: 30, medio: 50, alto: 90 },
    transporteDia: 10,
    entradasDia: 20,
  },
  nuevayork: {
    nombre: "Nueva York",
    vueloIda: 550,
    hotelNoche: { economico: 90, medio: 180, alto: 350 },
    comidaDia: { economico: 40, medio: 65, alto: 120 },
    transporteDia: 15,
    entradasDia: 30,
  },
  otro: {
    nombre: "Otro destino (ajusta los datos a mano)",
    vueloIda: 300,
    hotelNoche: { economico: 50, medio: 90, alto: 160 },
    comidaDia: { economico: 25, medio: 40, alto: 70 },
    transporteDia: 10,
    entradasDia: 15,
  },
};
