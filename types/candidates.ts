export const CANDIDATE_STATUSES = [
  { value: "received", label: "Received" },
  { value: "in_progress", label: "In progress" },
  { value: "selected", label: "Selected" },
  { value: "discarded", label: "Discarded" },
] as const;

export const CANDIDATE_STAGES = [
  { value: "pending", label: "Pending" },
  { value: "review", label: "Review" },
  { value: "personal_interview", label: "Personal interview" },
  { value: "technical_interview", label: "Technical interview" },
  { value: "offer_presented", label: "Offer presented" },
] as const;

export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number]["value"];

export type CandidateStage = (typeof CANDIDATE_STAGES)[number]["value"];

export interface Candidate {
  id: string | number;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  position?: string;
  position_applied_for?: string;
  role?: string;
  linkedin_url?: string;
  cv_url?: string;
  experience_years?: number;
  status?: CandidateStatus | string;
  stage?: CandidateStage | string;
  applied_at?: string;
  created_at?: string;
  updated_at?: string;
  notes_count?: number;
  source?: string;
  [key: string]: unknown;
}

export interface CandidateListResponse {
  data?: Candidate[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface CandidateFilters {
  status?: string;
  stage?: string;
  search?: string;
}

export interface CandidatePayload {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  experience_years: number;
  linkedin_url: string | null;
  cv_url: string | null;
}

export interface CandidateNote {
  id: string | number;
  content?: string;
  body?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CandidateNotesResponse {
  data?: CandidateNote[];
  total?: number;
}