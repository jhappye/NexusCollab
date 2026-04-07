# Phase 4B: Onboarding, Settings & Mobile — Design Spec

Track B covers: onboarding wizard, workspace settings pages, and mobile responsiveness.

---

## 4.2 Onboarding Wizard

### Trigger

Automatic — when a workspace has `onboardingComplete = false` and no tasks exist, the workspace page redirects to `/onboarding?wsId=xxx`.

### Route

`app/(dashboard)/onboarding/page.tsx` — full-page step wizard, replaces workspace page during onboarding.

### Steps

| Step | Title | Fields |
|------|-------|--------|
| 1 | Name your workspace | Name (text input, required), Logo (file upload, optional) |
| 2 | Invite team members | Email input + Add button, list of pending invites below |
| 3 | Configure AI agents | LLM provider (radio: OpenAI/Anthropic/DeepSeek/Gemini), Model (text), API Key (password input) |

### Smart Defaults

The wizard reads which providers are configured via `GET /api/config/providers` which returns `{ providers: string[] }` based on which `XXX_API_KEY` env vars are set server-side. Pre-selects the first configured provider.

### API Routes

**`PATCH /api/workspace/[wsId]`** — update workspace fields:
```json
{
  "name": "string",
  "logoUrl": "string | null",
  "timezone": "string",
  "onboardingComplete": true
}
```

**`POST /api/workspace/[wsId]/invites`** — create invite:
```json
{ "email": "user@example.com" }
```
Returns `{ invites: [{ id, email, createdAt }] }`.

**`GET /api/workspace/[wsId]/invites`** — list pending invites.

**`DELETE /api/workspace/[wsId]/invites/[inviteId]`** — cancel invite.

**`GET /api/config/providers`** — returns which LLM providers have API keys configured.

### Prisma Schema Changes

Add to `Workspace` model:
```prisma
logoUrl            String?
timezone           String   @default("UTC")
onboardingComplete Boolean  @default(false)
```

### On Completion

On final step submit:
1. Mark `onboardingComplete: true` on workspace
2. Redirect to `/workspace/[wsId]`

---

## 4.3 Settings Pages

### Routes

| Route | Purpose |
|-------|---------|
| `app/(dashboard)/workspace/[wsId]/settings/page.tsx` | Redirect to `/general` |
| `app/(dashboard)/workspace/[wsId]/settings/general/page.tsx` | Name, logo, timezone |
| `app/(dashboard)/workspace/[wsId]/settings/members/page.tsx` | Invite, role management, remove |
| `app/(dashboard)/workspace/[wsId]/settings/agents/page.tsx` | Default agent config, model |
| `app/(dashboard)/workspace/[wsId]/settings/billing/page.tsx` | Placeholder |

### Settings Layout Component

`components/workspace/settings-layout.tsx` — shared layout with left sidebar tabs:
```tsx
interface SettingsLayoutProps {
  children: React.ReactNode
  wsId: string
  currentTab: 'general' | 'members' | 'agents' | 'billing'
}
```

Tabs: General, Members (ADMIN only), Agents (ADMIN/MANAGER), Billing (static).

### RBAC on Settings Pages

| Page | Required Role |
|------|-------------|
| General | MANAGER+ |
| Members | ADMIN |
| Agents | ADMIN+ |
| Billing | MANAGER+ (placeholder) |

### General Page

- Workspace name text input
- Logo upload (file input, uploads to `/api/upload` or similar)
- Timezone select (list of common timezones: UTC, America/New_York, Europe/London, Asia/Shanghai, etc.)
- Save button → `PATCH /api/workspace/[wsId]`

### Members Page

- Member list table: Avatar, Name, Email, Role (dropdown to change), Joined date, Remove button
- Invite section at top: email input + "Send Invite" button → `POST /api/workspace/[wsId]/invites`
- Remove member → confirmation dialog → `DELETE /api/workspace/[wsId]/members/[userId]`

### Agents Page

- Model provider select (OpenAI/Anthropic/DeepSeek/Gemini)
- Model name text input
- Temperature slider (0–1)
- System prompt textarea
- Save → store in workspace `agentConfig` JSON field

### Billing Page

- Static placeholder card: "Billing integration coming soon" with icon

---

## 4.5 Mobile Responsiveness

### Breakpoint

`md` (768px). Mobile = < 768px.

### Chat Room Tabs

On mobile, `app/(dashboard)/workspace/[wsId]/task/[taskId]/room/page.tsx` uses tabbed layout:

```
[Task Title]
[Brief] [Chat] [Evaluations]
```

- `Brief` tab: task description + participant list
- `Chat` tab: full message list + message input
- `Evaluations` tab: scrollable evaluation cards

On desktop: existing layout unchanged (sidebar + chat area).

### Task List Mobile

On mobile (`app/(dashboard)/workspace/[wsId]/page.tsx`):
- Grid → single column stack
- Filter button (Filters) opens a bottom sheet (Radix `Sheet`) with status filter checkboxes

### Sidebar Mobile

On mobile:
- Sidebar is `display: none` (always)
- Header hamburger button (☰ icon) opens a `Sheet` from left with the sidebar content
- Sheet contains full sidebar nav (not collapsed version)
- Tapping outside closes the sheet

Implementation: `app/(dashboard)/layout.tsx` adds mobile detection, passes `isMobile` prop to sidebar trigger.

---

## 6. Dependencies

- No new npm packages needed (Radix UI Sheet and existing components handle everything)

---

## 7. File Checklist

### New Files
- [ ] `app/(dashboard)/onboarding/page.tsx`
- [ ] `app/(dashboard)/workspace/[wsId]/settings/page.tsx`
- [ ] `app/(dashboard)/workspace/[wsId]/settings/general/page.tsx`
- [ ] `app/(dashboard)/workspace/[wsId]/settings/members/page.tsx`
- [ ] `app/(dashboard)/workspace/[wsId]/settings/agents/page.tsx`
- [ ] `app/(dashboard)/workspace/[wsId]/settings/billing/page.tsx`
- [ ] `components/workspace/settings-layout.tsx`
- [ ] `app/api/workspace/[wsId]/invites/route.ts`
- [ ] `app/api/workspace/[wsId]/invites/[inviteId]/route.ts`
- [ ] `app/api/config/providers/route.ts`

### Modified Files
- [ ] `prisma/schema.prisma` — add Workspace fields (logoUrl, timezone, onboardingComplete)
- [ ] `app/(dashboard)/workspace/[wsId]/page.tsx` — redirect to onboarding if not complete, add mobile filter bottom sheet
- [ ] `app/(dashboard)/workspace/[wsId]/task/[taskId]/room/page.tsx` — add mobile tabbed layout
- [ ] `app/(dashboard)/layout.tsx` — add mobile sidebar drawer
- [ ] `components/layout/sidebar.tsx` — export as reusable for mobile drawer

### API Changes
- [ ] `app/api/workspace/[wsId]/route.ts` — support PATCH with new fields + onboardingComplete
