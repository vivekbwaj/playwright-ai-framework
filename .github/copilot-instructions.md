# Copilot Instructions — playwright-ai-framework

## Project overview
This is an AI-native Playwright test automation framework built with TypeScript.
It targets https://demo.playwright.dev/todomvc as the practice application.
The framework demonstrates AI-assisted testing, self-healing locators, and
agent-driven test execution using playwright-cli skills.

## Language and framework
- TypeScript only — no JavaScript
- Playwright Test as the test runner
- Page Object Model (POM) pattern — always
- Never write locators directly in test files

## Locator rules — strictly follow this order
1. getByRole() — always first choice
2. getByLabel() — for form fields
3. getByPlaceholder() — for inputs
4. getByText() — for visible text
5. getByTestId() — only if data-testid exists
6. CSS or XPath — never, unless absolutely no alternative

## File and folder conventions
- Page objects → /pages/*.page.ts
- Test files → /tests/e2e/*.spec.ts
- Shared utilities → /utils/*.ts
- Test fixtures → /fixtures/*.ts

## Test writing rules
- Every test must have a clear descriptive name
- Use fixture-based setup — never beforeEach in test files
- Tests must be independent — no shared state between tests
- Always use Playwright's built-in assertions (expect)

## Self-healing approach
- Primary locator always semantic (see locator rules above)
- Fallback chain in resilientLocator.ts — use it for any critical actions
- AI healer in aiHealer.ts — called automatically when fallbacks fail
- Never hard-code waits — use Playwright's auto-waiting

## AI integration
- This framework uses Claude API for AI-assisted locator healing
- When suggesting new utilities, follow the pattern in utils/aiHealer.ts
- Keep AI calls async, handle errors gracefully, always log healing events