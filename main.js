const showcaseViews = {
  mesa: {
    label: "Mesa y cliente",
    title: "El QR deja de ser un menu pasivo y se vuelve una interfaz de servicio.",
    description:
      "La experiencia de mesa mantiene la carta ordenada, el pedido visible y las acciones clave a un toque para que el salon no dependa de idas y vueltas innecesarias.",
    points: [
      "Categorias claras, busqueda rapida y cantidades visibles",
      "Seguimiento del borrador y del pedido activo desde la misma vista",
      "Acciones directas para llamar al mozo o pedir la cuenta"
    ],
    kicker: "Vista de mesa",
    previewTitle: "Flujo pensado para consumir sin friccion",
    cards: [
      {
        title: "Explorar menu",
        copy: "categorias, estados y cantidades visibles"
      },
      {
        title: "Mi pedido",
        copy: "seguimiento del borrador y del pedido activo"
      },
      {
        title: "Solicitudes",
        copy: "mozo y cuenta integrados a la experiencia"
      }
    ]
  },
  admin: {
    label: "Tablero admin",
    title: "El equipo ve pedidos, estados y senales sin cambiar de pantalla.",
    description:
      "Mozzo concentra lo que pasa en la mesa dentro de un panel que prioriza visibilidad operativa: pedidos nuevos, estados, alertas y solicitudes del salon en tiempo real.",
    points: [
      "Vista centralizada de pedidos activos y cambios de estado",
      "Alertas de llamar al mozo y pedir la cuenta por mesa",
      "QRs de mesas listos para imprimir o exportar"
    ],
    kicker: "Vista admin",
    previewTitle: "El tablero ordena la operacion cuando el local acelera",
    cards: [
      {
        title: "Pedidos activos",
        copy: "nuevos, en curso y listos desde una sola vista"
      },
      {
        title: "Senales del salon",
        copy: "mozo y cuenta resueltos como eventos accionables"
      },
      {
        title: "Mesas y QR",
        copy: "alta de mesas y QR listos para imprimir"
      }
    ]
  },
  menu: {
    label: "Carta e importacion",
    title: "La carta se actualiza como producto digital, no como archivo muerto.",
    description:
      "El menu se publica por versiones, conserva historial y puede acelerarse con importacion desde imagenes para salir del PDF viejo o la foto del menu plastificado.",
    points: [
      "Publicacion versionada sin perder historico de referencias",
      "OCR y revision guiada para importar una carta desde fotos",
      "Snapshots de items y precios para que los pedidos sigan legibles"
    ],
    kicker: "Vista de carta",
    previewTitle: "Actualizar menu sin romper la operacion",
    cards: [
      {
        title: "Version actual",
        copy: "la mesa siempre ve la carta publicada correcta"
      },
      {
        title: "Importacion asistida",
        copy: "OCR, banderas y revision antes de publicar"
      },
      {
        title: "Historico intacto",
        copy: "snapshots para sostener pedidos y precios previos"
      }
    ]
  }
};

const liveFeedMessages = [
  {
    title: "Mesa 12",
    copy: "Pidio la cuenta desde el QR y ya entro al tablero."
  },
  {
    title: "Pedido 103",
    copy: "Cambio a listo y la mesa ve el estado actualizado."
  },
  {
    title: "Carta publicada",
    copy: "Una nueva version del menu quedo visible sin reimprimir nada."
  },
  {
    title: "Mesa 05",
    copy: "Llamo al mozo y la solicitud aparecio en tiempo real."
  }
];

const counters = document.querySelectorAll("[data-counter]");
const reveals = document.querySelectorAll(".reveal");
const tabs = document.querySelectorAll(".showcase-tab");
const viewLabel = document.querySelector("[data-view-label]");
const viewTitle = document.querySelector("[data-view-title]");
const viewDescription = document.querySelector("[data-view-description]");
const viewPoints = document.querySelector("[data-view-points]");
const previewKicker = document.querySelector("[data-preview-kicker]");
const previewTitle = document.querySelector("[data-preview-title]");
const previewCards = document.querySelector("[data-preview-cards]");
const liveTitle = document.querySelector("[data-live-title]");
const liveCopy = document.querySelector("[data-live-copy]");

let activeView = "mesa";
let autoRotateIntervalId = null;

function animateCounter(element) {
  const target = Number.parseInt(element.dataset.counter || "0", 10);
  const duration = 1100;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased)).padStart(2, "0");

    if (progress < 1) {
      window.requestAnimationFrame(tick);
    }
  }

  window.requestAnimationFrame(tick);
}

if (counters.length > 0) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

if (reveals.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    },
    { threshold: 0.18 }
  );

  reveals.forEach((element) => revealObserver.observe(element));
}

function renderPreviewCards(cards) {
  previewCards.innerHTML = "";

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "preview-card";

    const strong = document.createElement("strong");
    strong.textContent = card.title;

    const span = document.createElement("span");
    span.textContent = card.copy;

    article.append(strong, span);
    previewCards.append(article);
  });
}

function renderView(viewKey) {
  const view = showcaseViews[viewKey];

  if (!view) {
    return;
  }

  activeView = viewKey;
  viewLabel.textContent = view.label;
  viewTitle.textContent = view.title;
  viewDescription.textContent = view.description;
  previewKicker.textContent = view.kicker;
  previewTitle.textContent = view.previewTitle;

  viewPoints.innerHTML = "";
  view.points.forEach((point) => {
    const item = document.createElement("li");
    item.textContent = point;
    viewPoints.append(item);
  });

  renderPreviewCards(view.cards);

  tabs.forEach((tab) => {
    const isActive = tab.dataset.view === viewKey;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
}

function nextView(current) {
  const keys = Object.keys(showcaseViews);
  const index = keys.indexOf(current);
  return keys[(index + 1) % keys.length];
}

if (tabs.length > 0) {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      renderView(tab.dataset.view);

      if (autoRotateIntervalId) {
        window.clearInterval(autoRotateIntervalId);
        autoRotateIntervalId = null;
      }
    });
  });

  renderView(activeView);

  autoRotateIntervalId = window.setInterval(() => {
    renderView(nextView(activeView));
  }, 5600);
}

if (liveTitle && liveCopy) {
  let liveIndex = 0;

  window.setInterval(() => {
    liveIndex = (liveIndex + 1) % liveFeedMessages.length;
    const nextMessage = liveFeedMessages[liveIndex];
    liveTitle.textContent = nextMessage.title;
    liveCopy.textContent = nextMessage.copy;
  }, 2600);
}
