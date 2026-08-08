const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4010';

export interface ApiErrorData {
  code: number;
  message: string;
}

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!response.ok) {
    const error = await response.json().catch((): ApiErrorData => ({
      code: response.status,
      message: response.statusText,
    }));
    throw new ApiRequestError(error.message || 'Unknown error', response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
