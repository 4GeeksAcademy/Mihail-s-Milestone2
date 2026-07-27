const form = document.getElementById("applicationForm");
const successMessage = document.getElementById("successMessage");
const clearButton = document.getElementById("clearButton");

const validators = {
  client_id: (value) => {
    if (!value.trim()) return "Client ID is required.";
    if (!/^TF-CL-[0-9]{3,6}$/.test(value.trim())) {
      return "Client ID must match format TF-CL-### (3 to 6 digits).";
    }
    return "";
  },
  company_name: (value) => {
    if (!value.trim()) return "Legal company name is required.";
    if (value.trim().length < 2) return "Legal company name must be at least 2 characters.";
    return "";
  },
  tax_id: (value) => {
    if (!value.trim()) return "Tax ID / VAT is required.";
    if (!/^[A-Za-z0-9-]{8,20}$/.test(value.trim())) {
      return "Tax ID / VAT must be 8 to 20 characters using letters, numbers, or dashes.";
    }
    return "";
  },
  operating_country: (value) => {
    if (!value) return "Select at least one operating country scope.";
    return "";
  },
  preferred_warehouse: (value) => {
    if (!value) return "Select a preferred warehouse option.";
    return "";
  },
  contact_name: (value) => {
    if (!value.trim()) return "Primary contact full name is required.";
    if (value.trim().length < 3) return "Full name must be at least 3 characters.";
    return "";
  },
  contact_role: (value) => {
    if (!value.trim()) return "Contact role is required.";
    if (value.trim().length < 2) return "Contact role must be at least 2 characters.";
    return "";
  },
  business_email: (value) => {
    if (!value.trim()) return "Business email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) {
      return "Enter a valid business email address.";
    }
    return "";
  },
  phone_number: (value) => {
    if (!value.trim()) return "Phone number is required.";
    if (!/^\+?[0-9\s()-]{8,20}$/.test(value.trim())) {
      return "Phone number must contain 8 to 20 valid characters.";
    }
    return "";
  },
  monthly_orders: (value) => {
    if (!value) return "Monthly order volume is required.";
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return "Monthly order volume must be a number.";
    if (numericValue < 50 || numericValue > 500000) {
      return "Monthly order volume must be between 50 and 500000.";
    }
    return "";
  },
  avg_weight_kg: (value) => {
    if (!value) return "Average parcel weight is required.";
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return "Average parcel weight must be a number.";
    if (numericValue < 0.1 || numericValue > 50) {
      return "Average parcel weight must be between 0.1 and 50 kg.";
    }
    return "";
  },
  go_live_date: (value) => {
    if (!value) return "Target go-live date is required.";
    const inputDate = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (inputDate < today) return "Target go-live date must be today or later.";
    return "";
  },
  integration_type: (value) => {
    if (!value) return "Select your current storefront/ERP option.";
    return "";
  },
  project_notes: (value) => {
    if (!value.trim()) return "Project notes are required.";
    if (value.trim().length < 20) {
      return "Project notes must be at least 20 characters with relevant operational context.";
    }
    return "";
  }
};

function setError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}_error`);
  if (!field || !error) return;

  if (message) {
    field.setAttribute("aria-invalid", "true");
    error.textContent = message;
    error.classList.remove("hidden");
  } else {
    field.removeAttribute("aria-invalid");
    error.textContent = "";
    error.classList.add("hidden");
  }
}

function validateField(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field || !validators[fieldId]) return true;
  const message = validators[fieldId](field.value);
  setError(fieldId, message);
  return !message;
}

function setGroupedError(groupName, message) {
  const error = document.getElementById(`${groupName}_error`);
  if (!error) return;
  if (message) {
    error.textContent = message;
    error.classList.remove("hidden");
  } else {
    error.textContent = "";
    error.classList.add("hidden");
  }
}

function validateServicesNeeded() {
  const checked = document.querySelectorAll("input[name='services_needed']:checked").length;
  const message = checked > 0 ? "" : "Select at least one required service.";
  setGroupedError("services_needed", message);
  return !message;
}

function validateSlaPriority() {
  const selected = document.querySelector("input[name='sla_priority']:checked");
  const message = selected ? "" : "Choose an SLA priority option.";
  setGroupedError("sla_priority", message);
  return !message;
}

function clearAllMessages() {
  Object.keys(validators).forEach((fieldId) => setError(fieldId, ""));
  setGroupedError("services_needed", "");
  setGroupedError("sla_priority", "");
  successMessage.textContent = "";
  successMessage.classList.add("hidden");
}

function clearValidationState() {
  Object.keys(validators).forEach((fieldId) => setError(fieldId, ""));
  setGroupedError("services_needed", "");
  setGroupedError("sla_priority", "");
}

function validateForm() {
  let isValid = true;

  Object.keys(validators).forEach((fieldId) => {
    if (!validateField(fieldId)) isValid = false;
  });

  if (!validateServicesNeeded()) isValid = false;
  if (!validateSlaPriority()) isValid = false;

  return isValid;
}

if (form) {
  Object.keys(validators).forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.addEventListener("input", () => {
      validateField(fieldId);
      successMessage.classList.add("hidden");
    });

    field.addEventListener("blur", () => {
      validateField(fieldId);
    });
  });

  const serviceCheckboxes = document.querySelectorAll("input[name='services_needed']");
  serviceCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      validateServicesNeeded();
      successMessage.classList.add("hidden");
    });
  });

  const slaRadios = document.querySelectorAll("input[name='sla_priority']");
  slaRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      validateSlaPriority();
      successMessage.classList.add("hidden");
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    successMessage.classList.add("hidden");

    if (!validateForm()) {
      const firstInvalid = form.querySelector("[aria-invalid='true']");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    successMessage.textContent =
      "Application validated successfully. Submission simulated. Our onboarding team will contact you within one business day.";
    successMessage.classList.remove("hidden");
    form.reset();
    clearValidationState();
  });
}

if (clearButton) {
  clearButton.addEventListener("click", () => {
    clearAllMessages();
  });
}
