const LANGUAGE_KEY = "trackflow-lang";

const translations = {
  index: {
    en: {
      logo_tagline: "US + Spain Logistics",
      nav_features: "Features",
      nav_how: "How it works",
      nav_why: "Why TrackFlow",
      nav_apply: "Apply now",
      mobile_apply: "Apply",
      hero_badge: "Founded in Los Angeles, scaling across two countries",
      hero_title: "Your parcels move. Your team focuses on growth.",
      hero_text:
        "TrackFlow runs your entire logistics operation, from storage and pick-pack to carrier delivery and returns, so your brand can focus on selling while we handle the physical complexity.",
      hero_cta_start: "Start application",
      hero_cta_how: "See how it works",
      run_command_label: "Local run command in Codespaces: <span class='font-semibold text-emerald-700'>npx serve .</span>",
      stat_team: "Team members",
      stat_countries: "Countries",
      stat_carriers: "Carrier partners",
      features_title: "Core capabilities",
      features_text:
        "TrackFlow Tech modernizes operations with integrated logistics systems for warehouses, carriers, returns, and customer support.",
      feature_1_title: "Unified inventory visibility",
      feature_1_text:
        "One real-time view of stock across Los Angeles and Zaragoza to eliminate blind spots and stockouts.",
      feature_2_title: "Smart carrier orchestration",
      feature_2_text:
        "Select the right carrier by destination, urgency, and weight with explainable recommendations.",
      feature_3_title: "Automated returns flow",
      feature_3_text:
        "Rules-driven approvals and AI-assisted product condition checks reduce delays and manual workload.",
      how_title: "How it works",
      how_step_1: "Step 01",
      how_1_title: "Connect your channels",
      how_1_text: "Share order sources and priorities. We map your SKUs, fulfillment rules, and SLAs.",
      how_step_2: "Step 02",
      how_2_title: "Operate in real time",
      how_2_text: "Inventory, shipment status, incidents, and returns are visible through centralized dashboards.",
      how_step_3: "Step 03",
      how_3_title: "Scale with confidence",
      how_3_text: "Automated reporting, alerting, and customer support improve speed, margin, and retention.",
      why_title: "Built for real-world logistics complexity",
      why_1_title: "Cross-border from day one",
      why_1_text: "Operations in two countries, multilingual workflows, and carrier diversity with one coordinated operating model.",
      why_2_title: "Data that drives decisions",
      why_2_text: "Executive dashboards and automated weekly reporting provide fresher insight than manual spreadsheet cycles.",
      snapshot_title: "Company snapshot from TrackFlow briefing",
      snapshot_text: "Facts below come from the internal TrackFlow briefing and summarize the current company context.",
      snapshot_card_1_label: "Founded",
      snapshot_card_1_value: "2009",
      snapshot_card_2_label: "Annual revenue",
      snapshot_card_2_value: "~EUR 9M",
      snapshot_card_3_label: "Active markets",
      snapshot_card_3_value: "US + Spain",
      snapshot_card_4_label: "Team size",
      snapshot_card_4_value: "~130 people",
      snapshot_leadership_title: "Leadership and structure",
      snapshot_leadership_text: "CEO Thomas Harry leads from Los Angeles, while CTO Andres Kim runs technology from Zaragoza.",
      snapshot_pain_title: "Current operational gaps",
      snapshot_pain_text: "Inventory is fragmented across warehouses, carrier operations are manual, and reporting is assembled by hand.",
      contact_title: "Contact",
      contact_email: "Email: growth@trackflow.example",
      contact_phone: "Phone: +1 213 555 0198",
      contact_location: "Los Angeles, US and Zaragoza, ES",
      footer_cta: "Apply to onboard your brand",
      footer_tagline: "TrackFlow Tech | Last-mile delivery and warehouse management",
      footer_rights: "© 2026 TrackFlow. All rights reserved."
    },
    es: {
      logo_tagline: "Logistica en EE. UU. y Espana",
      nav_features: "Funciones",
      nav_how: "Como funciona",
      nav_why: "Por que TrackFlow",
      nav_apply: "Aplicar ahora",
      mobile_apply: "Aplicar",
      hero_badge: "Fundada en Los Angeles, escalando en dos paises",
      hero_title: "Tus paquetes se mueven. Tu equipo se enfoca en crecer.",
      hero_text:
        "TrackFlow gestiona toda tu operacion logistica, desde almacenamiento y pick-pack hasta entrega con carriers y devoluciones, para que tu marca se enfoque en vender.",
      hero_cta_start: "Iniciar solicitud",
      hero_cta_how: "Ver como funciona",
      run_command_label: "Comando local en Codespaces: <span class='font-semibold text-emerald-700'>npx serve .</span>",
      stat_team: "Miembros del equipo",
      stat_countries: "Paises",
      stat_carriers: "Carriers aliados",
      features_title: "Capacidades clave",
      features_text:
        "TrackFlow Tech moderniza operaciones con sistemas integrados para almacenes, carriers, devoluciones y atencion al cliente.",
      feature_1_title: "Visibilidad unificada de inventario",
      feature_1_text:
        "Una vista en tiempo real del stock en Los Angeles y Zaragoza para eliminar puntos ciegos y quiebres de stock.",
      feature_2_title: "Orquestacion inteligente de carriers",
      feature_2_text:
        "Selecciona el carrier ideal segun destino, urgencia y peso con recomendaciones explicables.",
      feature_3_title: "Flujo automatizado de devoluciones",
      feature_3_text:
        "Aprobaciones por reglas e inspeccion asistida por IA para reducir retrasos y carga manual.",
      how_title: "Como funciona",
      how_step_1: "Paso 01",
      how_1_title: "Conecta tus canales",
      how_1_text: "Comparte fuentes de pedidos y prioridades. Mapeamos tus SKU, reglas de fulfillment y SLA.",
      how_step_2: "Paso 02",
      how_2_title: "Opera en tiempo real",
      how_2_text: "Inventario, estado de envios, incidencias y devoluciones visibles en tableros centralizados.",
      how_step_3: "Paso 03",
      how_3_title: "Escala con confianza",
      how_3_text: "Reportes, alertas y soporte automatizado mejoran velocidad, margen y retencion.",
      why_title: "Disenado para la complejidad logistica real",
      why_1_title: "Operacion binacional desde el dia uno",
      why_1_text: "Operaciones en dos paises, flujos multilenguaje y diversidad de carriers con un solo modelo operativo.",
      why_2_title: "Datos para decidir mejor",
      why_2_text: "Tableros ejecutivos y reportes semanales automaticos con informacion mas fresca que los procesos manuales.",
      snapshot_title: "Resumen de empresa segun briefing de TrackFlow",
      snapshot_text: "Los datos de abajo vienen del briefing interno de TrackFlow y resumen el contexto actual de la empresa.",
      snapshot_card_1_label: "Fundada",
      snapshot_card_1_value: "2009",
      snapshot_card_2_label: "Ingresos anuales",
      snapshot_card_2_value: "~EUR 9M",
      snapshot_card_3_label: "Mercados activos",
      snapshot_card_3_value: "EE. UU. y Espana",
      snapshot_card_4_label: "Tamano del equipo",
      snapshot_card_4_value: "~130 personas",
      snapshot_leadership_title: "Liderazgo y estructura",
      snapshot_leadership_text: "El CEO Thomas Harry lidera desde Los Angeles, mientras el CTO Andres Kim dirige tecnologia desde Zaragoza.",
      snapshot_pain_title: "Brechas operativas actuales",
      snapshot_pain_text: "El inventario esta fragmentado entre almacenes, la operacion con carriers es manual y los reportes se arman a mano.",
      contact_title: "Contacto",
      contact_email: "Correo: growth@trackflow.example",
      contact_phone: "Telefono: +1 213 555 0198",
      contact_location: "Los Angeles, EE. UU. y Zaragoza, ES",
      footer_cta: "Aplica para integrar tu marca",
      footer_tagline: "TrackFlow Tech | Gestion de ultima milla y almacenes",
      footer_rights: "© 2026 TrackFlow. All rights reserved."
    }
  },
  application: {
    en: {
      back_to_website: "Back to website",
      form_title: "Brand onboarding application",
      form_subtitle:
        "Complete this form so TrackFlow can evaluate your fulfillment and last-mile needs across US and Spain operations.",
      form_help: "All fields marked with * are required.",
      legend_company: "Company profile",
      label_client_id: "Client ID *",
      legend_contact: "Primary contact",
      legend_ops: "Operational requirements",
      submit_button: "Submit application",
      clear_button: "Clear form",
      footer_contact: "Contact: growth@trackflow.example | +1 213 555 0198"
    },
    es: {
      back_to_website: "Volver al sitio",
      form_title: "Solicitud de integracion de marca",
      form_subtitle:
        "Completa este formulario para que TrackFlow evalua tus necesidades de fulfillment y ultima milla en EE. UU. y Espana.",
      form_help: "Todos los campos marcados con * son obligatorios.",
      legend_company: "Perfil de la empresa",
      label_client_id: "ID del cliente *",
      legend_contact: "Contacto principal",
      legend_ops: "Requisitos operativos",
      submit_button: "Enviar solicitud",
      clear_button: "Limpiar formulario",
      footer_contact: "Contacto: growth@trackflow.example | +1 213 555 0198"
    }
  }
};

function getLanguage() {
  const value = localStorage.getItem(LANGUAGE_KEY);
  return value === "es" ? "es" : "en";
}

function setLanguage(lang) {
  localStorage.setItem(LANGUAGE_KEY, lang);
  applyTranslations(lang);
}

function applyTranslations(lang) {
  const page = document.body.dataset.page;
  const dict = translations[page]?.[lang];
  if (!dict) return;

  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const value = dict[key];
    if (!value) return;

    if (value.includes("<span")) {
      element.innerHTML = value;
    } else {
      element.textContent = value;
    }
  });

  const toggleButton = document.getElementById("languageToggle");
  if (toggleButton) {
    const targetLang = lang === "en" ? "ES" : "EN";
    toggleButton.textContent = targetLang;
    toggleButton.setAttribute("aria-label", lang === "en" ? "Cambiar idioma a espanol" : "Switch language to English");
  }
}

const initialLanguage = getLanguage();
applyTranslations(initialLanguage);

const languageToggle = document.getElementById("languageToggle");
if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    const current = getLanguage();
    const next = current === "en" ? "es" : "en";
    setLanguage(next);
  });
}
