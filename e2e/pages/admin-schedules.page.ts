import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AdminSchedulesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin/schedules');
  }

  async createSchedule(
    daysOfWeek: string[],
    startTime: string,
    endTime: string,
    startDate: string,
    endDate: string,
    slotDuration?: number,
  ): Promise<void> {
    await this.page.getByRole('button', { name: 'Create Schedule' }).click();

    const modal = this.page.getByRole('dialog');
    await modal.waitFor({ state: 'visible' });

    for (const day of daysOfWeek) {
      await this.page.getByLabel(day).check();
    }

    await this.page.getByLabel('Start time').fill(startTime);
    await this.page.getByLabel('End time').fill(endTime);
    await this.page.getByLabel('Start date').fill(startDate);
    await this.page.getByLabel('End date').fill(endDate);

    if (slotDuration !== undefined) {
      await this.page.getByLabel('Slot duration (minutes, optional)').fill(String(slotDuration));
    }

    await Promise.all([
      this.page.waitForResponse(resp => resp.url().includes('/schedules') && resp.status() === 200),
      this.page.getByRole('button', { name: 'Create', exact: true }).click(),
    ]);

    await modal.waitFor({ state: 'hidden' });
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }

  async getSchedules(): Promise<Array<{ days: string; time: string; dateRange: string; slotDuration: string }>> {
    const rows = await this.page.locator('tbody tr').all();

    const result: Array<{ days: string; time: string; dateRange: string; slotDuration: string }> = [];

    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length >= 4) {
        result.push({
          days: await cells[0].textContent() || '',
          time: await cells[1].textContent() || '',
          dateRange: await cells[2].textContent() || '',
          slotDuration: await cells[3].textContent() || '',
        });
      }
    }

    return result;
  }
}
