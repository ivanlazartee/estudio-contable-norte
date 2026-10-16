// =========================================
// Estudio Contable Norte - main.js
// =========================================

// ---------- 1. Libro contable del hero ----------
// Cada perfil tiene su lista de tareas que el estudio hace por el cliente.
const tareasPorPerfil = {
  monotributo: [
    "Pago mensual del monotributo",
    "Control de topes de facturación",
    "Recategorización semestral",
    "Ingresos Brutos provincial",
  ],
  autonomo: [
    "Declaración jurada de IVA",
    "Anticipos de Ganancias",
    "Aportes de autónomos",
    "Ingresos Brutos provincial",
    "Libro IVA digital",
  ],
  sociedad: [
    "IVA y Ganancias de la sociedad",
    "Liquidación de sueldos y F.931",
    "Libros contables al día",
    "Balance anual",
    "Convenio Multilateral",
  ],
};

const lista = document.getElementById("libro-lineas");
const tabs = document.querySelectorAll(".libro__tabs button");

function mostrarPerfil(perfil) {
  const tareas = tareasPorPerfil[perfil];

  // Armamos un <li> por tarea. El retraso escalonado hace que
  // los renglones aparezcan de a uno, como si se escribieran.
  lista.innerHTML = tareas
    .map(
      (tarea, i) => `
      <li style="animation-delay: ${i * 60}ms">
        <span class="libro__tarea">${tarea}</span>
        <span class="libro__estado">Lo hacemos nosotros</span>
      </li>`
    )
    .join("");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
    tab.setAttribute("aria-selected", "true");
    mostrarPerfil(tab.dataset.perfil);
  });
});

mostrarPerfil("monotributo");

// ---------- 2. Menú mobile ----------
const menuBtn = document.querySelector(".menu-btn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  const abierto = nav.classList.toggle("abierto");
  menuBtn.setAttribute("aria-expanded", abierto);
  menuBtn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
});

// Al tocar un link, cerramos el menú
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("abierto");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// ---------- 3. Formulario -> WhatsApp ----------
const NUMERO_WHATSAPP = "5493810000000"; // número de ejemplo

const form = document.getElementById("form-contacto");
const error = document.getElementById("form-error");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = form.nombre.value.trim();
  const situacion = form.situacion.value;
  const mensaje = form.mensaje.value.trim();

  if (nombre === "") {
    error.textContent = "Escribí tu nombre para que sepamos a quién responder.";
    form.nombre.focus();
    return;
  }
  error.textContent = "";

  const texto =
    `Hola, soy ${nombre}. ${situacion}.` +
    (mensaje ? ` ${mensaje}` : " Quiero pedir una consulta.");

  // encodeURIComponent convierte espacios y acentos para que viajen en la URL
  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank", "noopener");
});

// ---------- 4. Año del footer ----------
document.getElementById("anio").textContent = new Date().getFullYear();

// ---------- 5. Planes: interruptor mensual / anual ----------
const DESCUENTO_ANUAL = 0.15; // 15%

const switchPeriodo = document.getElementById("periodo-switch");
const opcionMensual = document.getElementById("periodo-mensual");
const opcionAnual = document.getElementById("periodo-anual");
const precios = document.querySelectorAll(".plan__precio");

// Formatea números como pesos argentinos: 21250 -> "$ 21.250"
const formatoPesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function actualizarPrecios(esAnual) {
  precios.forEach((precio) => {
    // El precio base está guardado en el HTML: data-mensual="25000"
    const mensual = Number(precio.dataset.mensual);
    const detalle = precio.nextElementSibling;

    if (esAnual) {
      // Ejemplo con el plan Monotributo:
      // 25000 * (1 - 0.15) = 21250  -> lo que pagás por mes
      // 21250 * 12         = 255000 -> lo que pagás en el año
      const mensualConDescuento = Math.round(mensual * (1 - DESCUENTO_ANUAL));
      const totalAnual = mensualConDescuento * 12;

      precio.textContent = formatoPesos.format(mensualConDescuento);
      detalle.innerHTML = `por mes<br>${formatoPesos.format(totalAnual)} en un pago`;
    } else {
      precio.textContent = formatoPesos.format(mensual);
      detalle.textContent = "por mes";
    }

    // Reiniciamos la animación para que se note el cambio
    precio.classList.remove("cambio");
    void precio.offsetWidth; // truco: fuerza al navegador a "olvidar" la animación
    precio.classList.add("cambio");
  });

  opcionMensual.classList.toggle("periodo__opcion--activa", !esAnual);
  opcionAnual.classList.toggle("periodo__opcion--activa", esAnual);
}

switchPeriodo.addEventListener("click", () => {
  const esAnual = switchPeriodo.getAttribute("aria-checked") !== "true";
  switchPeriodo.setAttribute("aria-checked", esAnual);
  actualizarPrecios(esAnual);
});

// Mostramos los precios con el mismo formato desde el inicio
actualizarPrecios(false);

// ---------- 6. Botones "Elegir" -> completan el formulario ----------
document.querySelectorAll("[data-plan]").forEach((boton) => {
  boton.addEventListener("click", () => {
    const esAnual = switchPeriodo.getAttribute("aria-checked") === "true";
    const periodo = esAnual ? "con pago anual" : "con pago mensual";

    form.situacion.value = boton.dataset.situacion;
    form.mensaje.value = `Me interesa el plan ${boton.dataset.plan} ${periodo}.`;

    document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
    form.nombre.focus({ preventScroll: true });
  });
});

// ---------- 7. Selector de plan en celular ----------
// La tabla tiene data-col="3" (Responsable inscripto) por defecto.
// Al tocar "Sociedad" pasa a data-col="4" y el CSS oculta las otras columnas.
const tablaPlanes = document.querySelector(".tabla-planes");
const botonesSelector = document.querySelectorAll(".planes__selector button");

botonesSelector.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesSelector.forEach((b) => b.setAttribute("aria-pressed", "false"));
    boton.setAttribute("aria-pressed", "true");
    tablaPlanes.dataset.col = boton.dataset.col;
  });
});
