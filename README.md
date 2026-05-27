# playwright-ai-framework

An AI-native Playwright test automation framework built with TypeScript. Demonstrates AI-assisted testing, self-healing locators, and agent-driven test generation using GitHub Copilot and Claude.

Built by [Vivek Bhardwaj](https://linkedin.com/in/vivek-bhardwaj-4350087) — QA Practice Lead, Melbourne AU.

---

# Part 1 — Using the Framework

## Tech stack

| Layer              | Choice                                         |
| ------------------ | ---------------------------------------------- |
| Language           | TypeScript                                     |
| Test framework     | Playwright Test                                |
| AI pair programmer | GitHub Copilot or Claude (your choice)         |
| Agent model        | Claude Sonnet 4.6                              |
| AI healing API     | Claude API (Anthropic)                         |
| Native agent loop  | Playwright `init-agents`                       |
| CI/CD              | GitHub Actions                                 |
| Target app         | [TodoMVC](https://demo.playwright.dev/todomvc) |

---

## Install

```bash
git clone https://github.com/vivekbwaj/playwright-ai-framework.git
cd playwright-ai-framework
npm install
npx playwright install
npx playwright-cli install --skills
```

---

## Run tests

```bash
# All tests
npx playwright test

# E2E tests only (custom self-healing)
npx playwright test tests/e2e/

# Agent-generated tests only
npx playwright test tests/agent/

# View HTML report
npx playwright show-report
```

---

## Run the agent loop — Option A: GitHub Copilot

**Prerequisites:** GitHub Copilot extension in VS Code (free tier works), VS Code 1.105+

Open Copilot chat → switch to **Agent mode** → run these in sequence:

**Step 1 — Generate a test plan**

```
Use @playwright-test-planner to generate a test plan for
https://demo.playwright.dev/todomvc. Use tests/seed.spec.ts
as the seed test. Save to specs/basic-operations.md
```

**Step 2 — Generate tests from the plan**

```
Use @playwright-test-generator to generate tests from
specs/basic-operations.md. Save to tests/agent/
```

**Step 3 — Heal a failing test**

```
Use @playwright-test-healer to fix the failing test
tests/agent/todo.spec.ts
```

**Limitation:** Copilot free tier uses GPT-5 mini — generates plan from knowledge, not live browser exploration.

---

## Run the agent loop — Option B: Claude (recommended for agents)

**Prerequisites:** Claude extension in VS Code or Claude Code CLI + Anthropic API key

**Why Claude is better for agents:** The agent definition files explicitly specify `model: Claude Sonnet 4.6` — they were designed for Claude.

**Setup via Claude Code CLI:**

```bash
npm install -g @anthropic/claude-code
export ANTHROPIC_API_KEY=your-key-here
cd playwright-ai-framework
claude
```

**Setup via Claude extension in VS Code:** Open Claude chat panel — no extra install needed if extension is already installed.

**Step 1 — Generate a test plan**

```
Use the playwright-test-planner agent defined in
.github/agents/playwright-test-planner.agent.md to generate
a test plan for https://demo.playwright.dev/todomvc.
Use tests/seed.spec.ts as seed. Save to specs/basic-operations.md
```

**Step 2 — Generate tests from the plan**

```
Use the playwright-test-generator agent defined in
.github/agents/playwright-test-generator.agent.md to generate
tests from specs/basic-operations.md. Save to tests/agent/
```

**Step 3 — Heal a failing test**

```
Use the playwright-test-healer agent defined in
.github/agents/playwright-test-healer.agent.md to fix
tests/agent/todo.spec.ts
```

---

## Two approaches to self-healing — choose what fits

### Approach 1 — Custom utilities (runtime healing)

Healing happens **during** the test run. Test never fails in the first place.

```typescript
// In your Page Object — use resilientFill instead of direct fill
await resilientFill(
  {
    description: 'todo input field',
    primary: this.input,
    fallbacks: [this.page.locator('.new-todo'), this.page.locator('input[type="text"]')],
  },
  text,
);
```

- Layer 1: Semantic locators — rarely break
- Layer 2: `resilientLocator.ts` — fallback chain at runtime
- Layer 3: `aiHealer.ts` — Claude API called when all fallbacks fail

**Requires:** Anthropic API key in `.env` for Layer 3

### Approach 2 — Native init-agents (post-failure healing)

Healing happens **after** the test fails. Agent patches the test file and reruns.

Use the `@playwright-test-healer` prompt above (Copilot or Claude).

**Requires:** Copilot or Claude in VS Code

### Which to use?

|               | Custom utilities       | Native init-agents     |
| ------------- | ---------------------- | ---------------------- |
| When          | During test run        | After test fails       |
| Outcome       | Test passes silently   | Test file gets patched |
| Tests live in | `tests/e2e/`           | `tests/agent/`         |
| Best for      | CI pipeline resilience | Autonomous repair      |

---

## Adapting for a new website

Only Page Objects and specs change. Everything else is reusable.

```bash
mkdir -p pages/newsite tests/e2e/newsite
touch pages/newsite/home.page.ts tests/e2e/newsite/home.spec.ts
```

Then run the planner against the new URL — it does the rest.

---

## Current status

### ✅ Phase 1 — Foundation

- [x] TypeScript + Playwright configured
- [x] Folder structure, copilot-instructions.md, playwright-cli skills

### ✅ Phase 2 — Page Object Model

- [x] `pages/todo.page.ts` — all locators and actions extracted from spec files

### ✅ Phase 3 — Custom self-healing

- [x] `utils/resilientLocator.ts` — fallback chain
- [x] `utils/aiHealer.ts` — Claude API runtime healing
- [x] Layer 2 validated — fallback kicks in when primary breaks

### ✅ Phase 4 — Native agent loop

- [x] Playwright init-agents installed
- [x] MCP configured — `.vscode/mcp.json`
- [x] Test plan generated — `specs/basic-operations.md`
- [x] Tests generated — `tests/agent/`

### 🔄 Phase 5 — Claude agent demo (in progress)

- [ ] Run full planner → generator → healer loop via Claude
- [ ] Compare Claude vs Copilot output
- [ ] Healer demo on deliberately broken test

### ⏳ Phase 6 — CI/CD

- [ ] GitHub Actions workflow
- [ ] Status badge on README

---

## Decision log

| Decision                                   | Reason                                               |
| ------------------------------------------ | ---------------------------------------------------- |
| TypeScript over Python                     | Market demand, Playwright native language            |
| Two repos                                  | Separate learning showcase from production framework |
| TodoMVC as target app                      | Stable, publicly hosted, breakable for demos         |
| Two self-healing approaches                | Shows depth (custom) and currency (native agents)    |
| Copilot for coding, Claude API for runtime | Different tools, different jobs                      |
| Claude for agent loop                      | Agent `.md` files specify Claude Sonnet 4.6          |

---

---

# Part 2 — Knowledge Base

## Folder structure

```
playwright-ai-framework/
├── .claude/
│   └── skills/playwright-cli/references/  # Claude Code skill docs
├── .github/
│   ├── agents/                            # Agent definitions (Claude Sonnet 4.6)
│   ├── workflows/                         # GitHub Actions CI
│   └── copilot-instructions.md            # Copilot reads this for conventions
├── .vscode/
│   └── mcp.json                           # Playwright MCP — local Copilot
├── specs/                                 # Test plans from planner agent
├── tests/
│   ├── seed.spec.ts                       # Agent bootstrap test
│   ├── e2e/                               # Tests with custom healing utils
│   ├── agent/                             # Agent-generated tests
│   └── api/                               # API tests (coming)
├── pages/                                 # Page Object Models
├── utils/
│   ├── resilientLocator.ts                # Runtime fallback chain
│   └── aiHealer.ts                        # Claude API runtime healing
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## What every `.md` file does

### `.claude/skills/playwright-cli/references/`

Created by `playwright-cli install --skills`. Teach AI agents how to use playwright-cli:

| File                     | Purpose                                             |
| ------------------------ | --------------------------------------------------- |
| `element-attributes.md`  | Inspect element attributes not visible in snapshots |
| `playwright-tests.md`    | Run and debug Playwright test suites                |
| `request-mocking.md`     | Intercept and mock network requests                 |
| `running-code.md`        | Execute arbitrary Playwright scripts                |
| `session-management.md`  | Manage multiple browser sessions                    |
| `spec-driven-testing.md` | Work with spec files and test plans                 |
| `storage-state.md`       | Persist cookies and localStorage between tests      |
| `test-generation.md`     | Generate tests from browser interactions            |
| `tracing.md`             | Record and inspect execution traces                 |
| `video-recording.md`     | Capture browser session videos                      |

### `.github/`

| File                                        | Purpose                                                      |
| ------------------------------------------- | ------------------------------------------------------------ |
| `copilot-instructions.md`                   | Framework conventions — Copilot reads before suggesting code |
| `agents/playwright-test-planner.agent.md`   | Planner — explores app, produces test plan                   |
| `agents/playwright-test-generator.agent.md` | Generator — turns plan into test files                       |
| `agents/playwright-test-healer.agent.md`    | Healer — fixes failing tests autonomously                    |

### `specs/`

| File                  | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `basic-operations.md` | Test plan for TodoMVC generated by planner agent |

### `tests/`

| File           | Purpose                                                 |
| -------------- | ------------------------------------------------------- |
| `seed.spec.ts` | Minimal bootstrap — gives agents context about your app |

---

## AI tools — roles explained

| Tool                           | Where               | When used                              |
| ------------------------------ | ------------------- | -------------------------------------- |
| GitHub Copilot                 | VS Code sidebar     | Writing code day to day                |
| Claude extension / Claude Code | VS Code or terminal | Full agent loop — plan, generate, heal |
| Claude API                     | `utils/aiHealer.ts` | Runtime healing during test execution  |
| playwright-cli                 | Terminal            | Agent driving the browser              |

---

## Copilot vs Claude Code for agents

|                     | GitHub Copilot                    | Claude Code                           |
| ------------------- | --------------------------------- | ------------------------------------- |
| Setup               | VS Code extension                 | CLI + API key or VS Code extension    |
| Cost                | Free tier available               | Pay per token                         |
| Agent model         | GPT-5 mini (free)                 | Claude Sonnet 4.6                     |
| Browser exploration | Knowledge-based (free)            | Live browser via playwright-cli       |
| Reads               | `.github/copilot-instructions.md` | `.claude/skills/` + agent `.md` files |
| Best for            | Daily coding assistance           | Full agentic loop                     |

---

## playwright-cli vs playwright-cli skills

|         | playwright-cli              | playwright-cli skills             |
| ------- | --------------------------- | --------------------------------- |
| What    | Command-line tool           | Reference `.md` docs              |
| Does    | AI agent drives the browser | Teaches agent what commands exist |
| Analogy | The steering wheel          | The instruction manual            |

---

## Playwright MCP

MCP (Model Context Protocol) lets Copilot or Claude call Playwright as a tool — not just suggest code but actually run tests and act on results.

**Local config** (already in repo — works free):
`.vscode/mcp.json`

```json
{
  "servers": {
    "playwright-test": {
      "type": "stdio",
      "command": "npx",
      "args": ["playwright", "run-test-mcp-server"]
    }
  }
}
```

**GitHub cloud config** (requires paid Copilot licence):
GitHub → Settings → Copilot → Cloud agent → MCP configuration → paste same JSON.

---

**Author:** Vivek Bhardwaj
**LinkedIn:** [linkedin.com/in/vivek-bhardwaj-4350087](https://linkedin.com/in/vivek-bhardwaj-4350087)
**Medium:** [medium.com/@vivekbwaj.88](https://medium.com/@vivekbwaj.88)
