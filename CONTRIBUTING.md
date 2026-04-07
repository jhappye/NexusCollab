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
