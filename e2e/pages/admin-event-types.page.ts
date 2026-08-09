import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AdminEventTypesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/admin/event-types');
  }

  async createEventType(
    name: string,
    description: string,
    duration: number,
  ): Promise<void> {
    await this.page.getByRole('button', { name: 'Create Event Type' }).click();

    const modal = this.page.getByRole('dialog');
    await modal.waitFor({ state: 'visible' });

    await this.page.getByLabel('Name').fill(name);
    await this.page.getByLabel('Description').fill(description);
    
    // For NumberInput, fill by label
    await this.page.getByLabel('Duration (minutes)').fill(String(duration));

    // Wait for the API response when submitting
    const responsePromise = this.page.waitForResponse(
      resp => resp.url().includes('event-types') && resp.request().method() === 'POST',
      { timeout: 15000 }
    ).catch(() => {
      console.log('No POST response captured for event-types');
      return null;
    });
    
    await this.page.getByRole('button', { name: 'Create', exact: true }).click();
    await responsePromise;

    await modal.waitFor({ state: 'hidden' });
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async getEventTypes(): Promise<Array<{ name: string; description: string; duration: string }>> {
    // Debug: print page structure
    const tableExists = await this.page.locator('table').count() > 0;
    console.log('Table exists:', tableExists);
    
    const tbodyExists = await this.page.locator('tbody').count() > 0;
    console.log('Tbody exists:', tbodyExists);
    
    const trCount = await this.page.locator('table tbody tr').count();
    console.log('TR count:', trCount);
    
    // Wait for the table body to have rows
    await this.page.locator('table tbody tr').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      console.log('No table rows found, proceeding anyway');
    });

    const rows = await this.page.locator('table tbody tr').all();

    const result: Array<{ name: string; description: string; duration: string }> = [];

    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length >= 3) {
        result.push({
          name: await cells[0].textContent() || '',
          description: await cells[1].textContent() || '',
          duration: await cells[2].textContent() || '',
        });
      }
    }

    console.log(`Found ${result.length} event type rows`);
    return result;
  }
}
