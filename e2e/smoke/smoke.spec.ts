import { test, expect } from '../fixtures/base-fixtures';

test.describe('Smoke tests', () => {
  test('guest page shows Booking Calendar title', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Booking Calendar' }),
    ).toBeVisible();
  });

  test('admin page shows Booking Calendar — Admin title', async ({ page }) => {
    await page.goto('/admin');
    await expect(
      page.getByText('Booking Calendar — Admin'),
    ).toBeVisible();
  });
});
