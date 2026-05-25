import { test, expect } from '@playwright/test';

test.describe('TodoMVC — core flows', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
  });

  test('should add a new todo item', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Write my first AI-assisted Playwright test');
    await input.press('Enter');
    await expect(page.getByText('Write my first AI-assisted Playwright test')).toBeVisible();
  });

  test('should mark a todo as completed', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Complete this todo');
    await input.press('Enter');
    await page.getByRole('checkbox').first().check();
    await expect(page.locator('.todo-list li').first()).toHaveClass(/completed/);
  });

  test('should delete a todo item', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Delete me');
    await input.press('Enter');
    await page.getByText('Delete me').hover();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText('Delete me')).not.toBeVisible();
  });

});