# TodoMVC Basic Operations Test Plan

## Summary & Scope

This test plan covers fundamental TodoMVC operations at https://demo.playwright.dev/todomvc. It validates core user workflows: adding, completing, deleting, and filtering todos, as well as localStorage persistence. Tests use the `TodoPage` POM class with resilient locators and AI healing fallbacks.

**Scope:** Desktop Chrome browser, happy paths and basic error conditions, localStorage validation.

---

## Pre-Conditions & Test Data

**Base Setup:**

- Clean browser state (fresh localStorage)
- Navigate to https://demo.playwright.dev/todomvc
- User input field ready (`input[placeholder="What needs to be done?"]`)

**Test Data:**

- Valid todo texts: "Buy groceries", "Complete report", "Review PR"
- Special cases: single character ("X"), long text (200 chars), emoji ("🎉 Launch")
- Empty input validation

---

## Test Cases by Feature

### Add Todo

**TC-001: Add Single Todo**

- Priority: High
- Steps: (1) Type "Buy groceries" in `.new-todo` input, (2) Press Enter, (3) Capture screenshot
- Expected: Todo appears in `.todo-list li` with label text, item count increments to 1
- Artifacts: Screenshot on success, trace if failed

**TC-002: Add Multiple Todos**

- Priority: High
- Steps: Add "Task 1", "Task 2", "Task 3" in sequence, each with Enter
- Expected: All three visible in list, item count = 3, todos displayed in order
- Artifacts: Screenshot, trace on failure

**TC-003: Add Todo with Empty Input**

- Priority: Medium
- Steps: Press Enter on empty input field
- Expected: No todo added, count remains 0, no error displayed
- Artifacts: Screenshot

---

### Complete Todo

**TC-004: Mark Todo as Complete**

- Priority: High
- Steps: (1) Add "Buy groceries", (2) Hover todo item, (3) Click checkbox, (4) Verify `.completed` class
- Expected: Todo toggles completed state, strikethrough applied, item count reflects active items
- Artifacts: Screenshot, trace on failure

**TC-005: Toggle Completion Multiple Times**

- Priority: Medium
- Steps: Add todo, check/uncheck 3 times
- Expected: State toggles correctly each time, count updates accurately
- Artifacts: Video on failure (via config)

---

### Delete Todo

**TC-006: Delete Todo**

- Priority: High
- Steps: (1) Add "Buy groceries", (2) Hover item, (3) Click Delete button, (4) Verify disappears
- Expected: Todo removed from list, count decrements, `.todo-list li` count correct
- Artifacts: Screenshot, trace

**TC-007: Delete Completed Todo**

- Priority: Medium
- Steps: Add todo, complete it, delete it
- Expected: Removed successfully, count decrements to 0
- Artifacts: Screenshot

---

### Filter/View

**TC-008: Filter Active Todos**

- Priority: High
- Steps: (1) Add 3 todos, (2) Complete 1, (3) Click "Active" filter, (4) Verify 2 active shown
- Expected: Only non-completed todos visible, item count shows active count
- Artifacts: Screenshot

**TC-009: Filter Completed Todos**

- Priority: High
- Steps: Add 3 todos, complete 2, click "Completed" filter
- Expected: Only completed todos visible
- Artifacts: Screenshot

**TC-010: Clear Completed**

- Priority: Medium
- Steps: Add 3 todos, complete 2, click "Clear completed" button
- Expected: Completed todos removed, 1 active todo remains
- Artifacts: Screenshot

---

### Persistence

**TC-011: Todos Persist After Refresh**

- Priority: High
- Steps: (1) Add 2 todos (1 complete, 1 active), (2) Reload page, (3) Verify todos exist with same state
- Expected: Both todos visible with correct completion state via localStorage
- Artifacts: Trace, screenshot

---

## Retry & Flaky Handling

- **Config:** 1 retry on failure, traces/screenshots captured via `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`
- **Resilient Locators:** Use `resilientFill()` and `aiHeal()` utils for fragile selectors
- **Isolation:** Clear localStorage before each test (add in beforeEach hook if needed)
- **Timing:** Use Playwright's auto-wait on interactions; avoid hard waits

---

## Mapping to Seed Test

**seed.spec.ts** provides baseline navigation. Expand with:

- TC-001, TC-002 (add logic)
- TC-004 (complete logic)
- TC-006 (delete logic)
- TC-008–TC-011 (filter/persist validation)

Use `TodoPage` class methods (`addTodo()`, `completeTodo()`, `deleteTodo()`, assertions) for all cases.
