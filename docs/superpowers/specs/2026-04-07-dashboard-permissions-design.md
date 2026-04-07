# Phase 3: Dashboard & Permissions — Design Spec

## Overview

Implementing three related features: role-based access control (RBAC), an analytics dashboard, and a notification system.

---

## 1. RBAC Middleware

### Auth Strategy

User identity is passed via `X-User-Id` header. Each API route reads this header and looks up the user's workspace membership + role.

**Files:**
- `lib/auth/session.ts` — reads `X-User-Id` header, returns current user ID or null
- `lib/auth/rbac.ts` — `requireRole(wsId, role)` middleware factory

### Role Hierarchy

| Role | Permissions |
|------|-------------|
| `ADMIN` | Create tasks, manage members, configure agents, view all evaluations, trigger evaluations |
| `MANAGER` | Create tasks, trigger evaluations, view all evaluations |
| `MEMBER` | Join task rooms, send messages, view own evaluations only |

### requireRole Middleware

```typescript
// lib/auth/rbac.ts
type WorkspaceRole = 'admin' | 'manager' | 'member'

function requireRole(wsId: string, role: WorkspaceRole): NextMiddleware
```

Middleware flow:
1. Extract `X-User-Id` from headers
2. If missing → return 401
3. Lookup `WorkspaceMember` for (wsId, userId)
4. If not found → return 403
5. Check role hierarchy (ADMIN ≥ MANAGER ≥ MEMBER)
6. If insufficient role → return 403
7. Attach `{ userId, role, workspaceId }` to request context and call next

### Protected Routes

| Route | Required Role |
|-------|-------------|
| `POST /api/workspaces/[wsId]/tasks` | MANAGER+ |
| `POST /api/evaluation` | MANAGER+ |
| `GET /api/workspace/[wsId]/analytics` | MANAGER+ |
| `GET /api/workspace/[wsId]/analytics/members` | MANAGER+ |
| `GET /api/workspace/[wsId]/members` | ADMIN |
| `PATCH/DELETE /api/workspace/[wsId]/members/[userId]` | ADMIN |
| `GET /api/workspace/[wsId]/analytics/my-history` | MEMBER+ (own data only) |
| `GET /api/notifications` | MEMBER+ (own data only) |

---

## 2. Analytics Dashboard

### Route

`app/(dashboard)/workspace/[wsId]/analytics/page.tsx`

### Data Fetching

Three API endpoints:

1. **`GET /api/workspace/[wsId]/analytics`** — overview stats (all roles that can view)
   ```json
   {
     "totalTasks": number,
     "activeParticipants": number,
     "evaluationsRun": number,
     "avgScore": number
   }
   ```

2. **`GET /api/workspace/[wsId]/analytics/members`** — leaderboard (MANAGER+)
   ```json
   {
     "members": [
       {
         "id": string,
         "name": string,
         "avatarUrl": string | null,
         "avgScore": number,
         "participationRate": number,
         "tasksCompleted": number
       }
     ]
   }
   ```

3. **`GET /api/workspace/[wsId]/analytics/my-history`** — personal history (MEMBER, own data only)
   ```json
   {
     "history": [
       { "date": string, "score": number, "taskTitle": string }
     ],
     "evaluations": [
       { "id": string, "taskTitle": string, "score": number, "dimensions": Json, "summary": string, "createdAt": string }
     ],
     "percentile": number
   }
   ```

### Admin/Manager View Components

1. **Overview cards** — 2x2 grid: Total Tasks, Active Participants, Evaluations Run, Avg Score
2. **Participation rate bar chart** — `recharts/BarChart`, X=task titles, Y=% participants who messaged
3. **Score distribution histogram** — `recharts/BarChart`, X=buckets (0-20, 21-40, 41-60, 61-80, 81-100), Y=member count
4. **Agent activity timeline** — `recharts/LineChart`, X=date, Y=evaluation count, separate lines per agent role
5. **Member leaderboard table** — sortable columns: Name, Avg Score, Participation %, Tasks Completed

### Member View Components

1. **Score history line chart** — `recharts/LineChart`, X=date, Y=score, dots at each evaluation
2. **Evaluation summaries** — expandable cards showing task title, score, summary, and dimension breakdown
3. **Peer comparison** — text: "You are in the top X% of participants" (anonymized, no raw peer scores)

### UI Layout

```
| [Back to Workspace]                                    [Notification Bell]
|
| Analytics
| ==========================================================
|
| [Overview Cards Grid]
| [Participitation Chart]    [Score Distribution]
| [Agent Timeline]
| [Leaderboard Table]
```

For members, show only personal charts and evaluation list.

---

## 3. Notification System

### Prisma Model

```prisma
model Notification {
  id        String            @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  data      Json?
  isRead    Boolean           @default(false)
  createdAt DateTime          @default(now())

  @@index([userId, isRead, createdAt])
}

enum NotificationType {
  EVALUATION_RECEIVED
  MENTIONED_IN_CHAT
  TASK_STATUS_CHANGED
  TASK_ASSIGNED
}
```

### API Routes

1. **`GET /api/notifications`** — list user's notifications
   - Query: `?page=1&limit=20&unreadOnly=false`
   - Returns: `{ notifications: Notification[], total: number, unreadCount: number }`

2. **`PATCH /api/notifications/[id]`** — mark single notification as read
   - Returns: `{ success: true }`

3. **`POST /api/notifications/mark-all-read`** — mark all user's notifications as read
   - Returns: `{ success: true, updatedCount: number }`

### Notification Bell Component

`components/notifications/notification-bell.tsx`

**Props:**
```typescript
interface NotificationBellProps {
  className?: string
}
```

**Behavior:**
- Shows bell icon with red badge if `unreadCount > 0`
- Click opens popover with notification list
- Each notification: icon (based on type), title, message preview, timestamp
- Click notification → mark as read + navigate to relevant page (from `data` field)
- "Clear all" button in popover header
- Polls `/api/notifications` every 60 seconds when popover is open

**Notification type icons:**
- `EVALUATION_RECEIVED` → star icon
- `MENTIONED_IN_CHAT` → @ mention icon
- `TASK_STATUS_CHANGED` → status change icon
- `TASK_ASSIGNED` → task plus icon

### Triggering Notifications

| Event | Trigger Location | Notification |
|-------|-----------------|--------------|
| Evaluation created | `app/api/evaluation/route.ts` | `EVALUATION_RECEIVED` to `targetUserId` |
| User mentioned in message | Message creation in chat room | `MENTIONED_IN_CHAT` to mentioned user(s) |
| Task status changed | Task status update API | `TASK_STATUS_CHANGED` to all task participants |
| New task assigned | Task creation API (if applicable) | `TASK_ASSIGNED` to assigned users |

---

## 4. Database Updates

### New Models

- `Notification` + `NotificationType` enum in `prisma/schema.prisma`

### Modified APIs

- `app/api/evaluation/route.ts` — create notification after evaluation created
- `app/api/task/[taskId]/room/messages/route.ts` — parse @mentions, create notifications
- `app/api/task/[taskId]/route.ts` — on status change, create notifications

### New API Routes

- `app/api/workspace/[wsId]/analytics/route.ts` — overview stats
- `app/api/workspace/[wsId]/analytics/members/route.ts` — leaderboard
- `app/api/workspace/[wsId]/analytics/my-history/route.ts` — personal history
- `app/api/notifications/route.ts` — list notifications
- `app/api/notifications/[id]/route.ts` — mark as read
- `app/api/notifications/mark-all-read/route.ts` — mark all read

---

## 5. Dependencies

- Install `recharts` for charts
- No other new dependencies required

---

## 6. File Checklist

### New Files
- [ ] `lib/auth/session.ts`
- [ ] `lib/auth/rbac.ts`
- [ ] `app/api/workspace/[wsId]/analytics/route.ts`
- [ ] `app/api/workspace/[wsId]/analytics/members/route.ts`
- [ ] `app/api/workspace/[wsId]/analytics/my-history/route.ts`
- [ ] `app/api/notifications/route.ts`
- [ ] `app/api/notifications/[id]/route.ts`
- [ ] `app/api/notifications/mark-all-read/route.ts`
- [ ] `app/(dashboard)/workspace/[wsId]/analytics/page.tsx`
- [ ] `components/notifications/notification-bell.tsx`

### Modified Files
- [ ] `prisma/schema.prisma` — add Notification model
- [ ] `app/api/evaluation/route.ts` — add notification creation
- [ ] `app/api/task/[taskId]/room/messages/route.ts` — add @mention parsing
- [ ] `app/api/task/[taskId]/route.ts` — add status change notifications
- [ ] `app/(dashboard)/workspace/[wsId]/page.tsx` — add analytics link in header
- [ ] `components/workspace/WorkspaceHeader.tsx` — add nav links

### Install Dependencies
- [ ] `pnpm add recharts`
