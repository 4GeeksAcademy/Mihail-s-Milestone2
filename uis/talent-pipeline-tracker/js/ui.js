/* Talent Pipeline Tracker — presentation helpers shared by the app. */
(function (global) {
  "use strict";

  const STATUS_BADGES = {
    received: "bg-sky-100 text-sky-800 ring-sky-200",
    in_progress: "bg-amber-100 text-amber-800 ring-amber-200",
    selected: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    discarded: "bg-rose-100 text-rose-800 ring-rose-200"
  };

  const STAGE_BADGE = "bg-slate-100 text-slate-700 ring-slate-200";

  function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Only http(s) links are rendered, so a malicious cv_url can't inject javascript:.
  function safeUrl(value) {
    if (!value) return null;
    try {
      const url = new URL(String(value), global.location.href);
      return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
    } catch (error) {
      return null;
    }
  }

  function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function formatDateTime(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function statusBadge(status) {
    const tone = STATUS_BADGES[status] || STAGE_BADGE;
    return `<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tone}">${escapeHtml(
      global.TrackerApi.statusLabel(status)
    )}</span>`;
  }

  function stageBadge(stage) {
    return `<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STAGE_BADGE}">${escapeHtml(
      global.TrackerApi.stageLabel(stage)
    )}</span>`;
  }

  function skeletonRows(count) {
    let html = "";
    for (let i = 0; i < count; i += 1) {
      html +=
        '<li class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">' +
        '<div class="skeleton h-4 w-1/3 rounded"></div>' +
        '<div class="skeleton mt-3 h-3 w-1/2 rounded"></div>' +
        '<div class="skeleton mt-3 h-3 w-1/4 rounded"></div>' +
        "</li>";
    }
    return html;
  }

  function fillSelect(select, options, placeholder) {
    const parts = placeholder ? [`<option value="">${escapeHtml(placeholder)}</option>`] : [];
    options.forEach((option) => {
      parts.push(`<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`);
    });
    select.innerHTML = parts.join("");
  }

  const TOAST_TONES = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-red-200 bg-red-50 text-red-900",
    info: "border-slate-200 bg-white text-slate-800"
  };

  function toast(message, tone) {
    const region = document.getElementById("toastRegion");
    if (!region) return;
    const item = document.createElement("div");
    item.className = `rounded-lg border px-4 py-3 text-sm shadow-lg ${TOAST_TONES[tone] || TOAST_TONES.info}`;
    item.setAttribute("role", tone === "error" ? "alert" : "status");
    item.textContent = message;
    region.appendChild(item);
    setTimeout(() => item.remove(), tone === "error" ? 6000 : 3500);
  }

  function debounce(fn, wait) {
    let timer = null;
    return function debounced() {
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(null, args), wait);
    };
  }

  global.TrackerUI = {
    escapeHtml,
    safeUrl,
    formatDate,
    formatDateTime,
    statusBadge,
    stageBadge,
    skeletonRows,
    fillSelect,
    toast,
    debounce
  };
})(window);
