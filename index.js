const startApplicationBtn = document.getElementById("startApplicationBtn");
const seeHowItWorksBtn = document.getElementById("seeHowItWorksBtn");
const howItWorksSection = document.getElementById("how-it-works");
const ctaStatus = document.getElementById("ctaStatus");

function getLang() {
  return localStorage.getItem("trackflow-lang") === "es" ? "es" : "en";
}

function uiText(key) {
  const lang = getLang();
  const copy = {
    en: {
      preparing: "Preparing application...",
      opening: "Opening the TrackFlow application form.",
      jumped: "Jumped to How it works section."
    },
    es: {
      preparing: "Preparando solicitud...",
      opening: "Abriendo el formulario de TrackFlow.",
      jumped: "Seccion Como funciona abierta."
    }
  };

  return copy[lang][key];
}

if (startApplicationBtn) {
  startApplicationBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const destination = startApplicationBtn.getAttribute("href");
    if (!destination) return;

    startApplicationBtn.classList.add("opacity-80", "pointer-events-none");
    startApplicationBtn.textContent = uiText("preparing");

    if (ctaStatus) {
      ctaStatus.textContent = uiText("opening");
    }

    window.setTimeout(() => {
      window.location.href = destination;
    }, 700);
  });
}

if (seeHowItWorksBtn && howItWorksSection) {
  seeHowItWorksBtn.addEventListener("click", (event) => {
    event.preventDefault();

    howItWorksSection.scrollIntoView({ behavior: "smooth", block: "start" });

    if (ctaStatus) {
      ctaStatus.textContent = uiText("jumped");
    }

    howItWorksSection.classList.add("ring-2", "ring-amber-300", "ring-offset-2", "ring-offset-slate-950");

    const cards = howItWorksSection.querySelectorAll("article");
    cards.forEach((card, index) => {
      window.setTimeout(() => {
        card.classList.add("scale-[1.02]", "shadow-xl");
      }, index * 140);

      window.setTimeout(() => {
        card.classList.remove("scale-[1.02]", "shadow-xl");
      }, 900 + index * 140);
    });

    window.setTimeout(() => {
      howItWorksSection.classList.remove("ring-2", "ring-amber-300", "ring-offset-2", "ring-offset-slate-950");
    }, 1400);
  });
}
