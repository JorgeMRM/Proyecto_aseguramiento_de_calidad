import { test, expect } from '@playwright/test';

test('enlace Buggy Rating redirige a la página de inicio', async ({ page }) => {
  await page.goto('https://buggy.justtestit.org/model/c4u1mqnarscc72is00e0%7Cc4u1mqnarscc72is00kg');
  await page.getByRole('link', { name: 'Buggy Rating' }).click();
  await expect(page).toHaveURL('https://buggy.justtestit.org/');
});
