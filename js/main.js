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
