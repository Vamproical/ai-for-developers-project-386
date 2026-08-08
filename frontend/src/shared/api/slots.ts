import { apiFetch } from './client';
import type { Slot, SlotList, CreateSlotRequest } from './types';

interface ListSlotsParams {
  eventTypeId?: string;
  from?: string;
  to?: string;
}

export async function listSlots(params: ListSlotsParams = {}): Promise<Slot[]> {
  const query = new URLSearchParams();
  if (params.eventTypeId) query.set('eventTypeId', params.eventTypeId);
  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);

  const queryString = query.toString();
  const result = await apiFetch<SlotList>(
    `/slots${queryString ? `?${queryString}` : ''}`,
  );
  return result.items;
}

export async function createSlot(data: CreateSlotRequest): Promise<Slot> {
  return apiFetch<Slot>('/slots', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
