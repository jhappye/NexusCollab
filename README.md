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
