import { test, expect } from '@playwright/test';
import { TodoPage } from '../../pages/todo.page';

test.describe('TodoMVC — Basic Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
  });

  test('Add single todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await page.fill('input[placeholder="What needs to be done?"]', 'Buy groceries');
    await page.keyboard.press('Enter');
    await expect(todoPage.todoItems.filter({ hasText: 'Buy groceries' })).toBeVisible();
    await expect(todoPage.todoCount).toContainText('1');
  });

  test('Add multiple todos', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const items = ['Task 1', 'Task 2', 'Task 3'];
    for (const t of items) {
      await page.fill('input[placeholder="What needs to be done?"]', t);
      await page.keyboard.press('Enter');
    }
    for (const t of items) {
      await expect(todoPage.todoItems.filter({ hasText: t })).toBeVisible();
    }
    await expect(todoPage.todoCount).toContainText('3');
  });

  test('Complete todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await page.fill('input[placeholder="What needs to be done?"]', 'Complete report');
    await page.keyboard.press('Enter');
    await todoPage.todoItems.nth(0).getByRole('checkbox').check();
    await expect(todoPage.todoItems.nth(0)).toHaveClass(/completed/);
  });

  test('Delete todo', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await page.fill('input[placeholder="What needs to be done?"]', 'Review PR');
    await page.keyboard.press('Enter');
    const item = todoPage.todoItems.filter({ hasText: 'Review PR' });
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
    await expect(item).not.toBeVisible();
  });

  test('Filter active/completed and persistence', async ({ page }) => {
    const todoPage = new TodoPage(page);
    // add two todos
    await page.fill('input[placeholder="What needs to be done?"]', 'One');
    await page.keyboard.press('Enter');
    await page.fill('input[placeholder="What needs to be done?"]', 'Two');
    await page.keyboard.press('Enter');
    // complete first
    await todoPage.todoItems.nth(0).getByRole('checkbox').check();
    // filter Active
    await page.getByRole('link', { name: 'Active' }).click();
    await expect(todoPage.todoItems).toHaveCount(1);
    // filter Completed
    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(todoPage.todoItems).toHaveCount(1);
    // persistence after reload
    await page.reload();
    await expect(todoPage.todoItems.filter({ hasText: 'One' })).toBeVisible();
    await expect(todoPage.todoItems.filter({ hasText: 'Two' })).toBeVisible();
  });
});
