import { test, expect } from '@playwright/test'

test('home page shows site title', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('text=Enterprise EC Demo')).toBeVisible()
})
