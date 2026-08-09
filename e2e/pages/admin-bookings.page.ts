import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AdminBookingsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin/bookings');
  }

  async getBookings(): Promise<Array<{ guest: string; email: string; eventType: string; status: string }>> {
    await this.page.waitForLoadState('networkidle');

    const rows = await this.page.locator('tbody tr').all();

    const result: Array<{ guest: string; email: string; eventType: string; status: string }> = [];

    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length >= 5) {
        result.push({
          guest: await cells[0].textContent() || '',
          email: await cells[1].textContent() || '',
          eventType: await cells[2].textContent() || '',
          status: await cells[4].textContent() || '',
        });
      }
    }

    return result;
  }

  async filterByEventType(eventTypeName: string): Promise<void> {
    await this.page.getByLabel('Event type').click();
    await this.page.getByRole('option', { name: eventTypeName }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterByStatus(status: string): Promise<void> {
    await this.page.getByLabel('Status').click();
    await this.page.getByRole('option', { name: status.charAt(0).toUpperCase() + status.slice(1) }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async getFilteredBookings(): Promise<Array<{ guest: string; email: string; eventType: string; status: string }>> {
    return this.getBookings();
  }
}
