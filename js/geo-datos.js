/* ============================================================
   Datos geográficos de España: 52 provincias + una selección de
   municipios por provincia (capital + 2-4 localidades conocidas).

   No existen cifras verificadas para los ~8.100 municipios de
   España, así que el modelo funciona así:
   - 5 ciudades (Madrid, Barcelona, Valencia, Sevilla, Zaragoza)
     tienen datos reales de mercado (real: true).
   - El resto de provincias tienen un "tier" de coste (1 = más caro,
     6 = más barato) asignado a partir del nivel de precios conocido
     de esa zona, y sus cifras se derivan de TIER_BASE.
   - Cada municipio tiene un "tamaño" (grande/media/pequeno) que
     aplica un multiplicador sobre la base provincial, para que un
     pueblo pequeño salga más barato que la capital de su provincia.

   Todo lo derivado (no marcado como "real") es una ESTIMACIÓN.
   Amplía MUNICIPIOS con más localidades cuando quieras: solo hace
   falta el nombre, la provincia (código) y el tamaño.
   ============================================================ */

const TIER_BASE = {
  1: { alquiler: 900, suministros: 105, comida: 215, transporte: 45, gimnasio: 35 },
  2: { alquiler: 700, suministros: 98, comida: 200, transporte: 38, gimnasio: 32 },
  3: { alquiler: 560, suministros: 92, comida: 185, transporte: 33, gimnasio: 29 },
  4: { alquiler: 460, suministros: 85, comida: 170, transporte: 28, gimnasio: 26 },
  5: { alquiler: 390, suministros: 80, comida: 160, transporte: 24, gimnasio: 23 },
  6: { alquiler: 330, suministros: 75, comida: 150, transporte: 20, gimnasio: 20 },
};

const TAMANO_MULT = { grande: 1.0, media: 0.82, pequeno: 0.62 };

const ZONA = {
  centro: { nombre: "Centro", alquiler: 1.15, transporte: 0.85 },
  periferia_bien: { nombre: "Periferia bien comunicada", alquiler: 0.9, transporte: 1.0 },
  periferia_mal: { nombre: "Periferia con poca comunicación", alquiler: 0.72, transporte: 1.35 },
};

// cod_prov (mismos códigos que el INE / el mapa SVG) -> datos de provincia
const PROVINCIAS = {
  "01": { nombre: "Álava", tier: 2 },
  "02": { nombre: "Albacete", tier: 5 },
  "03": { nombre: "Alicante", tier: 2 },
  "04": { nombre: "Almería", tier: 4 },
  "05": { nombre: "Ávila", tier: 5 },
  "06": { nombre: "Badajoz", tier: 5 },
  "07": { nombre: "Baleares", tier: 1 },
  "08": { nombre: "Barcelona", tier: 1, real: { alquilerIndividual: 980, suministros: 105, comida: 230, transporte: 45, gimnasio: 38 } },
  "09": { nombre: "Burgos", tier: 4 },
  "10": { nombre: "Cáceres", tier: 5 },
  "11": { nombre: "Cádiz", tier: 3 },
  "12": { nombre: "Castellón", tier: 3 },
  "13": { nombre: "Ciudad Real", tier: 5 },
  "14": { nombre: "Córdoba", tier: 4 },
  "15": { nombre: "A Coruña", tier: 3 },
  "16": { nombre: "Cuenca", tier: 5 },
  "17": { nombre: "Girona", tier: 2 },
  "18": { nombre: "Granada", tier: 3 },
  "19": { nombre: "Guadalajara", tier: 4 },
  "20": { nombre: "Guipúzcoa", tier: 1 },
  "21": { nombre: "Huelva", tier: 4 },
  "22": { nombre: "Huesca", tier: 4 },
  "23": { nombre: "Jaén", tier: 5 },
  "24": { nombre: "León", tier: 4 },
  "25": { nombre: "Lleida", tier: 4 },
  "26": { nombre: "La Rioja", tier: 3 },
  "27": { nombre: "Lugo", tier: 5 },
  "28": { nombre: "Madrid", tier: 1, real: { alquilerIndividual: 950, suministros: 110, comida: 220, transporte: 55, gimnasio: 35 } },
  "29": { nombre: "Málaga", tier: 2 },
  "30": { nombre: "Murcia", tier: 3 },
  "31": { nombre: "Navarra", tier: 2 },
  "32": { nombre: "Ourense", tier: 6 },
  "33": { nombre: "Asturias", tier: 3 },
  "34": { nombre: "Palencia", tier: 5 },
  "35": { nombre: "Las Palmas", tier: 3 },
  "36": { nombre: "Pontevedra", tier: 3 },
  "37": { nombre: "Salamanca", tier: 4 },
  "38": { nombre: "Santa Cruz de Tenerife", tier: 3 },
  "39": { nombre: "Cantabria", tier: 3 },
  "40": { nombre: "Segovia", tier: 4 },
  "41": { nombre: "Sevilla", tier: 3, real: { alquilerIndividual: 700, suministros: 100, comida: 200, transporte: 40, gimnasio: 32 } },
  "42": { nombre: "Soria", tier: 5 },
  "43": { nombre: "Tarragona", tier: 3 },
  "44": { nombre: "Teruel", tier: 6 },
  "45": { nombre: "Toledo", tier: 4 },
  "46": { nombre: "Valencia", tier: 2, real: { alquilerIndividual: 700, suministros: 90, comida: 190, transporte: 35, gimnasio: 30 } },
  "47": { nombre: "Valladolid", tier: 4 },
  "48": { nombre: "Vizcaya", tier: 2 },
  "49": { nombre: "Zamora", tier: 6 },
  "50": { nombre: "Zaragoza", tier: 3, real: { alquilerIndividual: 560, suministros: 90, comida: 180, transporte: 33, gimnasio: 28 } },
  "51": { nombre: "Ceuta", tier: 4 },
  "52": { nombre: "Melilla", tier: 4 },
};

// Municipios por provincia: nombre + tamaño (grande/media/pequeno)
// "grande" = ciudad de referencia (normalmente la capital)
const MUNICIPIOS = {
  "01": [{ n: "Vitoria-Gasteiz", t: "grande" }, { n: "Llodio", t: "media" }, { n: "Salvatierra", t: "pequeno" }],
  "02": [{ n: "Albacete", t: "grande" }, { n: "Hellín", t: "media" }, { n: "Almansa", t: "media" }],
  "03": [{ n: "Alicante", t: "grande" }, { n: "Elche", t: "grande" }, { n: "Benidorm", t: "media" }, { n: "Orihuela", t: "media" }],
  "04": [{ n: "Almería", t: "grande" }, { n: "El Ejido", t: "media" }, { n: "Roquetas de Mar", t: "media" }],
  "05": [{ n: "Ávila", t: "media" }, { n: "Arenas de San Pedro", t: "pequeno" }],
  "06": [{ n: "Badajoz", t: "grande" }, { n: "Mérida", t: "media" }, { n: "Don Benito", t: "pequeno" }],
  "07": [{ n: "Palma", t: "grande" }, { n: "Ibiza", t: "media" }, { n: "Maó", t: "media" }, { n: "Calvià", t: "media" }],
  "08": [{ n: "Barcelona", t: "grande" }, { n: "Badalona", t: "grande" }, { n: "Sabadell", t: "media" }, { n: "Terrassa", t: "media" }],
  "09": [{ n: "Burgos", t: "grande" }, { n: "Aranda de Duero", t: "pequeno" }, { n: "Miranda de Ebro", t: "pequeno" }],
  "10": [{ n: "Cáceres", t: "media" }, { n: "Plasencia", t: "pequeno" }, { n: "Navalmoral de la Mata", t: "pequeno" }],
  "11": [{ n: "Cádiz", t: "media" }, { n: "Jerez de la Frontera", t: "grande" }, { n: "Algeciras", t: "media" }, { n: "El Puerto de Santa María", t: "media" }],
  "12": [{ n: "Castellón de la Plana", t: "grande" }, { n: "Vila-real", t: "media" }, { n: "Vinaròs", t: "pequeno" }],
  "13": [{ n: "Ciudad Real", t: "media" }, { n: "Puertollano", t: "pequeno" }, { n: "Tomelloso", t: "pequeno" }],
  "14": [{ n: "Córdoba", t: "grande" }, { n: "Lucena", t: "media" }, { n: "Priego de Córdoba", t: "pequeno" }],
  "15": [{ n: "A Coruña", t: "grande" }, { n: "Santiago de Compostela", t: "media" }, { n: "Ferrol", t: "media" }],
  "16": [{ n: "Cuenca", t: "media" }, { n: "Tarancón", t: "pequeno" }],
  "17": [{ n: "Girona", t: "media" }, { n: "Figueres", t: "media" }, { n: "Lloret de Mar", t: "media" }],
  "18": [{ n: "Granada", t: "grande" }, { n: "Motril", t: "media" }, { n: "Baza", t: "pequeno" }],
  "19": [{ n: "Guadalajara", t: "media" }, { n: "Azuqueca de Henares", t: "media" }],
  "20": [{ n: "San Sebastián", t: "grande" }, { n: "Irún", t: "media" }, { n: "Eibar", t: "pequeno" }],
  "21": [{ n: "Huelva", t: "media" }, { n: "Lepe", t: "pequeno" }, { n: "Isla Cristina", t: "pequeno" }],
  "22": [{ n: "Huesca", t: "media" }, { n: "Barbastro", t: "pequeno" }, { n: "Jaca", t: "pequeno" }],
  "23": [{ n: "Jaén", t: "media" }, { n: "Linares", t: "media" }, { n: "Úbeda", t: "pequeno" }],
  "24": [{ n: "León", t: "grande" }, { n: "Ponferrada", t: "media" }],
  "25": [{ n: "Lleida", t: "media" }, { n: "Tàrrega", t: "pequeno" }],
  "26": [{ n: "Logroño", t: "grande" }, { n: "Calahorra", t: "pequeno" }],
  "27": [{ n: "Lugo", t: "media" }, { n: "Monforte de Lemos", t: "pequeno" }],
  "28": [{ n: "Madrid", t: "grande" }, { n: "Alcalá de Henares", t: "media" }, { n: "Móstoles", t: "media" }, { n: "Getafe", t: "media" }],
  "29": [{ n: "Málaga", t: "grande" }, { n: "Marbella", t: "media" }, { n: "Fuengirola", t: "media" }, { n: "Ronda", t: "pequeno" }],
  "30": [{ n: "Murcia", t: "grande" }, { n: "Cartagena", t: "media" }, { n: "Lorca", t: "media" }],
  "31": [{ n: "Pamplona", t: "grande" }, { n: "Tudela", t: "pequeno" }],
  "32": [{ n: "Ourense", t: "media" }, { n: "Verín", t: "pequeno" }],
  "33": [{ n: "Oviedo", t: "grande" }, { n: "Gijón", t: "grande" }, { n: "Avilés", t: "media" }],
  "34": [{ n: "Palencia", t: "media" }, { n: "Aguilar de Campoo", t: "pequeno" }],
  "35": [{ n: "Las Palmas de Gran Canaria", t: "grande" }, { n: "Telde", t: "media" }, { n: "Arrecife", t: "media" }],
  "36": [{ n: "Pontevedra", t: "media" }, { n: "Vigo", t: "grande" }, { n: "Vilagarcía de Arousa", t: "pequeno" }],
  "37": [{ n: "Salamanca", t: "grande" }, { n: "Béjar", t: "pequeno" }],
  "38": [{ n: "Santa Cruz de Tenerife", t: "grande" }, { n: "San Cristóbal de La Laguna", t: "media" }, { n: "Puerto de la Cruz", t: "media" }],
  "39": [{ n: "Santander", t: "grande" }, { n: "Torrelavega", t: "media" }],
  "40": [{ n: "Segovia", t: "media" }, { n: "Cuéllar", t: "pequeno" }],
  "41": [{ n: "Sevilla", t: "grande" }, { n: "Dos Hermanas", t: "media" }, { n: "Alcalá de Guadaíra", t: "media" }],
  "42": [{ n: "Soria", t: "pequeno" }, { n: "Almazán", t: "pequeno" }],
  "43": [{ n: "Tarragona", t: "media" }, { n: "Reus", t: "media" }, { n: "Salou", t: "pequeno" }],
  "44": [{ n: "Teruel", t: "pequeno" }, { n: "Alcañiz", t: "pequeno" }],
  "45": [{ n: "Toledo", t: "media" }, { n: "Talavera de la Reina", t: "media" }],
  "46": [{ n: "Valencia", t: "grande" }, { n: "Gandía", t: "media" }, { n: "Sagunto", t: "pequeno" }],
  "47": [{ n: "Valladolid", t: "grande" }, { n: "Medina del Campo", t: "pequeno" }],
  "48": [{ n: "Bilbao", t: "grande" }, { n: "Barakaldo", t: "media" }, { n: "Getxo", t: "media" }],
  "49": [{ n: "Zamora", t: "pequeno" }, { n: "Benavente", t: "pequeno" }],
  "50": [{ n: "Zaragoza", t: "grande" }, { n: "Calatayud", t: "pequeno" }],
  "51": [{ n: "Ceuta", t: "media" }],
  "52": [{ n: "Melilla", t: "media" }],
};
