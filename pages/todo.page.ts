import { Page, Locator, expect } from '@playwright/test';

export class TodoPage {
  readonly page: Page;

  // Locators
  readonly input: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.locator('.todo-list li');
    this.todoCount = page.locator('.todo-count');
  }

  // Actions
  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

  async addTodo(text: string) {
    await this.input.fill(text);
    await this.input.press('Enter');
  }

  async completeTodo(index: number) {
    await this.todoItems.nth(index).getByRole('checkbox').check();
  }

  async deleteTodo(text: string) {
    const item = this.todoItems.filter({ hasText: text });
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
  }

  // Assertions
  async expectTodoVisible(text: string) {
    await expect(this.todoItems.filter({ hasText: text })).toBeVisible();
  }

  async expectTodoNotVisible(text: string) {
    await expect(this.todoItems.filter({ hasText: text })).not.toBeVisible();
  }

  async expectTodoCompleted(index: number) {
    await expect(this.todoItems.nth(index)).toHaveClass(/completed/);
  }

  async expectCount(count: number) {
    await expect(this.todoCount).toContainText(`${count}`);
  }
}