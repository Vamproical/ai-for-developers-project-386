const API_BASE_URL = process.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export interface ApiSeedEventType {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
}

export interface ApiSeedSchedule {
  id: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  slotDurationMinutes?: number;
}

export interface ApiSeedSlot {
  id: string;
  eventTypeId: string;
  startDateTime: string;
  endDateTime: string;
  status: string;
}

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

async function listEventTypes(): Promise<ApiSeedEventType[]> {
  const result = await apiRequest<{ items: ApiSeedEventType[] }>('/admin/event-types');
  return result.items;
}

async function listSchedules(): Promise<ApiSeedSchedule[]> {
  const result = await apiRequest<{ items: ApiSeedSchedule[] }>('/admin/schedules');
  return result.items;
}

async function listSlots(): Promise<ApiSeedSlot[]> {
  const result = await apiRequest<{ items: ApiSeedSlot[] }>('/admin/slots');
  return result.items;
}

export async function listBookings(): Promise<ApiSeedBooking[]> {
  const result = await apiRequest<{ items: ApiSeedBooking[] }>('/admin/bookings');
  return result.items;
}

async function deleteBooking(id: string): Promise<void> {
  await apiRequest(`/admin/bookings/${id}`, { method: 'DELETE' });
}

async function deleteSlot(id: string): Promise<void> {
  await apiRequest(`/admin/slots/${id}`, { method: 'DELETE' });
}

async function deleteSchedule(id: string): Promise<void> {
  await apiRequest(`/admin/schedules/${id}`, { method: 'DELETE' });
}

async function deleteEventType(id: string): Promise<void> {
  await apiRequest(`/admin/event-types/${id}`, { method: 'DELETE' });
}

export async function seedEventType(
  data: Omit<ApiSeedEventType, 'id'>,
): Promise<ApiSeedEventType> {
  return apiRequest<ApiSeedEventType>('/admin/event-types', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function seedSchedule(
  data: Omit<ApiSeedSchedule, 'id'>,
): Promise<ApiSeedSchedule> {
  return apiRequest<ApiSeedSchedule>('/admin/schedules', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function seedSlot(
  data: Omit<ApiSeedSlot, 'id'>,
): Promise<ApiSeedSlot> {
  return apiRequest<ApiSeedSlot>('/admin/slots', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function cleanupDb(): Promise<void> {
  // Bookings don have a DELETE endpoint, so we skip them for now
  // const bookings = await listBookings();
  // await Promise.all(bookings.map((b) => deleteBooking(b.id)));

  // Slots don't have a DELETE endpoint, so we skip them for now
  // const slots = await listSlots();
  // await Promise.all(slots.map((s) => deleteSlot(s.id)));

  // Schedules don't have a DELETE endpoint, so we skip them for now
  // const schedules = await listSchedules();
  // await Promise.all(schedules.map((s) => deleteSchedule(s.id)));

  const eventTypes = await listEventTypes();
  await Promise.all(eventTypes.map((et) => deleteEventType(et.id)));
}
