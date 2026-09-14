/* ============================================================
   CC — utilidades compartidas por todas las páginas del sitio.
   Modo oscuro, recibo estándar, guardado de formularios (URL +
   localStorage), copiar/compartir/imprimir/PDF.
   ============================================================ */

const CC = {};

/* ---------- Modo oscuro ---------- */

CC.initThemeToggle = function () {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const actual = () => document.documentElement.getAttribute("data-theme") === "oscuro";

  const pintarBoton = () => {
    btn.textContent = actual() ? "☀️ Claro" : "🌙 Oscuro";
  };
  pintarBoton();

  btn.addEventListener("click", () => {
    const nuevoOscuro = !actual();
    if (nuevoOscuro) {
      document.documentElement.setAttribute("data-theme", "oscuro");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem("cc-tema", nuevoOscuro ? "oscuro" : "claro");
    } catch (e) {
      /* localStorage no disponible: seguimos sin recordar el tema */
    }
    pintarBoton();
  });
};

/* ---------- Breadcrumb ---------- */

// niveles: [{ texto: "Inicio", href: "../index.html" }, { texto: "Vivienda" }, ...]
CC.pintarBreadcrumb = function (contenedorId, niveles) {
  const el = document.getElementById(contenedorId);
  if (!el) return;
  el.innerHTML = niveles
    .map((n, i) => {
      const esUltimo = i === niveles.length - 1;
      const texto = esUltimo
        ? `<span class="current" aria-current="page">${n.texto}</span>`
        : `<a href="${n.href}">${n.texto}</a>`;
      const sep = i > 0 ? '<span class="sep">›</span>' : "";
      return sep + texto;
    })
    .join("");
};

/* ---------- Guardar/restaurar formularios ---------- */

CC.guardarFormulario = function (storageKey, formEl) {
  try {
    const datos = {};
    Array.from(formEl.elements).forEach((el) => {
      if (el.name) datos[el.name] = el.value;
    });
    localStorage.setItem(storageKey, JSON.stringify(datos));
  } catch (e) {
    /* localStorage no disponible: no pasa nada, simplemente no se recuerda */
  }
};

CC.restaurarFormulario = function (storageKey, formEl) {
  try {
    const guardado = localStorage.getItem(storageKey);
    if (!guardado) return false;
    const datos = JSON.parse(guardado);
    let aplicado = false;
    Object.entries(datos).forEach(([nombre, valor]) => {
      if (formEl.elements[nombre]) {
        formEl.elements[nombre].value = valor;
        aplicado = true;
      }
    });
    return aplicado;
  } catch (e) {
    return false;
  }
};

CC.aplicarParamsAFormulario = function (formEl) {
  const params = new URLSearchParams(window.location.search);
  let aplicado = false;
  Array.from(formEl.elements).forEach((el) => {
    if (el.name && params.has(el.name)) {
      el.value = params.get(el.name);
      aplicado = true;
    }
  });
  return aplicado;
};

CC.sincronizarURL = function (formEl) {
  const params = new URLSearchParams();
  Array.from(formEl.elements).forEach((el) => {
    if (el.name) params.set(el.name, el.value);
  });
  const nuevaURL = window.location.pathname + "?" + params.toString();
  window.history.replaceState(null, "", nuevaURL);
};

/* ---------- Formato de moneda ---------- */

CC.euros = function (n) {
  return n.toLocaleString("es-ES", { maximumFractionDigits: 0 }) + " €";
};

/* ---------- Recibo estándar ---------- */

// opts: { icon, titulo, subtitulo, items: [{nombre, valor}], total, totalLabel, nota, esGasto }
CC.pintarRecibo = function (containerId, opts) {
  const receipt = document.getElementById(containerId);
  if (!receipt) return;

  receipt.classList.add("is-updating");

  const filas = opts.items
    .map(
      (item) => `
      <div class="line-item">
        <span>${item.nombre}</span>
        <span class="amount">${CC.euros(item.valor)}</span>
      </div>`
    )
    .join("");

  const subtituloHtml = opts.subtitulo ? `<p class="receipt-subtitulo">${opts.subtitulo}</p>` : "";
  const claseValor = opts.esGasto === false ? "value" : "value expense";

  receipt.innerHTML = `
    ${opts.icon ? `<div class="receipt-icon">${opts.icon}</div>` : ""}
    <div class="receipt-total-hero">
      <span class="label">${opts.totalLabel || "Total al mes"}</span>
      <span class="${claseValor}">${CC.euros(opts.total)}</span>
    </div>
    <div class="receipt-title">
      <span>${opts.titulo}</span>
      <span class="stamp">estimado</span>
    </div>
    ${subtituloHtml}
    ${filas}
    <p class="receipt-note">${opts.nota || ""}</p>
    <div class="receipt-actions">
      <button type="button" class="btn" data-action="copiar">📋 Copiar</button>
      <button type="button" class="btn" data-action="compartir">🔗 Compartir</button>
      <button type="button" class="btn" data-action="imprimir">🖨️ Imprimir</button>
      <button type="button" class="btn" data-action="pdf">⬇️ Descargar PDF</button>
    </div>
  `;

  receipt.dataset.titulo = opts.titulo;
  receipt.dataset.total = opts.total;
  receipt.dataset.totalLabel = opts.totalLabel || "Total al mes";
  receipt.dataset.items = JSON.stringify(opts.items);
  receipt.dataset.nota = opts.nota || "";

  requestAnimationFrame(() => receipt.classList.remove("is-updating"));
};

/* ---------- Comparador lado a lado ---------- */

// opciones: [{ icon, titulo, total, sub }, ...] — se resalta automáticamente la de menor total
CC.pintarComparador = function (containerId, opts) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const minTotal = Math.min(...opts.opciones.map((o) => o.total));

  const tarjetas = opts.opciones
    .map((o) => {
      const esGanadora = o.total === minTotal;
      return `
        <div class="compare-card ${esGanadora ? "is-winner" : ""}">
          ${esGanadora ? '<span class="winner-badge">Más barato</span>' : ""}
          <span class="compare-icon">${o.icon}</span>
          <h3>${o.titulo}</h3>
          <span class="compare-total">${CC.euros(o.total)}</span>
          <span class="compare-sub">${o.sub || ""}</span>
        </div>`;
    })
    .join("");

  const diferencia = Math.abs(opts.opciones[0].total - opts.opciones[1].total);

  el.innerHTML = `
    <div class="compare-grid">${tarjetas}</div>
    <p class="compare-diff">Diferencia: ${CC.euros(diferencia)} al mes</p>
    <div class="receipt-actions" style="justify-content:center;">
      <button type="button" class="btn" data-action="copiar-comparador">📋 Copiar</button>
      <button type="button" class="btn" data-action="compartir-comparador">🔗 Compartir</button>
      <button type="button" class="btn" data-action="imprimir">🖨️ Imprimir</button>
    </div>
    <p class="receipt-note" style="text-align:center;">${opts.nota || ""}</p>
  `;

  el.dataset.opciones = JSON.stringify(opts.opciones);
};

document.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-action='copiar-comparador'], [data-action='compartir-comparador']");
  if (!btn) return;
  const contenedor = btn.closest("[data-opciones]");
  if (!contenedor) return;
  const opciones = JSON.parse(contenedor.dataset.opciones || "[]");
  const texto =
    opciones.map((o) => `${o.titulo}: ${CC.euros(o.total)}`).join("\n") +
    "\n\nComparado en Cuánto Cuesta — " +
    window.location.href;

  if (btn.dataset.action === "copiar-comparador") {
    navigator.clipboard.writeText(texto).then(() => CC.avisar(btn, "✅ Copiado")).catch(() => CC.avisar(btn, "No se pudo copiar"));
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => CC.avisar(btn, "✅ Enlace copiado")).catch(() => CC.avisar(btn, "No se pudo copiar"));
  }
});

/* ---------- Acciones del recibo: copiar / compartir / imprimir / PDF ---------- */

CC.textoRecibo = function (receipt) {
  const items = JSON.parse(receipt.dataset.items || "[]");
  const lineas = items.map((i) => `${i.nombre}: ${CC.euros(i.valor)}`);
  return [
    receipt.dataset.titulo,
    "",
    ...lineas,
    "",
    `${receipt.dataset.totalLabel}: ${CC.euros(Number(receipt.dataset.total))}`,
    "",
    "Calculado en Cuánto Cuesta — " + window.location.href,
  ].join("\n");
};

CC.avisar = function (btn, mensaje) {
  const original = btn.textContent;
  btn.textContent = mensaje;
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 1600);
};

CC.descargarPDF = function (receipt) {
  if (!window.jspdf) {
    window.print();
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const items = JSON.parse(receipt.dataset.items || "[]");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(receipt.dataset.titulo, 15, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  let y = 34;
  items.forEach((item) => {
    doc.text(item.nombre, 15, y);
    doc.text(CC.euros(item.valor), 195, y, { align: "right" });
    y += 8;
  });

  y += 4;
  doc.setDrawColor(180);
  doc.line(15, y, 195, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(receipt.dataset.totalLabel, 15, y);
  doc.text(CC.euros(Number(receipt.dataset.total)), 195, y, { align: "right" });

  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Cuánto Cuesta — cifras estimadas, ajústalas a tu caso.", 15, y);

  doc.save("cuanto-cuesta.pdf");
};

document.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-action]");
  if (!btn) return;
  const receipt = btn.closest(".receipt");
  if (!receipt) return;

  const accion = btn.dataset.action;

  if (accion === "copiar") {
    const texto = CC.textoRecibo(receipt);
    navigator.clipboard
      .writeText(texto)
      .then(() => CC.avisar(btn, "✅ Copiado"))
      .catch(() => CC.avisar(btn, "No se pudo copiar"));
  }

  if (accion === "compartir") {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: "Cuánto Cuesta", text: receipt.dataset.titulo, url }).catch(() => {});
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => CC.avisar(btn, "✅ Enlace copiado"))
        .catch(() => CC.avisar(btn, "No se pudo copiar"));
    }
  }

  if (accion === "imprimir") window.print();

  if (accion === "pdf") CC.descargarPDF(receipt);
});

document.addEventListener("DOMContentLoaded", () => {
  CC.initThemeToggle();
});
