/* ============================================================
   Datos base de motos y scooters por tipo/cilindrada (€ / mes).
   Cifras orientativas: seguro, ITV prorrateada, mantenimiento
   (revisiones + cadena/frenos) y neumáticos amortizados al mes.
   ============================================================ */
const TIPOS_MOTO = {
  scooter125: { nombre: "Scooter 125cc", seguro: 25, itv: 2, mantenimiento: 20, neumaticos: 8, consumo: 3.0 },
  moto125: { nombre: "Moto 125cc", seguro: 28, itv: 2, mantenimiento: 22, neumaticos: 9, consumo: 3.3 },
  motoMedia: { nombre: "Moto media cilindrada (250-500cc)", seguro: 45, itv: 2, mantenimiento: 35, neumaticos: 14, consumo: 4.5 },
  motoGrande: { nombre: "Moto grande cilindrada (600cc o más)", seguro: 65, itv: 2, mantenimiento: 50, neumaticos: 20, consumo: 5.5 },
  motoElectrica: { nombre: "Moto/scooter eléctrica", seguro: 30, itv: 1, mantenimiento: 12, neumaticos: 8, consumoKwh: 4.0, esElectrica: true },
};

const ANTIGUEDAD_MOTO_MULT = {
  nueva: { seguro: 1.15, mantenimiento: 0.7 },
  media: { seguro: 1.0, mantenimiento: 1.0 },
  veterana: { seguro: 0.85, mantenimiento: 1.35 },
};
