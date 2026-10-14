(() => {
  const contentCards = {
    features: [
      {
        className: "rounded-2xl border border-emerald-100 bg-white p-6 shadow-md shadow-emerald-100/60",
        titleKey: "feature_1_title",
        title: "Unified inventory visibility",
        descriptionKey: "feature_1_text",
        description: "One real-time view of stock across every warehouse site to eliminate blind spots and stockouts.",
        titleClassName: "font-['Space_Grotesk'] text-xl font-semibold text-emerald-700",
        descriptionClassName: "mt-3 text-sm leading-6 text-slate-600",
      },
      {
        className: "rounded-2xl border border-emerald-100 bg-white p-6 shadow-md shadow-emerald-100/60",
        titleKey: "feature_2_title",
        title: "Smart carrier orchestration",
        descriptionKey: "feature_2_text",
        description: "Select the right carrier by destination, urgency, and weight with explainable recommendations.",
        titleClassName: "font-['Space_Grotesk'] text-xl font-semibold text-emerald-700",
        descriptionClassName: "mt-3 text-sm leading-6 text-slate-600",
      },
      {
        className: "rounded-2xl border border-emerald-100 bg-white p-6 shadow-md shadow-emerald-100/60",
        titleKey: "feature_3_title",
        title: "Automated returns flow",
        descriptionKey: "feature_3_text",
        description: "Rules-driven approvals and AI-assisted product condition checks reduce delays and manual workload.",
        titleClassName: "font-['Space_Grotesk'] text-xl font-semibold text-emerald-700",
        descriptionClassName: "mt-3 text-sm leading-6 text-slate-600",
      },
    ],
    steps: [
      {
        className: "rounded-2xl border border-lime-300 bg-lime-50 p-6",
        eyebrowKey: "how_step_1",
        eyebrow: "Step 01",
        eyebrowClassName: "text-xs uppercase tracking-[0.2em] text-emerald-700",
        titleKey: "how_1_title",
        title: "Connect your channels",
        titleClassName: "mt-3 font-['Space_Grotesk'] text-xl font-semibold text-slate-900",
        descriptionKey: "how_1_text",
        description: "Share order sources and priorities. We map your SKUs, fulfillment rules, and SLAs.",
        descriptionClassName: "mt-3 text-sm leading-6 text-slate-600",
      },
      {
        className: "rounded-2xl border border-yellow-300 bg-yellow-50 p-6",
        eyebrowKey: "how_step_2",
        eyebrow: "Step 02",
        eyebrowClassName: "text-xs uppercase tracking-[0.2em] text-emerald-700",
        titleKey: "how_2_title",
        title: "Operate in real time",
        titleClassName: "mt-3 font-['Space_Grotesk'] text-xl font-semibold text-slate-900",
        descriptionKey: "how_2_text",
        description: "Inventory, shipment status, incidents, and returns are visible through centralized dashboards.",
        descriptionClassName: "mt-3 text-sm leading-6 text-slate-600",
      },
      {
        className: "rounded-2xl border border-emerald-300 bg-emerald-50 p-6",
        eyebrowKey: "how_step_3",
        eyebrow: "Step 03",
        eyebrowClassName: "text-xs uppercase tracking-[0.2em] text-emerald-700",
        titleKey: "how_3_title",
        title: "Scale with confidence",
        titleClassName: "mt-3 font-['Space_Grotesk'] text-xl font-semibold text-slate-900",
        descriptionKey: "how_3_text",
        description: "Automated reporting, alerting, and customer support improve speed, margin, and retention.",
        descriptionClassName: "mt-3 text-sm leading-6 text-slate-600",
      },
    ],
    reasons: [
      {
        className: "rounded-2xl border border-yellow-200 bg-yellow-50 p-6",
        titleKey: "why_1_title",
        title: "Complex operations, connected",
        descriptionKey: "why_1_text",
        description: "Multiple warehouse systems, carrier diversity, and multilingual workflows connected through one operating model.",
        titleClassName: "font-['Space_Grotesk'] text-xl font-semibold text-emerald-700",
        descriptionClassName: "mt-3 text-sm leading-6 text-slate-600",
      },
      {
        className: "rounded-2xl border border-lime-200 bg-lime-50 p-6",
        titleKey: "why_2_title",
        title: "Data that drives decisions",
        descriptionKey: "why_2_text",
        description: "Executive dashboards and automated weekly reporting provide fresher insight than manual spreadsheet cycles.",
        titleClassName: "font-['Space_Grotesk'] text-xl font-semibold text-emerald-700",
        descriptionClassName: "mt-3 text-sm leading-6 text-slate-600",
      },
    ],
    snapshot: [
      {
        className: "rounded-2xl border border-emerald-200 bg-emerald-50 p-6",
        titleKey: "snapshot_leadership_title",
        title: "Leadership and structure",
        descriptionKey: "snapshot_leadership_text",
        description: "CEO Thomas Harry leads TrackFlow, while Andrés Kim heads its technology team.",
        titleClassName: "font-['Space_Grotesk'] text-xl font-semibold text-emerald-700",
        descriptionClassName: "mt-3 text-sm leading-6 text-slate-600",
      },
      {
        className: "rounded-2xl border border-yellow-200 bg-yellow-50 p-6",
        titleKey: "snapshot_pain_title",
        title: "Current operational gaps",
        descriptionKey: "snapshot_pain_text",
        description: "Inventory is fragmented across warehouses, carrier operations are manual, and reporting is assembled by hand.",
        titleClassName: "font-['Space_Grotesk'] text-xl font-semibold text-emerald-700",
        descriptionClassName: "mt-3 text-sm leading-6 text-slate-600",
      },
    ],
  };

  const snapshotStats = [
    { labelKey: "snapshot_card_1_label", label: "Founded", valueKey: "snapshot_card_1_value", value: "2009" },
    { labelKey: "snapshot_card_2_label", label: "Annual revenue", valueKey: "snapshot_card_2_value", value: "~EUR 9M" },
    { labelKey: "snapshot_card_3_label", label: "Warehouse sites", valueKey: "snapshot_card_3_value", value: "2 sites" },
    { labelKey: "snapshot_card_4_label", label: "Team size", valueKey: "snapshot_card_4_value", value: "~130 people" },
  ];

  function createContentCard(cardData) {
    const card = document.createElement("article");
    card.className = cardData.className;

    if (cardData.eyebrowKey) {
      const eyebrow = document.createElement("p");
      eyebrow.dataset.i18n = cardData.eyebrowKey;
      eyebrow.className = cardData.eyebrowClassName;
      eyebrow.textContent = cardData.eyebrow;
      card.append(eyebrow);
    }

    const title = document.createElement("h3");
    title.dataset.i18n = cardData.titleKey;
    title.className = cardData.titleClassName;
    title.textContent = cardData.title;

    const description = document.createElement("p");
    description.dataset.i18n = cardData.descriptionKey;
    description.className = cardData.descriptionClassName;
    description.textContent = cardData.description;

    card.append(title, description);
    return card;
  }

  function createSnapshotStat(statData) {
    const card = document.createElement("article");
    card.className = "rounded-2xl border border-slate-200 bg-white p-5";

    const label = document.createElement("p");
    label.dataset.i18n = statData.labelKey;
    label.className = "text-xs uppercase tracking-[0.2em] text-slate-500";
    label.textContent = statData.label;

    const value = document.createElement("p");
    value.dataset.i18n = statData.valueKey;
    value.className = "mt-2 font-['Space_Grotesk'] text-2xl font-bold text-emerald-700";
    value.textContent = statData.value;

    card.append(label, value);
    return card;
  }

  function renderCards(containerId, cardData, createCard = createContentCard) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.replaceChildren(...cardData.map(createCard));
  }

  renderCards("featureCards", contentCards.features);
  renderCards("processSteps", contentCards.steps);
  renderCards("reasonCards", contentCards.reasons);
  renderCards("snapshotStats", snapshotStats, createSnapshotStat);
  renderCards("snapshotCards", contentCards.snapshot);
})();