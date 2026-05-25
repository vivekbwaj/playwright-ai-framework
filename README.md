# playwright-ai-framework

An AI-native Playwright test automation framework built with TypeScript. This is not a generic test suite — it's a framework designed to demonstrate how AI, agents, and self-healing capabilities change what modern test automation looks like.

Built by [Vivek Bhardwaj](https://linkedin.com/in/vivek-bhardwaj-4350087) — QA Practice Lead, Melbourne AU.

---

## What this framework demonstrates

- **AI-assisted test automation** using GitHub Copilot as pair programmer
- **Self-healing locators** — semantic-first, fallback chains, and AI-assisted DOM recovery
- **Agent-driven testing** via `playwright-cli` skills (Claude Code, Copilot, Cursor)
- **Page Object Model** — clean separation of locators, actions, and assertions
- **Production-grade structure** — CI/CD, tracing, screenshots, video on failure

---

## Tech stack

| Layer | Choice |
|---|---|
| Language | TypeScript |
| Test framework | Playwright Test |
| AI pair programmer | GitHub Copilot |
| AI healing API | Claude API (Anthropic) |
| Agent CLI | `playwright-cli` with skills |
| CI/CD | GitHub Actions |
| Target app | [TodoMVC via Playwright](https://demo.playwright.dev/todomvc) |

---

## Folder structure

```
playwright-ai-framework/
├── .github/
│   ├── workflows/              # GitHub Actions CI config
│   └── copilot-instructions.md # Teaches Copilot this framework's conventions
├── tests/
│   ├── e2e/                    # End-to-end tests
│   │   └── todo.spec.ts        # TodoMVC core flows
│   ├── api/                    # API-level tests (coming)
│   └── agent/                  # Agent-driven test flows (coming)
├── pages/                      # Page Object Models
│   └── todo.page.ts            # TodoMVC page object (coming)
├── fixtures/                   # Shared test fixtures
├── utils/
│   ├── resilientLocator.ts     # Fallback locator chain (coming)
│   └── aiHealer.ts             # AI-assisted locator healing via Claude API (coming)
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript config
└── package.json
```

---

## Current status

### ✅ Phase 1 — Foundation (complete)
- [x] TypeScript + Playwright installed and configured
- [x] Folder structure established
- [x] `copilot-instructions.md` written — Copilot understands framework conventions
- [x] `playwright-cli` installed with skills
- [x] 3 core TodoMVC tests passing (add, complete, delete)
- [x] HTML reporter, screenshots and video on failure configured

### 🔄 Phase 2 — Page Object Model (in progress)
- [ ] Extract locators and actions into `pages/todo.page.ts`
- [ ] Refactor spec files to use POM
- [ ] Add fixture-based setup

### ⏳ Phase 3 — Self-healing (upcoming)
- [ ] `utils/resilientLocator.ts` — fallback locator chain
- [ ] `utils/aiHealer.ts` — Claude API called at runtime when locators fail
- [ ] Healing reporter — logs healed locators, suggests code fixes

### ⏳ Phase 4 — Agent-driven tests (upcoming)
- [ ] Use `playwright-cli` skills with Copilot to generate tests via agent prompts
- [ ] `tests/agent/` — tests driven by AI agent rather than written manually

### ⏳ Phase 5 — CI/CD (upcoming)
- [ ] GitHub Actions workflow — tests run on every push
- [ ] Badge on README showing live test status

---

## Getting started

### Prerequisites
- Node.js 18+
- npm
- GitHub Copilot (optional but recommended)

### Install

```bash
git clone https://github.com/vivekbwaj/playwright-ai-framework.git
cd playwright-ai-framework
npm install
npx playwright install
```

### Run tests

```bash
# Run all tests
npx playwright test

# Run specific spec
npx playwright test tests/e2e/todo.spec.ts

# Run with UI mode
npx playwright test --ui

# View HTML report
npx playwright show-report
```

### Using playwright-cli skills with your agent

```bash
# Install skills so Copilot/Claude Code can reference them
playwright-cli install --skills

# Let your agent drive tests
# In Copilot chat: "Test the add todo flow on https://demo.playwright.dev/todomvc using playwright-cli"
```

---

## Self-healing approach (design)

This framework implements three layers of locator resilience:

**Layer 1 — Semantic locators (baseline)**
All locators use Playwright's semantic APIs in priority order:
`getByRole()` → `getByLabel()` → `getByPlaceholder()` → `getByText()` → `getByTestId()`

CSS selectors and XPath are banned except as a last resort.

**Layer 2 — Fallback chain**
`utils/resilientLocator.ts` tries multiple locator strategies before failing. If the primary locator breaks, fallbacks are attempted automatically.

**Layer 3 — AI-assisted healing**
When all fallbacks fail, `utils/aiHealer.ts` takes a DOM snapshot and calls the Claude API:
> "I was looking for [element description]. Here is the current DOM. What locator should I use?"

The suggested locator is executed at runtime. The healing event is logged with a suggestion to update the source code.

---

## Copilot integration

This repo includes `.github/copilot-instructions.md` — a conventions file that teaches Copilot:
- Locator priority rules
- File and folder conventions
- Test writing standards
- Self-healing patterns to follow

Every Copilot suggestion in this repo is informed by these conventions before it writes a line.

---

## About

This framework is part of a 9-month AI QA upskilling roadmap targeting the Australian market. The goal is to demonstrate hands-on AI-native test engineering — not theory, but working code that shows what modern QA looks like when AI is embedded in the process.

**Author:** Vivek Bhardwaj
**LinkedIn:** [linkedin.com/in/vivek-bhardwaj-4350087](https://linkedin.com/in/vivek-bhardwaj-4350087)
**Medium:** [medium.com/@vivekbwaj.88](https://medium.com/@vivekbwaj.88)