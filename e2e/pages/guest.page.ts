import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class GuestPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async getAvailableSlots(): Promise<string[]> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000); // Wait for React Query to fetch

    // Debug: check if there are any buttons at all
    const allButtons = await this.page.getByRole('button').all();
    console.log(`Total buttons on page: ${allButtons.length}`);

    const slots = await this.page.getByRole('button', { name: /\d{2}:\d{2}/ }).all();
    console.log(`Slot buttons found: ${slots.length}`);
    
    return Promise.all(slots.map((slot) => slot.innerText()));
  }

  async selectSlot(slotIndex: number = 0): Promise<void> {
    const slots = await this.page.getByRole('button', { name: /\d{2}:\d{2}/ }).all();
    await slots[slotIndex].click();

    await this.page.getByText('Select Event Type').waitFor({ state: 'visible' });
  }

  async selectEventType(eventTypeName: string): Promise<void> {
    // EventTypeSelection uses Card components containing the event type name
    // Find and click on the card with the event type name
    await this.page.getByText(eventTypeName).first().click();

    await this.page.getByLabel('Name').waitFor({ state: 'visible', timeout: 10000 });
  }

  async fillGuestDetails(name: string, email: string): Promise<void> {
    await this.page.getByLabel('Name').fill(name);
    await this.page.getByLabel('Email').fill(email);
  }

  async submitBooking(): Promise<void> {
    await this.page.getByRole('button', { name: 'Confirm Booking' }).click();

    await this.page.getByText('Booking Confirmed', { exact: true }).waitFor({ state: 'visible' });
  }

  async getConfirmation(): Promise<{
    eventName: string;
    guestName: string;
    guestEmail: string;
  } | null> {
    const confirmed = await this.page.getByText('Booking Confirmed', { exact: true }).isVisible();
    if (!confirmed) {
      return null;
    }

    // BookingConfirmation shows details in a Card with label-value pairs
    const eventName = await this.page.getByText(/Event Type/).locator('..').getByText(/\w+/).last().innerText();
    const guestName = await this.page.getByText(/^Name$/).locator('..').getByText(/.+/).last().innerText();
    const guestEmail = await this.page.getByText(/^Email$/).locator('..').getByText(/.+/).last().innerText();

    return { eventName, guestName, guestEmail };
  }
}
