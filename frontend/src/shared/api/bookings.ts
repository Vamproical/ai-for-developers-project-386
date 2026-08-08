import { apiFetch } from './client';
import type {
  Booking,
  BookingList,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
} from './types';

interface ListBookingsParams {
  eventTypeId?: string;
  status?: 'confirmed' | 'cancelled';
  from?: string;
  to?: string;
}

export async function listBookings(
  params: ListBookingsParams = {},
): Promise<Booking[]> {
  const query = new URLSearchParams();
  if (params.eventTypeId) query.set('eventTypeId', params.eventTypeId);
  if (params.status) query.set('status', params.status);
  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);

  const queryString = query.toString();
  const result = await apiFetch<BookingList>(
    `/bookings${queryString ? `?${queryString}` : ''}`,
  );
  return result.items;
}

export async function createBooking(
  data: CreateBookingRequest,
): Promise<Booking> {
  return apiFetch<Booking>('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function cancelBooking(
  id: string,
): Promise<Booking> {
  return apiFetch<Booking>(`/bookings/${id}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'cancelled' } satisfies UpdateBookingStatusRequest),
  });
}
