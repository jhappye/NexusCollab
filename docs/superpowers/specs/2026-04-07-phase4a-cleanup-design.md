# Phase 4A: Polish & De-OpenMAIC Cleanup — Design Spec

Track A covers straightforward cleanup tasks: search/replace branding, empty state SVGs, and README rewrite. No complex feature design needed.

---

## 4.1 Codebase Cleanup

### Search & Replace

Replace all occurrences of: `maic`, `MAIC`, `OpenMAIC`, `THU-MAIC`

| File | Action |
|------|--------|
| `package.json` | Replace `name: "openmaic"` → `"nexuscollab"`, update description |
| `CONTRIBUTING.md` | Remove THU/OpenMAIC references, update project name |
| `docker-compose.yml` | Remove maic/THU references from comments |
| `.env.example` | Keep API key names; remove/replace maic-specific comments |
| `README.md` | Full rewrite (see 4.6) |

### Files to Delete

| Path | Reason |
|------|--------|
| `skills/openmaic/` | OpenMAIC-specific skill directory |
| `README-zh.md` | Chinese README tied to OpenMAIC brand |
| `community/feishu.md` | Feishu community link specific to OpenMAIC |
| `assets/banner.png` | OpenMAIC banner image |
| `assets/logo-horizontal.png` | OpenMAIC logo |
| `assets/*.gif` | All OpenMAIC demo screenshots |
| `public/avatars/student*.svg` | Academic avatars (student1, student2, student3) |
| `public/avatars/teacher*.svg` | Academic avatars (teacher, teacher-2) |
| `public/avatars/clown*.svg` | Academic avatar |
| `public/avatars/scholar.svg` | Academic avatar |
| `public/avatars/note-taker*.png` | Academic avatars |
| `public/avatars/dreamer.svg` | Academic avatar |
| `public/avatars/curious*.svg` | Academic avatars |
| `public/avatars/thinker*.svg` | Academic avatars |
| `public/avatars/reader.svg` | Academic avatar |
| `public/avatars/explorer.svg` | Academic avatar |
| `public/avatars/creative.svg` | Academic avatar |
| `public/avatars/builder.svg` | Academic avatar |
| `public/logos/mineru.png` | MinerU logo (academic PDF parsing) |

### Files to Keep

- `public/logos/openai.svg`, `anthropic.svg`, `gemini.svg`, `deepseek.svg`, `grok.svg`, `kling.svg`, `siliconflow.svg`, `elevenlabs.svg`, etc. (provider logos — not academic)
- `public/brand/logo.svg`, `logo-mark.svg`, `favicon.svg` (NexusCollab brand — already correct)
- `public/avatars/user.svg`, `avatars/assistant.svg` (generic, non-academic)

### Code Comments & Strings

Run case-insensitive grep across all `app/` and `lib/` for remaining `maic`, `OpenMAIC`, `MAIC` strings in:
- UI text / error messages
- Comments and console.log statements

---

## 4.4 Empty State Illustrations

### Component: `components/ui/empty-state.tsx`

```typescript
interface EmptyStateProps {
  type: 'tasks' | 'messages' | 'evaluations'
  className?: string
}
```

### Types

| type | SVG Concept | Heading | Subtext |
|------|-------------|---------|---------|
| `tasks` | Checklist + sparkle star | "No tasks yet" | "Create your first task to get started" |
| `messages` | Speech bubble + star | "No messages yet" | "Be the first to contribute to this discussion" |
| `evaluations` | Bar chart + star | "No evaluations yet" | "Evaluations will appear here once the AI reviews contributions" |

### SVG Style

- ViewBox: `0 0 80 80`
- Stroke: `currentColor` (inherits text-muted-foreground)
- Stroke width: 1.5
- Fill: none
- Rounded line caps
- Minimal geometric style (not detailed illustration)

---

## 4.6 Final README

### Structure

```markdown
# NexusCollab

One-line description: Enterprise AI Task Review Platform

## Features
- Task Chat Rooms
- AI-Powered Evaluations
- Role-Based Access Control
- Analytics Dashboard

## Quick Start

### Prerequisites
- Node.js >= 20, pnpm >= 10, PostgreSQL

### 1. Install
git clone <repo> && cd nexuscollab && pnpm install

### 2. Configure
cp .env.example .env.local
# Fill in LLM provider API keys (OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.)

### 3. Database
pnpm prisma migrate dev

### 4. Run
pnpm dev

## Architecture

Workspace → Tasks → Chat Rooms → Evaluations

## Tech Stack
Next.js 16, React 19, TypeScript, Prisma, PostgreSQL, Tailwind CSS 4

## License
AGPL-3.0 (see LICENSE file)
```

### Remove Completely
- All JCST paper citations
- OpenClaw integration section
- Classroom/slide/quiz generation features
- Vercel/THU-MIAC deploy badges
- "OpenMAIC" anywhere in docs

---

## Implementation Order

1. Run grep to find all remaining `maic`/`OpenMAIC`/etc. strings
2. Delete academic-specific files
3. Update `package.json`
4. Update `CONTRIBUTING.md`
5. Update `.env.example`
6. Create `components/ui/empty-state.tsx` with SVG illustrations
7. Rewrite `README.md`
8. Delete `README-zh.md`
9. Run `grep` again to catch any misses

---

## File Checklist

### Delete
- [ ] `skills/openmaic/` (entire directory)
- [ ] `README-zh.md`
- [ ] `community/feishu.md`
- [ ] `assets/banner.png`
- [ ] `assets/logo-horizontal.png`
- [ ] `assets/*.gif`
- [ ] `public/avatars/student*.svg`, `teacher*.svg`, `clown*.svg`, etc. (academic avatars)
- [ ] `public/logos/mineru.png`

### Modify
- [ ] `package.json` — name, description
- [ ] `CONTRIBUTING.md` — remove OpenMAIC/THU references
- [ ] `docker-compose.yml` — remove THU references
- [ ] `.env.example` — clean up comments
- [ ] `README.md` — full rewrite

### Create
- [ ] `components/ui/empty-state.tsx` — SVG empty state illustrations
