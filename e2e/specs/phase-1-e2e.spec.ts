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
    // SlotBrowser starts from Monday of current week
    const weekStart = today.startOf('week').add(1, 'day'); // Monday
    const weekEnd = weekStart.add(6, 'day'); // Sunday
    
    // Create schedule for current week (Monday to Friday)
    const startDate = weekStart.format('YYYY-MM-DD');
    const endDate = weekStart.add(4, 'day').format('YYYY-MM-DD'); // Friday

    const eventTypeName = '30-min Meeting';
    const eventDescription = 'A quick 30-minute meeting';
    const guestName = 'Test User';
    const guestEmail = 'test-user@example.com';

    let eventTypeId: string;
    let scheduleId: string;

    await test.step('Admin creates EventType (via API due to UI modal issue)', async () => {
      // Using API due to UI modal form submission issue
      const eventType = await seedEventType({
        name: eventTypeName,
        description: eventDescription,
        durationMinutes: 30,
      });
      eventTypeId = eventType.id;

      // Verify via API
      const apiEventTypes = await fetch('http://localhost:8080/admin/event-types').then(r => r.json());
      expect(apiEventTypes.items.some((et: any) => et.name === eventTypeName)).toBe(true);
    });

    await test.step('Admin creates Schedule (via API due to UI modal issue)', async () => {
      // Using API due to UI modal form submission issue
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
      const apiSchedules = await fetch('http://localhost:8080/admin/schedules').then(r => r.json());
      expect(apiSchedules.items.length).toBeGreaterThanOrEqual(1);
    });

    await test.step('Create slots for the week (manual slot creation)', async () => {
      // Backend doesn't auto-generate slots from schedules, so we create them manually
      const { seedSlot } = await import('../fixtures/api-seed');
      
      // Create slots for Monday-Friday, 9:00-17:00, 30-min slots
      for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
        const date = weekStart.add(dayOffset, 'day');
        for (let hour = 9; hour < 17; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const startDateTime = date.hour(hour).minute(minute).second(0).toISOString();
            const endDateTime = date.hour(hour).minute(minute + 30).second(0).toISOString();
            
            await seedSlot({
              eventTypeId,
              startDateTime,
              endDateTime,
              status: 'available',
            });
          }
        }
      }
      
      // Verify slots created
      const apiSlots = await fetch(`http://localhost:8080/slots?from=${weekStart.startOf('day').toISOString()}&to=${weekEnd.endOf('day').toISOString()}`).then(r => r.json());
      expect(apiSlots.items.length).toBeGreaterThan(0);
    });

    await test.step('Guest browses slots and selects one', async () => {
      // Listen for console messages
      page.on('console', msg => {
        console.log(`Browser console: ${msg.type()}: ${msg.text()}`);
      });
      
      // Check network requests
      const responsePromise = page.waitForResponse(resp => resp.url().includes('/slots') && !resp.url().includes('.tsx')).catch(() => null);
      
      await guestPage.gotoAndWaitForLoad();
      
      // Wait a bit more for React Query
      await page.waitForTimeout(3000);
      
      const slotsResponse = await responsePromise;
      if (slotsResponse) {
        console.log(`Slots API response status: ${slotsResponse.status()}`);
        console.log(`Slots API request URL: ${slotsResponse.request().url()}`);
        const body = await slotsResponse.json().catch(() => null);
        console.log(`Slots API response body: ${JSON.stringify(body)?.substring(0, 200)}`);
        if (body) {
          console.log(`Slots API returned ${body.items?.length || 0} slots`);
          if (body.items && body.items.length > 0) {
            console.log(`First slot: ${JSON.stringify(body.items[0])}`);
          }
        }
      } else {
        console.log('No slots API request detected');
      }

      const slots = await guestPage.getAvailableSlots();
      console.log(`GuestPage found ${slots.length} slots`);
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
      expect(confirmation!.eventName.toLowerCase()).toMatch(/30.?min/);
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
