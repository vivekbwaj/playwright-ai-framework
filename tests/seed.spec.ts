import { test } from '@playwright/test';

test('seed', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
});
