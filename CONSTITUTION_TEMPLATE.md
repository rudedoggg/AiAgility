# CONSTITUTION v1.0
## The Master Document for AI Development Agents

**Authority**: [PM Name] | **Last Updated**: [Date]

This is the **single source of truth** for all AI agents working on this codebase. Whether you're using Cursor, Claude Code, Copilot, or any other AI tool, this document defines how we work.

---

## Table of Contents

0. [Core Philosophy](#0-core-philosophy)
1. [Quick Start](#i-quick-start)
2. [Zero-Tolerance Rules](#ii-zero-tolerance-rules)
3. [Workflow](#iii-workflow)
4. [Before You Code Checklist](#iv-before-you-code-checklist)
5. [Quality Gates & Enforcement](#v-quality-gates--enforcement)
6. [Anti-Slop Rules](#vi-anti-slop-rules)
7. [No Workarounds Policy](#vii-no-workarounds-policy)
8. [Cognitive Guardrails](#viii-cognitive-guardrails)
9. [PM Governance](#ix-pm-governance)
10. [Session Protocol](#x-session-protocol)
11. [Success Checklist](#xi-success-checklist)

---

## 0) CORE PHILOSOPHY

### Things You Measure Tend to Get Better

This is the foundational insight that governs how we operate. If something matters, we measure it. If we're not measuring it, it's probably drifting.

**What We Explicitly Measure:**

| Metric | Where Tracked | Why It Matters |
|--------|---------------|----------------|
| Test coverage & pass rates | CI/CD pipeline | Code quality over time |
| Linter errors | Pre-commit hooks, CI | Prevents quality drift |
| Workaround/exception counts | PR reviews | Detects shortcut culture |
| Build/deploy success rate | CI/CD dashboard | System reliability |

**If it isn't being measured, it's probably drifting.**

### Quality Over Speed (But Speed Matters Too)

- A fast wrong answer is worse than a slow right answer
- But a slow right answer that never ships is worthless
- Measure both quality AND velocity; optimize for their product, not either alone

### No Drift Without Detection

Every practice that matters has:
1. A written rule (this document)
2. An enforcement mechanism (hooks, CI, reviews)
3. A measurement (metrics, scores, counts)

If any of these three is missing, the practice will decay.

---

## I) QUICK START

**Quality checks (run frequently):**
```bash
# Adapt these to your project's tooling
npm run typecheck   # or: npx tsc --noEmit
npm run lint        # ESLint / Biome / your linter
npm test            # Test suite
```

> ### CRITICAL WORKFLOW RULES
>
> These apply to **every agent, every session**. No exceptions.
>
> 1. **NEVER commit directly to `main`** — use feature branches and PRs
> 2. **Always work on feature branches**: `git checkout -b feature/TICKET-ID-description`
> 3. **Push your branch and create a PR when done**: `git push -u origin feature/... && gh pr create`
> 4. **The PM merges PRs** — you do NOT merge your own
> 5. **One agent per task** — don't work on something another agent is doing

---

## II) ZERO-TOLERANCE RULES

These rules are **non-negotiable**. If any fail, STOP and fix before proceeding.

### TypeScript (Zero Tolerance)

> **Note:** If your project uses a different language, adapt these to equivalent strictness rules. The principle is: never suppress or bypass your type system.

| Rule | WHY |
|------|-----|
| ZERO `any` types | `any` disables type checking. Every `any` is a potential runtime crash hiding in plain sight. |
| ZERO `unknown` workarounds | `as unknown as T` bypasses the type system entirely. Fix the actual types. |
| ZERO `@ts-ignore` without timeline | Suppressing errors hides problems. If you must suppress, document when it will be fixed. |
| ALL functions have return types | Explicit return types catch bugs at compile time, not in production. |

### Linting (Zero Tolerance)

| Rule | WHY |
|------|-----|
| ZERO warnings | Warnings are future errors. Fix them now or they compound. |
| ZERO `console.*` in production code | Use proper logging. Console statements get lost and clutter output. |
| ZERO unused variables | Dead code is confusion waiting to happen. |

### Security (Zero Tolerance)

| Rule | WHY |
|------|-----|
| ZERO hardcoded secrets | Secrets in code get committed, pushed, and leaked. Use environment variables. |
| ALL user input validated | Unvalidated input is an injection attack waiting to happen. |
| ALL SQL parameterized | String concatenation in SQL = SQL injection. Always use parameterized queries. |
| ZERO secrets committed to git | Use `.env` files (gitignored), secret managers, or CI/CD variables. |

### Issue Tracking (Zero Tolerance)

| Rule | WHY |
|------|-----|
| NEVER mention a problem without creating an issue | Issues mentioned but not tracked are lost forever. |
| ALL discovered issues get tracked | Untracked problems compound silently until they become emergencies. |

---

## III) WORKFLOW

### The Flow

```
BACKLOG → READY → IN_PROGRESS → REVIEW → QA → DONE
                       ↓                        ↓
                    BLOCKED           ←←←←←←←←←←
```

### Status Definitions

| Status | Description | WHY This Stage Exists |
|--------|-------------|----------------------|
| **BACKLOG** | Future work, not yet prioritized | Captures ideas without committing resources |
| **READY** | Requirements are clear and development-ready | Prevents wasted work on unclear requirements |
| **IN_PROGRESS** | Agent is actively working | Tracks active work |
| **REVIEW** | Code complete, awaiting peer review | Code quality gate before merge |
| **QA** | Deployed to preview/staging, verifying functionality | Catch issues before production |
| **BLOCKED** | Stuck — needs PM intervention | Escalation path when agent can't proceed |
| **DONE** | PR merged, deployed to production | Complete and shipped |

### Git Branch ↔ Workflow Mapping

| Status | Git State |
|--------|-----------|
| IN_PROGRESS | Active work on `feature/TICKET-ID-*` branch |
| REVIEW | PR open, awaiting review |
| QA | PR deployed to preview environment |
| DONE | PR merged to `main`, deployed |

---

## IV) BEFORE YOU CODE CHECKLIST

**STOP. Read this before starting ANY code work.**

### Decision Tree: Does This Need Tests?

```
Does this change affect code?
├─ NO → Skip tests (docs/config only)
└─ YES → Continue

Does it change business logic, APIs, or data?
├─ NO → Skip tests (formatting/style only)
└─ YES → Tests Required
```

### Pre-Work Steps

1. **Understand the task fully** — read the issue/ticket, ask clarifying questions
2. **Verify system health**
   ```bash
   npm run typecheck  # Must pass before starting
   ```
3. **Sync with git**
   ```bash
   git fetch origin && git pull --rebase origin main
   ```
4. **Create a feature branch**
   ```bash
   git checkout -b feature/TICKET-ID-description
   ```

### Why This Matters

Without this checklist:
- Duplicate work happens (multiple agents on same task)
- Quality gates get skipped
- Tests don't get written
- Work starts on a broken baseline

---

## V) QUALITY GATES & ENFORCEMENT

### Automated Checks (Pre-Commit / CI)

| Check | What Happens If Failed |
|-------|----------------------|
| Type checking | Commit/merge blocked — fix type errors |
| Lint | Commit/merge blocked — fix lint issues |
| Tests | Merge blocked — fix failing tests |
| Secret scanning | Commit blocked — remove secrets |

**WHY automatic enforcement?** Humans (and LLMs) forget. Automation doesn't.

### Manual Quality Checks

Before any commit:
```bash
npm run typecheck   # Types
npm run lint        # Linting
npm test            # Tests
```

### Code Review (Critical)

**PM cannot review every line of code. Peer review is the quality gate.**

Every PR must be reviewed for:
- [ ] Code quality and best practices
- [ ] Security vulnerabilities
- [ ] Type safety compliance
- [ ] Lint — zero warnings
- [ ] Test coverage adequate
- [ ] No scope creep
- [ ] **No workarounds** (stubs, mocks, skipped tests)

---

## VI) ANTI-SLOP RULES

### The Surgical Fix Principle

**The size of a fix must be proportional to the problem.**

| Problem Type | Expected Scope | Red Flag |
|--------------|---------------|----------|
| Bug in one function | 1-10 lines, 1-2 files | Touching 3+ files |
| Type error | That file + its test | Refactoring neighbors |
| Feature addition | Specified scope only | "Improving" existing code |

**WHY?** Large fixes hide bugs. Small, focused changes are reviewable.

### The Adjacent Code Rule

When fixing a bug:
- DO: Fix the specific broken behavior
- DON'T: Refactor the surrounding function "while you're there"
- DON'T: Update related code that "could also use improvement"

**WHY?** Scope creep introduces new bugs and makes review impossible.

### The "While I'm Here" Protocol

If you discover ANY issue while working:

1. **STOP** — Don't fix it in the same commit
2. **CREATE AN ISSUE** — File it in your issue tracker with enough context to reproduce
3. **REPORT IT** — Mention the issue ID in your response
4. Continue with original task

**Violation examples (ALL are violations):**
- "I noticed X is broken" without creating an issue
- "I found 24 TypeScript errors but they're not related to my work, moving on"
- "There are several issues in this file but they're out of scope"
- "I see some problems but I'll leave them for now"

**WHY?** Issues mentioned but not tracked are lost forever. Observing a problem and walking away is worse than not noticing it.

---

## VII) NO WORKAROUNDS POLICY

### The Prime Directive

**ALWAYS fix the underlying issue. Never work around it.**

A workaround is any change that makes code compile, tests pass, or errors disappear WITHOUT fixing the actual problem.

### Forbidden Patterns

| Pattern | Why It's Forbidden | What To Do Instead |
|---------|-------------------|-------------------|
| `as unknown as T` | Bypasses type system entirely | Fix the actual types |
| `@ts-ignore` without timeline | Hides errors forever | Document when it will be fixed |
| `test.skip()` | Tests exist for a reason | Fix the test or the code |
| Mocking YOUR OWN code | Masks broken implementations | Fix the code being mocked |
| "Graceful degradation" stubs | Masks configuration issues | Fix the config |
| Fallback values hiding missing env vars | Delays failure to production | Fail fast instead |

### When Tests Fail

The correct response is **NEVER** to:
- Skip the test
- Mock the broken code
- Delete the test
- Mark it as "known failure"

The correct response is:
1. Understand WHY it's failing
2. Fix the CODE if the test is correct
3. Fix the TEST if the test is wrong
4. If you can't fix it, STOP and ask for help

**WHY?** Workarounds compound. Today's "temporary fix" becomes next month's production outage.

---

## VIII) COGNITIVE GUARDRAILS

### Rabbit Hole Detection

Warning signs:
- Spending >20% effort on <5% of value
- Adding complexity for rare edge cases
- Optimizing before measuring
- Going down a path that "feels wrong"

**When detected:** STOP → Step back → Restate goal in one sentence → Ask "Is what I'm doing serving this goal?"

### Uncertainty Protocol

| Confidence | Action |
|------------|--------|
| High | Proceed, note assumptions |
| Moderate | State interpretation, verify if important |
| Low | Propose approach, request validation |
| Uncertain | STOP, ask clarifying questions |

**"I don't know" is always acceptable. Guessing is not.**

### Terminal Success ≠ Reality

| What Passes | What It Proves | What It DOESN'T Prove |
|-------------|----------------|----------------------|
| Type checker passes | No compile errors | Bug is fixed |
| Tests pass | Unit tests pass | User workflow works |
| Server starts | Code runs | Feature functions correctly |

**A fix is NOT done until it's VERIFIED, not just coded.**

---

## IX) PM GOVERNANCE

### Requires PM Approval

- Constitution changes
- Architecture changes
- Bug fix touching >5 files
- New abstractions or services
- Workaround exceptions
- Changes to CI/CD pipeline
- Changes to deployment configuration

### Escalation Triggers

| Trigger | Action |
|---------|--------|
| Task is blocked | PM notified |
| Review fails 3+ times | PM intervention |
| Security issue found | Immediate PM notification |
| Repeated workarounds in session | PM notification |

---

## X) SESSION PROTOCOL

### Starting a Session

1. Read this constitution
2. Check for any in-progress work from prior sessions
3. Sync with git: `git fetch origin && git pull --rebase origin main`
4. Run quality checks to verify clean baseline: `npm run typecheck && npm run lint`

### During Work

```bash
# Quality checks (run frequently)
npm run typecheck && npm run lint && npm test
```

### Ending a Session

Before ending any session:
1. Commit and push all work in progress
2. Update issue/task status
3. Leave a note on any open PRs about current state
4. Ensure no uncommitted changes are left behind

**WHY?** The next agent (or human) needs clean state to continue.

---

## XI) SUCCESS CHECKLIST

Before marking work complete:

- [ ] Did I fix only what was asked?
- [ ] Did I avoid touching unrelated code?
- [ ] Do all zero-tolerance rules pass?
- [ ] Did I manually verify the fix works?
- [ ] Can I explain my change in one sentence?
- [ ] Is my change proportional to the problem?
- [ ] Did I fix the ACTUAL problem (not work around it)?
- [ ] Are there any skipped tests, stubs, or mocks hiding issues?
- [ ] Would this code embarrass me in a code review?
- [ ] Did I create issues for any problems I discovered but didn't fix?

---

## Completing Work: Step-by-Step

### Stage 1: Code Complete → Create PR

```bash
# 1. Run quality checks
npm run typecheck && npm run lint && npm test

# 2. Commit to your FEATURE BRANCH (never main)
git add <files>
git commit -m "[TICKET-ID] description"

# 3. Push branch and create PR
git push -u origin feature/TICKET-ID-description
gh pr create --title "[TICKET-ID] description" --body "Summary of changes"
```

### Stage 2: Review

PR is reviewed for quality, security, and correctness. Fix any issues and push updates.

### Stage 3: QA

If your project has preview/staging environments, verify the feature works end-to-end before merge.

### Stage 4: Done

After PM merges the PR, the work is complete.

### If Something Fails

| Stage | If Fails | Action |
|-------|----------|--------|
| QA | Tests fail on preview | Fix on branch → push → re-test |
| Review | Issues found | Fix code, push, re-request review |

---

## Customization Guide

This constitution is a starting point. Adapt it to your project:

### Language-Specific Rules
Replace the TypeScript section with rules for your language:
- **Python**: No `# type: ignore`, enforce `mypy --strict`, no bare `except:`
- **Go**: No `interface{}` (use generics), enforce `golangci-lint`, no `//nolint` without reason
- **Rust**: No `unsafe` without justification, enforce `clippy`, no `unwrap()` in production code
- **Java**: No raw types, enforce CheckStyle/SpotBugs, no `@SuppressWarnings` without timeline

### Tooling
Replace commands with your stack:
- **Linting**: ESLint, Biome, Ruff, golangci-lint, Clippy, etc.
- **Type checking**: tsc, mypy, go vet, cargo check, etc.
- **Testing**: Jest, Vitest, pytest, go test, cargo test, etc.
- **CI/CD**: GitHub Actions, GitLab CI, CircleCI, etc.

### Workflow
Adapt the kanban flow to your process:
- Add or remove statuses (e.g., remove QA if you don't have preview environments)
- Adjust approval gates (e.g., require 2 reviewers instead of 1)
- Modify branch naming conventions to match your team

### Multi-Agent Coordination
If running multiple AI agents concurrently, add:
- Task claiming/locking mechanism (database, API, or file-based)
- Agent identity and check-in protocol
- Conflict detection for file-level overlaps
- Claim expiration to recover stale work

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | [Date] | Initial constitution |
