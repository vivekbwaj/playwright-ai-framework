import { test } from '@playwright/test';
import { TodoPage } from '../../pages/todo.page';

test.describe('TodoMVC — core flows', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('should add a new todo item', async () => {
    await todoPage.addTodo('Write my first AI-assisted Playwright test');
    await todoPage.expectTodoVisible('Write my first AI-assisted Playwright test');
  });

  test('should mark a todo as completed', async () => {
    await todoPage.addTodo('Complete this todo');
    await todoPage.completeTodo(0);
    await todoPage.expectTodoCompleted(0);
  });

  test('should delete a todo item', async () => {
    await todoPage.addTodo('Delete me');
    await todoPage.deleteTodo('Delete me');
    await todoPage.expectTodoNotVisible('Delete me');
  });

});