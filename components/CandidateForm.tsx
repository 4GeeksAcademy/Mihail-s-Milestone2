"use client";

import { FormEvent, useState } from "react";
import { candidateName, candidatePosition } from "../lib/candidates";
import { Candidate, CandidatePayload } from "../types/candidates";

interface CandidateFormProps {
  candidate?: Candidate;
  submitLabel: string;
  busyLabel: string;
  onSubmit: (payload: CandidatePayload) => Promise<void>;
}

interface CandidateFormValues {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  experience_years: string;
  linkedin_url: string;
  cv_url: string;
}

type CandidateFormErrors = Partial<Record<keyof CandidateFormValues, string>>;

export default function CandidateForm({ candidate, submitLabel, busyLabel, onSubmit }: CandidateFormProps) {
  const [values, setValues] = useState<CandidateFormValues>(() => ({
    full_name: candidate ? candidateName(candidate) : "",
    email: candidate?.email || "",
    phone: candidate?.phone || "",
    position: candidate ? candidatePosition(candidate) : "",
    experience_years: candidate?.experience_years === undefined ? "" : String(candidate.experience_years),
    linkedin_url: candidate?.linkedin_url || "",
    cv_url: candidate?.cv_url || "",
  }));
  const [errors, setErrors] = useState<CandidateFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateValue(name: keyof CandidateFormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        full_name: values.full_name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        position: values.position.trim(),
        experience_years: Number(values.experience_years),
        linkedin_url: values.linkedin_url.trim() || null,
        cv_url: values.cv_url.trim() || null,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="candidate-form" onSubmit={handleSubmit} noValidate>
      <FormField label="Full name" name="full_name" value={values.full_name} error={errors.full_name} required onChange={updateValue} />
      <FormField label="Email" name="email" type="email" value={values.email} error={errors.email} required onChange={updateValue} />
      <FormField label="Phone" name="phone" value={values.phone} error={errors.phone} required onChange={updateValue} />
      <FormField label="Position" name="position" value={values.position} error={errors.position} required onChange={updateValue} />
      <FormField
        label="Years of experience"
        name="experience_years"
        type="number"
        min="0"
        value={values.experience_years}
        error={errors.experience_years}
        required
        onChange={updateValue}
      />
      <FormField label="LinkedIn" name="linkedin_url" type="url" value={values.linkedin_url} error={errors.linkedin_url} onChange={updateValue} />
      <FormField label="CV link" name="cv_url" type="url" value={values.cv_url} error={errors.cv_url} onChange={updateValue} />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? busyLabel : submitLabel}
      </button>
    </form>
  );
}

function FormField({
  label,
  name,
  value,
  error,
  onChange,
  required = false,
  type = "text",
  min,
}: {
  label: string;
  name: keyof CandidateFormValues;
  value: string;
  error?: string;
  onChange: (name: keyof CandidateFormValues, value: string) => void;
  required?: boolean;
  type?: string;
  min?: string;
}) {
  return (
    <label>
      <span>{label}</span>
      <input
        name={name}
        type={type}
        min={min}
        value={value}
        required={required}
        aria-invalid={error ? "true" : undefined}
        onChange={(event) => onChange(name, event.target.value)}
      />
      {error ? <strong>{error}</strong> : null}
    </label>
  );
}

function validate(values: CandidateFormValues): CandidateFormErrors {
  const errors: CandidateFormErrors = {};
  if (!values.full_name.trim()) errors.full_name = "Full name is required.";
  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (!values.phone.trim()) errors.phone = "Phone is required.";
  if (!values.position.trim()) errors.position = "Position is required.";

  const years = Number(values.experience_years);
  if (!values.experience_years.trim()) errors.experience_years = "Years of experience is required.";
  else if (!Number.isFinite(years) || years < 0) errors.experience_years = "Enter a number of 0 or more.";

  if (values.linkedin_url.trim() && !isValidHttpUrl(values.linkedin_url)) errors.linkedin_url = "Enter a valid http(s) URL.";
  if (values.cv_url.trim() && !isValidHttpUrl(values.cv_url)) errors.cv_url = "Enter a valid http(s) URL.";
  return errors;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}