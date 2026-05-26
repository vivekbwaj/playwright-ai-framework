import { Page, Locator, expect } from '@playwright/test';
import { resilientFill } from '../utils/resilientLocator';
import { aiHeal } from '../utils/aiHealer';

export class TodoPage {
  readonly page: Page;

  // Locators
  readonly input: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;

  constructor(page: Page) {
    this.page = page;
    // Change this: this is actual locator
    this.input = page.getByPlaceholder('What needs to be done?');

    // To this (deliberately broken): We do this to test the AI healing functionality
    // this.input = page.getByPlaceholder('THIS WILL NOT MATCH ANYTHING');

    this.todoItems = page.locator('.todo-list li');
    this.todoCount = page.locator('.todo-count');
  }

  // Actions
  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

  async addTodo(text: string) {
    try {
      const workingLocator = await resilientFill(
        {
          description: 'todo input field',
          primary: this.input,
          fallbacks: [this.page.locator('.new-todo'), this.page.locator('input[type="text"]')],
        },
        text,
      );
      await this.page.keyboard.press('Enter');
    } catch {
      const result = await aiHeal(this.page, 'todo text input field');
      if (result.healed) {
        console.log(`[AI HEALER] Update your locator to: ${result.suggestedLocator}`);
      }
      throw new Error('addTodo failed — see AI healer suggestion above');
    }
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
