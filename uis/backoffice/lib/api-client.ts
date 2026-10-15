export const API_BASE_URL = (process.env.NEXT_PUBLIC_INVENTORY_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

function errorMessage(body: unknown, statusText: string): string {
  if (typeof body === "string" && body.trim()) return body;
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const detail = record.detail ?? record.message ?? record.error;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((item) => {
        if (item && typeof item === "object" && "msg" in item) return String(item.msg);
        return String(item);
      }).join(" ");
    }
  }
  return statusText || "The request failed. Please try again.";
}

export async function apiRequest<T>(
  path: string,
  options: { method?: "GET" | "POST"; token?: string | null; body?: unknown } = {},
): Promise<T> {
  const headers = new Headers({ Accept: "application/json" });
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  if (options.token) headers.set("Authorization", `Bearer ${options.token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError("Cannot reach the inventory service. Check that the API is running.", 0);
  }

  const responseBody: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && options.token && typeof window !== "undefined") {
      window.localStorage.removeItem("trackflow-access-token");
      window.localStorage.removeItem("trackflow-auth-user");
      if (window.location.pathname.startsWith("/backoffice/inventory/")) {
        window.location.replace(`/backoffice/login?next=${encodeURIComponent(window.location.pathname)}`);
      }
    }
    throw new ApiError(errorMessage(responseBody, response.statusText), response.status);
  }
  return responseBody as T;
}