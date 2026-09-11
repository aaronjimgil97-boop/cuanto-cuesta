/* ============================================================
   Tramos de cotización de autónomos (RETA) 2026, por rendimiento
   neto mensual. Cuota mínima de cada tramo. Fuente: Seguridad
   Social, Orden de cotización 2026 (BOE). No incluye IRPF.
   ============================================================ */
const TRAMOS_AUTONOMO = [
  { max: 670, cuota: 200 },
  { max: 900, cuota: 220 },
  { max: 1166.7, cuota: 260 },
  { max: 1300, cuota: 290 },
  { max: 1500, cuota: 294 },
  { max: 1700, cuota: 294 },
  { max: 1850, cuota: 310 },
  { max: 2030, cuota: 315 },
  { max: 2330, cuota: 320 },
  { max: 2760, cuota: 330 },
  { max: 3190, cuota: 350 },
  { max: 3620, cuota: 370 },
  { max: 4050, cuota: 390 },
  { max: 6000, cuota: 420 },
  { max: Infinity, cuota: 500 },
];

const TARIFA_PLANA = 80; // €/mes, primer año (prorrogable si se cumplen condiciones)

function cuotaPorRendimiento(rendimientoNeto) {
  const tramo = TRAMOS_AUTONOMO.find((t) => rendimientoNeto <= t.max);
  return tramo ? tramo.cuota : TRAMOS_AUTONOMO[TRAMOS_AUTONOMO.length - 1].cuota;
}
