# playwright-ai-framework

An AI-native Playwright test automation framework built with TypeScript. This is not a generic test suite — it's a framework designed to demonstrate how AI, agents, and self-healing capabilities change what modern test automation looks like.

Built by [Vivek Bhardwaj](https://linkedin.com/in/vivek-bhardwaj-4350087) — QA Practice Lead, Melbourne AU.

---

## What this framework demonstrates

- **AI-assisted test automation** using GitHub Copilot or Claude Code as pair programmer
- **Self-healing locators** — two distinct approaches (see below)
- **Agent-driven testing** via Playwright's native `init-agents` — planner, generator, healer
- **Page Object Model** — clean separation of locators, actions, and assertions
- **Production-grade structure** — CI/CD, tracing, screenshots, video on failure

---

## Tech stack

| Layer              | Choice                                                        |
| ------------------ | ------------------------------------------------------------- |
| Language           | TypeScript                                                    |
| Test framework     | Playwright Test                                               |
| AI pair programmer | GitHub Copilot or Claude Code (your choice)                   |
| Agent model        | Claude Sonnet 4.6 (used by agent definitions)                 |
| AI healing API     | Claude API (Anthropic)                                        |
| Native agent loop  | Playwright `init-agents`                                      |
| CI/CD              | GitHub Actions                                                |
| Target app         | [TodoMVC via Playwright](https://demo.playwright.dev/todomvc) |

---

## Choosing your AI tool — Copilot or Claude Code

This framework supports both GitHub Copilot and Claude Code. They are not mutually exclusive — you can use both. Here is what each one does and how to set up each.

---

### Option A — GitHub Copilot (what this project was built with)

**Best for:** Day-to-day coding assistance, inline completions, chat in VS Code
**Licence:** Free tier available at github.com/settings/copilot
**Setup:** Install the GitHub Copilot extension in VS Code

**What Copilot reads in this repo:**

- `.github/copilot-instructions.md` — your framework conventions
- `.vscode/mcp.json` — Playwright MCP server (lets Copilot run tests directly)

**Running agents with Copilot:**
Open Copilot chat in VS Code, switch to Agent mode, then:

```
Use @playwright-test-planner to generate a test plan for
https://demo.playwright.dev/todomvc. Save to specs/basic-operations.md
```

**Limitation:** Copilot on the free tier used GPT-5 mini for the planner — it generated the plan from knowledge rather than live browser exploration.

---

### Option B — Claude Code (recommended for agents)

**Best for:** Running the full agentic loop properly — planner explores the live app in a real browser, generator writes accurate tests, healer fixes failures autonomously
**Why better for agents:** The `.github/agents/*.agent.md` files explicitly specify `model: Claude Sonnet 4.6` — they were designed for Claude Code
**Licence:** Requires Anthropic API key — get one free at console.anthropic.com

**Setup:**

```bash
# Install Claude Code globally
npm install -g @anthropic/claude-code

# Set your API key
export ANTHROPIC_API_KEY=your-key-here

# Run from your repo root
cd playwright-ai-framework
claude
```

**What Claude Code reads in this repo:**

- `.claude/skills/playwright-cli/references/*.md` — teaches Claude Code how to use playwright-cli
- `.github/agents/*.agent.md` — agent definitions with Claude Sonnet 4.6 model

**Running agents with Claude Code:**

```
Use the playwright-test-planner agent to generate a test plan for
https://demo.playwright.dev/todomvc. Use tests/seed.spec.ts as
the seed test. Save to specs/basic-operations.md
```

---

### Side-by-side — Copilot vs Claude Code for agents

|                     | GitHub Copilot                    | Claude Code                         |
| ------------------- | --------------------------------- | ----------------------------------- |
| Setup               | VS Code extension                 | CLI + API key                       |
| Cost                | Free tier available               | Pay per token                       |
| Agent model         | GPT-5 mini (free) / GPT-4 (paid)  | Claude Sonnet 4.6                   |
| Browser exploration | Knowledge-based (free tier)       | Live browser via playwright-cli     |
| Reads               | `.github/copilot-instructions.md` | `.claude/skills/`                   |
| Best for            | Daily coding assistance           | Full agentic loop                   |
| Agent quality       | Good                              | Better — agents designed for Claude |

**Recommendation:** Use Copilot for writing code day-to-day. Use Claude Code when you want to run the full planner → generator → healer loop properly.

---

## AI tools — what each one does

| AI Tool        | Where it lives      | When it's used                           |
| -------------- | ------------------- | ---------------------------------------- |
| GitHub Copilot | VS Code sidebar     | While you're writing code                |
| Claude Code    | Terminal CLI        | Full agentic loop — plan, generate, heal |
| Claude API     | `utils/aiHealer.ts` | During test execution — runtime healing  |
| playwright-cli | Terminal            | When agent is driving the browser        |

---

## playwright-cli vs playwright-cli skills — the difference

|              | `playwright-cli`                                      | `playwright-cli skills`                                      |
| ------------ | ----------------------------------------------------- | ------------------------------------------------------------ |
| What it is   | Command-line tool to drive Playwright via AI          | Reference `.md` docs installed locally                       |
| What it does | Lets an AI agent run, inspect, interact with browsers | Teaches the AI agent what commands exist and how to use them |
| Analogy      | The steering wheel                                    | The instruction manual for the steering wheel                |

Skills without the CLI = documentation with no tool.
CLI without skills = tool with no instructions — agent has to guess.

---

## What every `.md` file in this framework does

### `.claude/skills/playwright-cli/references/`

Installed by `playwright-cli install --skills`. Read by Claude Code to understand playwright-cli commands:

| File                     | Purpose                                                    |
| ------------------------ | ---------------------------------------------------------- |
| `element-attributes.md`  | How to inspect element attributes not visible in snapshots |
| `playwright-tests.md`    | How to run and debug Playwright test suites                |
| `request-mocking.md`     | How to intercept and mock network requests                 |
| `running-code.md`        | How to execute arbitrary Playwright scripts                |
| `session-management.md`  | How to manage multiple browser sessions                    |
| `spec-driven-testing.md` | How to work with spec files and test plans                 |
| `storage-state.md`       | How to persist cookies and localStorage between tests      |
| `test-generation.md`     | How to generate tests from browser interactions            |
| `tracing.md`             | How to record and inspect execution traces                 |
| `video-recording.md`     | How to capture browser session videos                      |

### `.github/`

| File                                        | Purpose                                                           |
| ------------------------------------------- | ----------------------------------------------------------------- |
| `copilot-instructions.md`                   | Framework conventions — Copilot reads this before suggesting code |
| `agents/playwright-test-planner.agent.md`   | Planner agent definition — model: Claude Sonnet 4.6               |
| `agents/playwright-test-generator.agent.md` | Generator agent definition — model: Claude Sonnet 4.6             |
| `agents/playwright-test-healer.agent.md`    | Healer agent definition — model: Claude Sonnet 4.6                |

### `specs/`

| File                  | Purpose                                              |
| --------------------- | ---------------------------------------------------- |
| `basic-operations.md` | Test plan generated by the planner agent for TodoMVC |

### `tests/`

| File           | Purpose                                                      |
| -------------- | ------------------------------------------------------------ |
| `seed.spec.ts` | Minimal bootstrap test — gives agents context about your app |

---

## Two approaches to self-healing — choose what fits your context

This framework deliberately implements **two different self-healing philosophies**. They are not mutually exclusive — they solve different problems at different points in the test lifecycle.

### Approach 1 — Custom healing utilities (runtime)

**Files:** `utils/resilientLocator.ts` and `utils/aiHealer.ts`

**How it works:**

- `resilientLocator.ts` implements a fallback locator chain — if the primary locator fails, it tries alternatives automatically during test execution
- `aiHealer.ts` calls the Claude API at runtime — when all fallbacks fail, it takes a DOM snapshot, sends it to Claude, and gets a suggested locator back
- Healing happens **during** the test run — the test never fails in the first place

**When to use:**

- You want runtime resilience without stopping the test run
- You're in a CI pipeline and can't afford test failures on minor UI drift

**How to use:**

```typescript
await resilientFill(
  {
    description: 'todo input field',
    primary: this.input,
    fallbacks: [this.page.locator('.new-todo'), this.page.locator('input[type="text"]')],
  },
  text,
);
```

**Requires:** Anthropic API key in `.env` for `aiHealer.ts`

---

### Approach 2 — Playwright native init-agents (post-failure)

**Files:** `.github/agents/playwright-test-healer.agent.md`

**How it works:**

- When a test fails, the healer agent replays the failing steps, inspects the current UI, patches the test file, and reruns automatically
- Healing happens **after** the test fails — the agent repairs the code itself

**When to use:**

- You want fully autonomous test repair without writing any healing code
- You want to demonstrate cutting-edge Playwright agentic capabilities

**How to use:**

With Copilot Agent mode in VS Code:

```
Use @playwright-test-healer to fix the failing test tests/agent/todo.spec.ts
```

With Claude Code:

```
Use the playwright-test-healer agent to fix tests/agent/todo.spec.ts
```

---

### Side-by-side comparison

|                      | Custom utilities      | Native init-agents     |
| -------------------- | --------------------- | ---------------------- |
| When healing happens | During test run       | After test fails       |
| Who writes the fix   | Your code suggests it | Agent patches the file |
| Test outcome         | Test passes silently  | Test file gets updated |
| Setup needed         | Anthropic API key     | Copilot or Claude Code |
| Tests live in        | `tests/e2e/`          | `tests/agent/`         |

---

## Playwright MCP — what it is and how to set it up

MCP (Model Context Protocol) lets an AI assistant call external tools as functions. The Playwright MCP server exposes Playwright's test runner as a callable tool — so instead of Copilot just suggesting test code, it can actually run tests and act on results.

### Local setup — works with Copilot free tier

`.vscode/mcp.json` is already configured in this repo:

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

Copilot in VS Code picks this up automatically. No extra steps needed.

### GitHub cloud setup — requires paid Copilot licence

To use with GitHub's cloud Copilot agent:

1. Go to github.com → Settings → Copilot → Cloud agent → MCP configuration
2. Add the same JSON config above

**Note:** Requires Copilot Pro/Business. The local `.vscode/mcp.json` approach is sufficient for local development.

---

## Adapting this framework for a new website

Only Page Objects and specs change per site — everything else is reusable.

### What to create

```
pages/newsite/home.page.ts       ← new Page Object
tests/e2e/newsite/home.spec.ts   ← new spec file
specs/newsite-operations.md      ← generated by planner
```

### What stays the same

- `utils/resilientLocator.ts` and `utils/aiHealer.ts` — work for any site
- `playwright.config.ts` — reporters, tracing, screenshots
- `.github/agents/` — planner and generator work against any URL
- `.github/copilot-instructions.md` — conventions apply everywhere

### Quickstart

```bash
mkdir -p pages/newsite tests/e2e/newsite
touch pages/newsite/home.page.ts tests/e2e/newsite/home.spec.ts
```

Then in Copilot Agent mode or Claude Code:

```
Use @playwright-test-planner to generate a test plan for
https://newsite.com. Save to specs/newsite-operations.md
```

---

## Folder structure

```
playwright-ai-framework/
├── .claude/
│   └── skills/playwright-cli/references/  # Claude Code skill docs
├── .github/
│   ├── agents/                            # Agent definitions (Claude Sonnet 4.6)
│   ├── workflows/                         # GitHub Actions CI
│   └── copilot-instructions.md            # Copilot conventions
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

## Current status

### ✅ Phase 1 — Foundation (complete)

- [x] TypeScript + Playwright installed and configured
- [x] Folder structure established
- [x] `copilot-instructions.md` written
- [x] `playwright-cli` installed with skills

### ✅ Phase 2 — Page Object Model (complete)

- [x] `pages/todo.page.ts` — locators and actions extracted
- [x] Spec files use POM — no locators in test files

### ✅ Phase 3 — Custom self-healing (complete)

- [x] `utils/resilientLocator.ts` — fallback locator chain
- [x] `utils/aiHealer.ts` — Claude API runtime healing
- [x] Layer 2 healing validated — fallback kicks in when primary breaks

### ✅ Phase 4 — Native agent loop (complete)

- [x] Playwright init-agents installed — planner, generator, healer
- [x] Playwright MCP server configured in `.vscode/mcp.json`
- [x] Test plan generated — `specs/basic-operations.md`
- [x] Tests generated by agent — `tests/agent/`

### 🔄 Phase 5 — Agent healer demo (in progress)

- [ ] Run healer agent on a deliberately broken test
- [ ] Try full loop with Claude Code for live browser exploration

### ⏳ Phase 6 — CI/CD (upcoming)

- [ ] GitHub Actions workflow
- [ ] Green status badge on README

---

## Getting started

### Prerequisites

- Node.js 18+
- npm
- GitHub Copilot in VS Code (free tier) — for Copilot path
- Anthropic API key — for Claude Code path and `aiHealer.ts`
- VS Code 1.105+

### Install

```bash
git clone https://github.com/vivekbwaj/playwright-ai-framework.git
cd playwright-ai-framework
npm install
npx playwright install
npx playwright-cli install --skills
```

### Run tests

```bash
npx playwright test                        # all tests
npx playwright test tests/e2e/             # e2e with custom healing
npx playwright test tests/agent/           # agent-generated tests
npx playwright show-report                 # HTML report
```

---

## About

This framework is part of a 9-month AI QA upskilling roadmap targeting the Australian market.

**Author:** Vivek Bhardwaj
**LinkedIn:** [linkedin.com/in/vivek-bhardwaj-4350087](https://linkedin.com/in/vivek-bhardwaj-4350087)
**Medium:** [medium.com/@vivekbwaj.88](https://medium.com/@vivekbwaj.88)
