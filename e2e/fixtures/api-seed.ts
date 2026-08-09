const API_BASE_URL = process.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export interface ApiSeedBooking {
  id: string;
  slotId: string;
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  comment?: string;
  createdAt: string;
  status: string;
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `API request failed: ${response.status} ${response.statusText} ${path} — ${errorText}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function listBookings(): Promise<ApiSeedBooking[]> {
  const result = await apiRequest<{ items: ApiSeedBooking[] }>('/admin/bookings');
  return result.items;
}

export async function cleanupDb(): Promise<void> {
  await apiRequest('/e2e/cleanup', { method: 'POST' });
}
