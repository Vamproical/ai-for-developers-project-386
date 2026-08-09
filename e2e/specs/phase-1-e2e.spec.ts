import { test, expect } from '../fixtures/base-fixtures';
import { AdminEventTypesPage } from '../pages/admin-event-types.page';
import { AdminSchedulesPage } from '../pages/admin-schedules.page';
import { GuestPage } from '../pages/guest.page';
import { AdminBookingsPage } from '../pages/admin-bookings.page';
import { listBookings, cleanupDb, seedEventType, seedSchedule } from '../fixtures/api-seed';

import dayjs from 'dayjs';

test.describe('Full booking flow E2E', () => {
  test('admin creates resources, guest books, admin verifies and filters', async ({ page }) => {
    const adminEventTypesPage = new AdminEventTypesPage(page);
    const adminSchedulesPage = new AdminSchedulesPage(page);
    const guestPage = new GuestPage(page);
    const adminBookingsPage = new AdminBookingsPage(page);

    const today = dayjs();
    const nextWeek = today.add(7, 'day');
    const startDate = nextWeek.format('YYYY-MM-DD');
    const endDate = nextWeek.add(5, 'day').format('YYYY-MM-DD');

    const eventTypeName = '30-min Meeting';
    const eventDescription = 'A quick 30-minute meeting';
    const guestName = 'Test User';
    const guestEmail = 'test-user@example.com';

    let eventTypeId: string;
    let scheduleId: string;

    await test.step('Admin creates EventType via API', async () => {
      const eventType = await seedEventType({
        name: eventTypeName,
        description: eventDescription,
        durationMinutes: 30,
      });
      eventTypeId = eventType.id;
      
      // Verify via API
      const apiCheck = await fetch('http://localhost:8080/event-types').then(r => r.json());
      expect(apiCheck.items.length).toBe(1);
      expect(apiCheck.items[0].name).toBe(eventTypeName);
    });

    await test.step('Admin creates Schedule via API', async () => {
      const schedule = await seedSchedule({
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: '09:00',
        endTime: '17:00',
        startDate: `${startDate}T00:00:00Z`,
        endDate: `${endDate}T23:59:59Z`,
        slotDurationMinutes: 30,
      });
      scheduleId = schedule.id;
      
      // Verify via API
      const apiCheck = await fetch('http://localhost:8080/admin/schedules').then(r => r.json());
      expect(apiCheck.items.length).toBeGreaterThanOrEqual(1);
    });

    await test.step('Guest browses slots and selects one', async () => {
      await guestPage.gotoAndWaitForLoad();

      const slots = await guestPage.getAvailableSlots();
      expect(slots.length).toBeGreaterThan(0);

      await guestPage.selectSlot(0);
    });

    await test.step('Guest selects EventType and fills details', async () => {
      await guestPage.selectEventType(eventTypeName);
      await guestPage.fillGuestDetails(guestName, guestEmail);
      await guestPage.submitBooking();
    });

    await test.step('Guest sees BookingConfirmation', async () => {
      const confirmation = await guestPage.getConfirmation();
      expect(confirmation).not.toBeNull();
      expect(confirmation!.eventName).toContain('30 min');
      expect(confirmation!.guestName).toContain(guestName);
      expect(confirmation!.guestEmail).toContain(guestEmail);
    });

    await test.step('Admin views bookings', async () => {
      await adminBookingsPage.gotoAndWaitForLoad();

      const bookings = await adminBookingsPage.getBookings();
      expect(bookings.length).toBeGreaterThan(0);
      expect(bookings.some((b) => b.guest === guestName)).toBe(true);
    });

    await test.step('Admin filters by EventType', async () => {
      await adminBookingsPage.filterByEventType(eventTypeName);

      const filteredByEventType = await adminBookingsPage.getFilteredBookings();
      expect(filteredByEventType.length).toBeGreaterThan(0);
      expect(filteredByEventType.every((b) => b.eventType === eventTypeName)).toBe(true);
    });

    await test.step('Admin filters by Status', async () => {
      await adminBookingsPage.filterByStatus('confirmed');

      const filteredByStatus = await adminBookingsPage.getFilteredBookings();
      expect(filteredByStatus.length).toBeGreaterThan(0);
      expect(filteredByStatus.every((b) => b.status === 'confirmed')).toBe(true);
    });

    await test.step('Verify booking via API', async () => {
      const apiBookings = await listBookings();
      expect(apiBookings.length).toBeGreaterThan(0);

      const booking = apiBookings.find((b) => b.guestName === guestName && b.guestEmail === guestEmail);
      expect(booking).toBeDefined();
      expect(booking!.status).toBe('confirmed');
      expect(booking!.guestName).toBe(guestName);
      expect(booking!.guestEmail).toBe(guestEmail);
    });
  });
});
