````
/* ============================================================
   Lógica de la calculadora de mantenimiento de furgonetas.
   Los datos viven en furgonetas-datos.js.
   Utilidades compartidas en common.js.
   ============================================================ */

const ANIO_ACTUAL_FURGONETA = 2026;
const STORAGE_KEY_FURGONETA = "cc_furgoneta";


function poblarMarcasFurgoneta() {
  const select = document.getElementById("marca");

  const idsOrdenados = Object.keys(MARCAS_FURGONETAS).sort((a, b) =>
    MARCAS_FURGONETAS[a].nombre.localeCompare(
      MARCAS_FURGONETAS[b].nombre,
      "es"
    )
  );

  select.innerHTML = idsOrdenados
    .map(
      (id) =>
        `<option value="${id}">${MARCAS_FURGONETAS[id].nombre}</option>`
    )
    .join("");
}


function poblarModelosFurgoneta(marcaId) {
  const select = document.getElementById("modelo");
  const modelos = MARCAS_FURGONETAS[marcaId].modelos;

  select.innerHTML = Object.keys(modelos)
    .map(
      (id) =>
        `<option value="${id}">${modelos[id].nombre}</option>`
    )
    .join("");
}


function poblarMotorizacionesFurgoneta(marcaId, modeloId) {
  const select = document.getElementById("motorizacion");

  const motorizaciones =
    MARCAS_FURGONETAS[marcaId].modelos[modeloId].motorizaciones;

  select.innerHTML = motorizaciones
    .map(
      (motor) =>
        `<option value="${motor.id}">${motor.nombre}</option>`
    )
    .join("");
}


function poblarAniosFurgoneta(marcaId, modeloId) {
  const select = document.getElementById("anio");

  const anioMin =
    MARCAS_FURGONETAS[marcaId].modelos[modeloId].anioMin;

  const anios = [];

  for (
    let anio = ANIO_ACTUAL_FURGONETA;
    anio >= anioMin;
    anio--
  ) {
    anios.push(anio);
  }

  select.innerHTML = anios
    .map((anio) => `<option value="${anio}">${anio}</option>`)
    .join("");
}


function alCambiarMarcaFurgoneta() {
  const marcaId = document.getElementById("marca").value;

  poblarModelosFurgoneta(marcaId);
  alCambiarModeloFurgoneta();
}


function alCambiarModeloFurgoneta() {
  const marcaId = document.getElementById("marca").value;
  const modeloId = document.getElementById("modelo").value;

  poblarMotorizacionesFurgoneta(marcaId, modeloId);
  poblarAniosFurgoneta(marcaId, modeloId);

  calcularFurgoneta();
}


function actualizarColorFurgoneta() {
  const colorId = document.getElementById("color").value;
  const color = COLORES_FURGONETA[colorId];

  if (!color) return;

  document.querySelectorAll(".van-shape").forEach((el) => {
    el.style.fill = color.hex;
  });
}


function factorSeguroPorAntiguedadFurgoneta(antiguedad) {
  if (antiguedad <= 3) return 1.15;
  if (antiguedad <= 8) return 1.0;
  return 0.85;
}


function factorRevisionPorAntiguedadFurgoneta(antiguedad) {
  if (antiguedad <= 3) return 0.7;
  if (antiguedad <= 8) return 1.0;
  return 1.4;
}


function calcularFurgoneta() {
  const marcaId = document.getElementById("marca").value;
  const modeloId = document.getElementById("modelo").value;
  const motorId = document.getElementById("motorizacion").value;
  const anio = Number(document.getElementById("anio").value);
  const kmAnual = Number(document.getElementById("km").value);
  const conParking =
    document.getElementById("parking").value === "si";

  const marca = MARCAS_FURGONETAS[marcaId];
  if (!marca) return;

  const modelo = marca.modelos[modeloId];
  if (!modelo) return;

  const motor = modelo.motorizaciones.find(
    (m) => m.id === motorId
  );

  if (!motor) return;

  const base = SEGMENTO_BASE_FURGONETA[marca.segmento];
  const carroceriaFactor =
    CARROCERIA_MULT_FURGONETA[modelo.carroceria];

  const antiguedad =
    ANIO_ACTUAL_FURGONETA - anio;

  const esElectrica = motor.tipo === "electrico";

  const seguro = Math.round(
    base.seguro *
      carroceriaFactor *
      factorSeguroPorAntiguedadFurgoneta(antiguedad) *
      (esElectrica ? 1.15 : 1)
  );

  const revision = Math.round(
    base.revision *
      carroceriaFactor *
      factorRevisionPorAntiguedadFurgoneta(antiguedad) *
      (esElectrica ? 0.75 : 1)
  );

  const impuesto = Math.round(
    base.impuesto *
      (esElectrica ? 0.25 : 1)
  );

  /*
     Las furgonetas tienen una ITV diferente de la de un turismo.
     Para esta estimación utilizamos un coste mensual prorrateado.
  */
  const itv = esElectrica ? 3 : 4;


  const kmMes = kmAnual / 12;

  let gastoEnergia;
  let nombreEnergia;

  if (esElectrica) {

    const kwhMes =
      (kmMes / 100) * motor.consumoKwh;

    gastoEnergia = Math.round(
      kwhMes * PRECIO_ELECTRICIDAD_FURGONETA
    );

    nombreEnergia = "Electricidad (carga en casa)";

  } else {

    const precioLitro =
      PRECIO_COMBUSTIBLE_FURGONETA[motor.tipo] ||
      PRECIO_COMBUSTIBLE_FURGONETA.gasolina;

    const litrosMes =
      (kmMes / 100) * motor.consumo;

    gastoEnergia = Math.round(
      litrosMes * precioLitro
    );

    nombreEnergia =
      motor.tipo === "hibrido"
        ? "Combustible (híbrido)"
        : "Combustible";
  }


  const items = [
    {
      nombre: "Seguro",
      valor: seguro,
    },
    {
      nombre: "Impuesto de circulación",
      valor: impuesto,
    },
    {
      nombre: "ITV (prorrateada)",
      valor: itv,
    },
    {
      nombre: "Revisiones y averías",
      valor: revision,
    },
    {
      nombre: nombreEnergia,
      valor: gastoEnergia,
    },
  ];


  if (conParking) {
    items.push({
      nombre: "Plaza de garaje",
      valor: PARKING_MES_FURGONETA,
    });
  }


  const total = items.reduce(
    (sum, item) => sum + item.valor,
    0
  );


  CC.pintarRecibo("receipt", {

    icon: esElectrica ? "🔋" : "🚐",

    titulo:
      `${marca.nombre} ${modelo.nombre} (${anio})`,

    subtitulo: motor.nombre,

    items,

    total,

    totalLabel: "Total al mes",

    nota:
      "Estimación orientativa. El seguro, el consumo y los costes de mantenimiento pueden variar según el uso profesional o particular, la carga, la provincia y el tipo de conducción.",
  });


  CC.pintarBreadcrumb("breadcrumb", [

    {
      texto: "Inicio",
      href: "../index.html",
    },

    {
      texto: "Vehículos",
      href: "../index.html#vehiculos",
    },

    {
      texto:
        `${marca.nombre} ${modelo.nombre}`,
    },

  ]);


  const form =
    document.getElementById("calc-form");

  CC.guardarFormulario(
    STORAGE_KEY_FURGONETA,
    form
  );

  CC.sincronizarURL(form);
}


document.addEventListener(
  "DOMContentLoaded",
  () => {

    poblarMarcasFurgoneta();

    const form =
      document.getElementById("calc-form");


    /*
       Intentamos recuperar primero los datos
       guardados y después los parámetros de URL.
    */
    CC.restaurarFormulario(
      STORAGE_KEY_FURGONETA,
      form
    );

    CC.aplicarParamsAFormulario(form);


    const selectMarca =
      document.getElementById("marca");


    const marcaInicial =
      MARCAS_FURGONETAS[selectMarca.value]
        ? selectMarca.value
        : "volkswagen";


    selectMarca.value =
      marcaInicial;


    poblarModelosFurgoneta(
      marcaInicial
    );


    const modelosDisponibles =
      MARCAS_FURGONETAS[
        marcaInicial
      ].modelos;


    const modeloSelect =
      document.getElementById("modelo");


    const modeloInicial =
      modelosDisponibles[
        modeloSelect.value
      ]
        ? modeloSelect.value
        : Object.keys(
            modelosDisponibles
          )[0];


    modeloSelect.value =
      modeloInicial;


    poblarMotorizacionesFurgoneta(
      marcaInicial,
      modeloInicial
    );


    poblarAniosFurgoneta(
      marcaInicial,
      modeloInicial
    );


    /*
       Volvemos a aplicar los datos guardados
       ahora que ya existen las opciones
       de modelo, motor y año.
    */
    CC.restaurarFormulario(
      STORAGE_KEY_FURGONETA,
      form
    );

    CC.aplicarParamsAFormulario(
      form
    );


    actualizarColorFurgoneta();


    document
      .getElementById("marca")
      .addEventListener(
        "change",
        alCambiarMarcaFurgoneta
      );


    document
      .getElementById("modelo")
      .addEventListener(
        "change",
        alCambiarModeloFurgoneta
      );


    document
      .getElementById("color")
      .addEventListener(
        "change",
        actualizarColorFurgoneta
      );


    form.addEventListener(
      "input",
      calcularFurgoneta
    );


    calcularFurgoneta();
  }
);
````
