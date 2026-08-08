import { create } from 'zustand';
import type { Slot, EventType, Booking } from '@/shared/api/types';

interface BookingState {
  selectedSlot: Slot | null;
  selectedEventType: EventType | null;
  createdBooking: Booking | null;
  step: number;
  setSelectedSlot: (slot: Slot) => void;
  setSelectedEventType: (eventType: EventType) => void;
  setCreatedBooking: (booking: Booking) => void;
  nextStep: () => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedSlot: null,
  selectedEventType: null,
  createdBooking: null,
  step: 0,
  setSelectedSlot: (slot: Slot) =>
    set({ selectedSlot: slot, step: 1 }),
  setSelectedEventType: (eventType: EventType) =>
    set({ selectedEventType: eventType, step: 2 }),
  setCreatedBooking: (booking: Booking) =>
    set({ createdBooking: booking, step: 3 }),
  nextStep: () =>
    set((state) => ({ step: state.step + 1 })),
  reset: () =>
    set({
      selectedSlot: null,
      selectedEventType: null,
      createdBooking: null,
      step: 0,
    }),
}));
