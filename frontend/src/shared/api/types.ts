export interface Owner {
  id: string;
  name: string;
  email: string;
}

export interface EventType {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
}

export interface Slot {
  id: string;
  eventTypeId: string;
  startDateTime: string;
  endDateTime: string;
  status: 'available' | 'booked' | 'blocked';
}

export interface Booking {
  id: string;
  slotId: string;
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  comment?: string;
  createdAt: string;
  status: 'confirmed' | 'cancelled';
}

export interface Schedule {
  id: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  slotDurationMinutes?: number;
}

export interface CreateEventTypeRequest {
  name: string;
  description: string;
  durationMinutes: number;
}

export interface UpdateEventTypeRequest {
  name?: string;
  description?: string;
  durationMinutes?: number;
}

export interface CreateSlotRequest {
  eventTypeId: string;
  startDateTime: string;
  endDateTime: string;
}

export interface CreateScheduleRequest {
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  slotDurationMinutes?: number;
}

export interface CreateBookingRequest {
  slotId: string;
  eventTypeId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  comment?: string;
}

export interface UpdateBookingStatusRequest {
  status: 'confirmed' | 'cancelled';
}

export interface EventTypeList {
  items: EventType[];
}

export interface SlotList {
  items: Slot[];
}

export interface BookingList {
  items: Booking[];
}

export interface ScheduleList {
  items: Schedule[];
}

export interface ApiError {
  code: number;
  message: string;
}
