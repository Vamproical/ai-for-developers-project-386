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

    const slots = await this.page.getByRole('button', { name: /\d{2}:\d{2}/ }).all();
    return Promise.all(slots.map((slot) => slot.innerText()));
  }

  async selectSlot(slotIndex: number = 0): Promise<void> {
    const slots = await this.page.getByRole('button', { name: /\d{2}:\d{2}/ }).all();
    await slots[slotIndex].click();

    await this.page.getByText('Select Event Type').waitFor({ state: 'visible' });
  }

  async selectEventType(eventTypeName: string): Promise<void> {
    await this.page
      .getByRole('button')
      .filter({ hasText: eventTypeName })
      .first()
      .click();

    await this.page.getByLabel('Name').waitFor({ state: 'visible' });
  }

  async fillGuestDetails(name: string, email: string): Promise<void> {
    await this.page.getByLabel('Name').fill(name);
    await this.page.getByLabel('Email').fill(email);
  }

  async submitBooking(): Promise<void> {
    await this.page.getByRole('button', { name: 'Confirm Booking' }).click();

    await this.page.getByText('Booking Confirmed').waitFor({ state: 'visible' });
  }

  async getConfirmation(): Promise<{
    eventName: string;
    guestName: string;
    guestEmail: string;
  } | null> {
    const confirmed = await this.page.getByText('Booking Confirmed').isVisible();
    if (!confirmed) {
      return null;
    }

    const eventName = await this.page.getByRole('group').getByText(/\d+ min/).first().innerText();
    const guestName = await this.page.getByText(/Name/).locator('..').getByText(/.+/).last().innerText();
    const guestEmail = await this.page.getByText(/Email/).locator('..').getByText(/.+/).last().innerText();

    return { eventName, guestName, guestEmail };
  }
}
