/* ============================================================
   Datos de eventos con invitados (€). "pp" = coste por persona
   del catering/actividad principal; "extras" = decoración, fotos,
   regalos y detalles, por nivel de producción.
   ============================================================ */
const TIPOS_EVENTO = {
  cumpleanos: { nombre: "Cumpleaños infantil", icon: "🎂", pp: 12, extras: { basico: 80, medio: 180, alto: 350 } },
  comunion: { nombre: "Comunión", icon: "🕊️", pp: 55, extras: { basico: 300, medio: 700, alto: 1400 } },
  bautizo: { nombre: "Bautizo", icon: "👶", pp: 45, extras: { basico: 200, medio: 450, alto: 900 } },
  despedida: { nombre: "Despedida de soltero/a", icon: "🎉", pp: 90, extras: { basico: 100, medio: 250, alto: 600 } },
  aniversario: { nombre: "Aniversario de boda", icon: "💍", pp: 60, extras: { basico: 150, medio: 400, alto: 900 } },
  fiesta18: { nombre: "Fiesta de 18 años", icon: "🥳", pp: 40, extras: { basico: 200, medio: 500, alto: 1100 } },
  jubilacion: { nombre: "Fiesta de jubilación", icon: "🎊", pp: 35, extras: { basico: 150, medio: 350, alto: 700 } },
};
