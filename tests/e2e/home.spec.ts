import { test, expect } from '@playwright/test';

test('homeページが表示される', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Enterprise EC Demo');
  await expect(page.getByRole('main')).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Enterprise EC Demo',
      level: 1,
    })
  ).toBeVisible();
});
