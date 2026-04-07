# Phase 4A: Polish & De-OpenMAIC Cleanup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all OpenMAIC/THU/Tsinghua branding, replace with NexusCollab; create empty state SVG illustrations; rewrite README.

**Architecture:** Search/replace across codebase + targeted file edits + SVG illustration component + full README rewrite.

**Tech Stack:** Node.js, pnpm, Next.js, plain SVG (no external illustration libraries).

---

## Before Starting: Verify No Uncommitted Changes

Run:
```bash
git status
```
If there are uncommitted changes, commit or stash them before proceeding.

---

## Task 1: Delete Academic Asset Files

**Files:**
- Delete: `skills/openmaic/` (entire directory)
- Delete: `README-zh.md`
- Delete: `community/feishu.md`
- Delete: `assets/banner.png`
- Delete: `assets/logo-horizontal.png`
- Delete: `assets/*.gif` (all demo GIFs)
- Delete: `public/avatars/student1.svg`, `public/avatars/student2.svg`, `public/avatars/student3.svg`
- Delete: `public/avatars/teacher.svg`, `public/avatars/teacher-2.svg`
- Delete: `public/avatars/clown.svg`, `public/avatars/clown-2.png`, `public/avatars/clown-2.svg`
- Delete: `public/avatars/scholar.svg`
- Delete: `public/avatars/note-taker.svg`, `public/avatars/note-taker-2.png`
- Delete: `public/avatars/dreamer.svg`
- Delete: `public/avatars/curious.svg`, `public/avatars/curious-2.png`, `public/avatars/curious.svg`, `public/avatars/curious-2.svg`
- Delete: `public/avatars/thinker.svg`, `public/avatars/thinker-2.png`
- Delete: `public/avatars/reader.svg`
- Delete: `public/avatars/explorer.svg`
- Delete: `public/avatars/creative.svg`
- Delete: `public/avatars/builder.svg`
- Delete: `public/logos/mineru.png`

- [ ] **Step 1: Delete academic asset directories and files**

```bash
rm -rf skills/openmaic
rm -f README-zh.md community/feishu.md
rm -f assets/banner.png assets/logo-horizontal.png assets/*.gif
rm -f public/avatars/student1.svg public/avatars/student2.svg public/avatars/student3.svg
rm -f public/avatars/teacher.svg public/avatars/teacher-2.svg
rm -f public/avatars/clown.svg public/avatars/clown-2.png public/avatars/clown-2.svg
rm -f public/avatars/scholar.svg
rm -f public/avatars/note-taker.svg public/avatars/note-taker-2.png
rm -f public/avatars/dreamer.svg
rm -f public/avatars/curious.svg public/avatars/curious-2.png public/avatars/curious-2.svg
rm -f public/avatars/thinker.svg public/avatars/thinker-2.png
rm -f public/avatars/reader.svg public/avatars/explorer.svg
rm -f public/avatars/creative.svg public/avatars/builder.svg
rm -f public/logos/mineru.png
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "chore: remove OpenMAIC academic assets

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Update package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update name and description in package.json**

Replace the first line of package.json:
```json
  "name": "nexuscollab",
  "version": "0.1.0",
  "private": true,
  "license": "AGPL-3.0",
  "description": "Enterprise AI Task Review Platform",
```

- [ ] **Step 2: Commit**

```bash
git add package.json && git commit -m "chore: rename package to nexuscollab

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Update docker-compose.yml

**Files:**
- Modify: `docker-compose.yml`

- [ ] **Step 1: Replace openmaic with nexuscollab in docker-compose.yml**

```yaml
services:
  nexuscollab:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    volumes:
      - nexuscollab-data:/app/data
    restart: unless-stopped

volumes:
  nexuscollab-data:
```

- [ ] **Step 2: Commit**

```bash
git add docker-compose.yml && git commit -m "chore: rename docker service to nexuscollab

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Update .env.example Header

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Update the header comment in .env.example**

Replace the header:
```bash
# =============================================================================
# NexusCollab Environment Variables
# Copy this file to .env.local and fill in the values you need.
# All variables are optional — only configure the providers you want to use.
# =============================================================================
```

Note: Keep all the API key variable names and provider sections unchanged — they are legitimate provider keys.

- [ ] **Step 2: Commit**

```bash
git add .env.example && git commit -m "chore: update .env.example header to NexusCollab

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Rewrite CONTRIBUTING.md

**Files:**
- Modify: `CONTRIBUTING.md`

- [ ] **Step 1: Rewrite CONTRIBUTING.md with NexusCollab references**

Replace the entire file content with:

```markdown
# Contributing to NexusCollab

Thank you for your interest in contributing to NexusCollab! This guide will help you get started and ensure a smooth collaboration.

## How to Contribute

| Contribution type | What to do |
| --- | --- |
| **Bug fix** | Open a PR directly (link the issue if one exists) |
| **Extending existing features** (e.g. adding a new model provider, new TTS engine) | Open a PR directly |
| **New feature or architecture change** | Open a GitHub Discussion before opening a PR |
| **Design / UI change** | Discuss in a GitHub Discussion first — include mockups or screenshots |
| **Refactor-only PR** | Not accepted unless a maintainer explicitly requests it |
| **Documentation** | Open a PR directly |
| **Question** | Open a GitHub Discussion |

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20.9.0
- [pnpm](https://pnpm.io/) (latest)
- PostgreSQL database
- A copy of `.env.local` — see [`.env.example`](.env.example) for reference

## Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd nexuscollab

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Set up database
pnpm prisma migrate dev

# Start the development server
pnpm dev
```

## Development Workflow

1. **Fork** the repository and create a branch from `main`:
   ```bash
   git checkout -b feat/your-feature main
   ```
2. **Branch naming convention:**
   - `feat/` — new features or enhancements
   - `fix/` — bug fixes
   - `docs/` — documentation changes
3. Make your changes and **test locally**.
4. Run **all CI checks** before committing (see below).
5. Open a **Pull Request** against `main`.

## Before You Submit a PR

```bash
# 1. Format code
pnpm format

# 2. Lint (with auto-fix)
pnpm lint --fix

# 3. TypeScript type checking
npx tsc --noEmit
```

If formatting or lint auto-fixes produce changes, include them in your commit.

### Local Testing

Before marking a PR as **Ready for Review**, you **must**:

1. **Verify your goal** — confirm that the PR achieves what it set out to do
2. **Regression test** — manually check that existing functionality is not broken
3. **Run CI checks locally** (see above)

If you have not completed local verification, keep your PR in **Draft** status.

### PR Guidelines

- **Every PR must link to an issue** — use `Closes #123` or `Fixes #456` in the PR description.
- **Keep PRs focused** — one concern per PR; do not mix unrelated changes.
- **Describe what and why** — fill out the PR template.
- **Include screenshots** — for UI changes, show before/after.
- **Ensure CI passes** before requesting review.

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`, `perf`, `style`

## License

By contributing to NexusCollab, you agree that your contributions will be licensed under the [AGPL-3.0 License](LICENSE).
```

- [ ] **Step 2: Commit**

```bash
git add CONTRIBUTING.md && git commit -m "docs: rewrite CONTRIBUTING.md for NexusCollab

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Fix Code Strings — components/stage/scene-sidebar.tsx

**Files:**
- Modify: `components/stage/scene-sidebar.tsx:129`

- [ ] **Step 1: Replace OpenMAIC logo image with NexusCollab brand**

On line 129, change:
```tsx
<img src="/logo-horizontal.png" alt="OpenMAIC" className="h-6" />
```
To:
```tsx
<img src="/brand/logo-mark.svg" alt="NexusCollab" className="h-6" />
```

- [ ] **Step 2: Commit**

```bash
git add components/stage/scene-sidebar.tsx && git commit -m "fix: replace OpenMAIC logo with NexusCollab brand

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Fix Code Strings — configs/storage.ts

**Files:**
- Modify: `configs/storage.ts`

- [ ] **Step 1: Read the full file to understand context**

```bash
head -50 configs/storage.ts
```

- [ ] **Step 2: Replace MAIC branding with NexusCollab**

Replace in the file:
- `MAIC_DISCARDED_DB` → `NEXUSCOLLAB_DISCARDED_DB`
- `MAIC-OSS` → `NEXUSCOLLAB`
- `MAIC Platform Technical Constraints` → `NexusCollab Platform Technical Constraints`
- `MAIC Local Database` → `NexusCollab Local Database`
- `MAIC-Database` → `NexusCollab-Database`
- `MAICDatabase` → `NexusCollabDatabase`
- `DATABASE_NAME = 'MAIC-Database'` → `DATABASE_NAME = 'NexusCollab-Database'`

All other code logic remains the same — only string/identifier renames.

- [ ] **Step 3: Commit**

```bash
git add configs/storage.ts && git commit -m "chore: rename MAIC DB references to NexusCollab

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 8: Fix Code Strings — lib/pbl/types.ts

**Files:**
- Modify: `lib/pbl/types.ts`

- [ ] **Step 1: Read the file, then replace MAIC references in comments**

Replace all occurrences of `MAIC` (case-insensitive) in comment text only — not in actual TypeScript types or variable names unless they reference the old MAIC naming specifically.

- [ ] **Step 2: Commit**

```bash
git add lib/pbl/types.ts && git commit -m "chore: remove MAIC references from PBL types comments

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 9: Fix Code Strings — lib/utils/database.ts

**Files:**
- Modify: `lib/utils/database.ts`

- [ ] **Step 1: Read the file, then replace MAIC references in comments**

Replace `MAIC` in comment text only.

- [ ] **Step 2: Commit**

```bash
git add lib/utils/database.ts && git commit -m "chore: remove MAIC references from database utils

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 10: Fix Code Strings — requirements-to-outlines system.md

**Files:**
- Modify: `lib/generation/prompts/templates/requirements-to-outlines/system.md`

- [ ] **Step 1: Read the file, replace MAIC/OpenMAIC in prompt text**

The prompt template text may reference "MAIC" as the platform name. Replace with "NexusCollab" where appropriate in the system prompt content.

- [ ] **Step 2: Commit**

```bash
git add lib/generation/prompts/templates/requirements-to-outlines/system.md && git commit -m "chore: update prompt template to reference NexusCollab

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 11: Create Empty State Illustrations Component

**Files:**
- Create: `components/ui/empty-state.tsx`

- [ ] **Step 1: Create the empty-state component with inline SVG illustrations**

```tsx
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'tasks' | 'messages' | 'evaluations';
  className?: string;
}

const content = {
  tasks: {
    heading: 'No tasks yet',
    subtext: 'Create your first task to get started',
  },
  messages: {
    heading: 'No messages yet',
    subtext: 'Be the first to contribute to this discussion',
  },
  evaluations: {
    heading: 'No evaluations yet',
    subtext: 'Evaluations will appear here once the AI reviews contributions',
  },
} as const;

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" />
      <path d="M19 13l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L17 15l1.5-.5-.5-1.5z" />
    </svg>
  );
}

function TasksIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Clipboard base */}
      <rect x="20" y="14" width="40" height="52" rx="4" />
      {/* Clipboard top */}
      <path d="M30 14V10a4 4 0 018 0v4" />
      <rect x="28" y="10" width="24" height="6" rx="2" />
      {/* Checkboxes */}
      <rect x="28" y="28" width="10" height="10" rx="2" />
      <path d="M30.5 33l2 2 4-4" />
      <path d="M42 33h10" />
      <rect x="28" y="44" width="10" height="10" rx="2" />
      <path d="M30.5 49l2 2 4-4" />
      <path d="M42 49h10" />
      {/* Sparkle */}
      <SparkleIcon className="absolute -top-1 -right-1 w-5 h-5 text-slate-400" />
    </svg>
  );
}

function MessagesIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Main bubble */}
      <path d="M14 20a6 6 0 016-6h36a6 6 0 016 6v24a6 6 0 01-6 6H30l-8 8V46a6 6 0 01-6-6V20z" />
      {/* Bubble tail */}
      <path d="M22 46l-6 8v-4a6 6 0 016-6" />
      {/* Lines in bubble */}
      <path d="M26 30h20" />
      <path d="M26 38h14" />
      {/* Sparkle */}
      <SparkleIcon className="absolute -top-1 -right-1 w-5 h-5 text-slate-400" />
    </svg>
  );
}

function EvaluationsIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Chart axes */}
      <path d="M16 60V20" />
      <path d="M16 60h44" />
      {/* Bars */}
      <rect x="22" y="44" width="8" height="16" rx="2" />
      <rect x="36" y="32" width="8" height="28" rx="2" />
      <rect x="50" y="22" width="8" height="38" rx="2" />
      {/* Sparkle */}
      <SparkleIcon className="absolute -top-1 -right-1 w-5 h-5 text-slate-400" />
    </svg>
  );
}

const icons = {
  tasks: TasksIcon,
  messages: MessagesIcon,
  evaluations: EvaluationsIcon,
} as const;

export function EmptyState({ type, className }: EmptyStateProps) {
  const { heading, subtext } = content[type];
  const Icon = icons[type];

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12 text-center', className)}>
      <div className="relative w-20 h-20 text-slate-400">
        <Icon />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{heading}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{subtext}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/empty-state.tsx && git commit -m "feat: add empty state illustration component

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 12: Rewrite README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Rewrite README.md**

Replace the entire file with:

```markdown
<p align="center">
  <img src="/brand/logo-mark.svg" alt="NexusCollab" width="64"/>
</p>

<p align="center">
  <strong>NexusCollab</strong> — Enterprise AI Task Review Platform
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPL--3.0-blue.svg?style=flat-square" alt="License: AGPL-3.0"/></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

## Overview

NexusCollab is an enterprise AI-powered platform for team task review and collaborative evaluation. It combines structured task management with AI-driven performance insights, enabling teams to track contributions, run AI evaluations, and measure participation across workspace projects.

### Highlights

- **Task Chat Rooms** — Structured discussion spaces tied to each task with real-time messaging
- **AI Evaluations** — Automated performance reviews powered by configurable AI agents
- **Role-Based Access Control** — Admin, Manager, and Member roles with scoped permissions per workspace
- **Analytics Dashboard** — Participation metrics, score distributions, and peer comparisons

---

## Quick Start

### Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10
- **PostgreSQL** database

### 1. Clone & Install

```bash
git clone <repo-url>
cd nexuscollab
pnpm install
```

### 2. Configure

```bash
cp .env.example .env.local
```

Fill in your database URL and at least one LLM provider key:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nexuscollab"
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Database Setup

```bash
pnpm prisma migrate dev
```

### 4. Run

```bash
pnpm dev
```

Open **http://localhost:3000** and create your first workspace.

---

## Architecture

```
Workspace
  └── Task
        └── Chat Room
              └── Messages
              └── Evaluations (AI-generated per member)
```

Each workspace has dedicated tasks, each task has a chat room for discussion and an evaluation pipeline that generates AI-powered performance reviews for participants.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL + Prisma ORM |
| UI | React 19, Tailwind CSS 4, Radix UI |
| State | Zustand |
| AI | OpenAI, Anthropic, Google Gemini (via SDK) |

---

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).
```

- [ ] **Step 2: Commit**

```bash
git add README.md && git commit -m "docs: rewrite README.md for NexusCollab

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 13: Final Verification Scan

- [ ] **Step 1: Run grep to verify no remaining OpenMAIC/THU branding remains**

```bash
grep -ri "openmaic\|OpenMAIC\|THU-MAIC\|maic" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" --include="*.md" --include="*.yml" --exclude-dir=node_modules --exclude-dir=.git .
```

Expected: No results (except legitimate model IDs like `THUDM/` which are provider model names, not branding).

Also verify no remaining academic avatars:
```bash
ls public/avatars/
```
Expected: Only `user.svg` and `assistant.svg`.

- [ ] **Step 2: If any hits found, fix them and commit separately.**

- [ ] **Step 3: Final commit if verification passed.**

```bash
git commit --allow-empty -m "chore: verify no remaining OpenMAIC branding

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Spec Coverage Check

| Spec Section | Tasks |
|-------------|-------|
| 4.1 Codebase Cleanup — package.json | Task 2 |
| 4.1 Codebase Cleanup — docker-compose.yml | Task 3 |
| 4.1 Codebase Cleanup — .env.example | Task 4 |
| 4.1 Codebase Cleanup — CONTRIBUTING.md | Task 5 |
| 4.1 Codebase Cleanup — code strings | Tasks 6-10 |
| 4.1 Codebase Cleanup — file deletions | Task 1 |
| 4.4 Empty State Illustrations | Task 11 |
| 4.6 Final README | Task 12 |
| Final verification | Task 13 |

All spec items covered. No placeholder steps, no TODOs.
