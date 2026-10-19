# 🤖 ChatGPT Streaming Clone

> A production-grade, full-stack ChatGPT clone built with **Next.js 16**, featuring token-by-token real-time streaming, persistent multi-turn conversations, and a rich rendering engine for Markdown, LaTeX, and Mermaid diagrams.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk)](https://clerk.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

| Feature | Details |
|---|---|
| ⚡ **Real-Time Streaming** | Token-by-token AI responses via **Vercel AI SDK v7** — near-zero perceived latency |
| 💬 **Persistent Conversations** | Full multi-turn thread history stored in PostgreSQL, survives page reloads |
| 📌 **Thread Management** | Create, pin, archive, and delete chat threads |
| 🎨 **Rich Render Engine** | Live rendering of **GitHub Flavored Markdown**, **LaTeX** math, **Mermaid** diagrams, and syntax-highlighted code blocks via `streamdown` |
| 🔒 **Secure Authentication** | Complete sign-up / sign-in flows powered by **Clerk** (social + email/password) |
| 🗄️ **Relational Data Model** | Prisma ORM over PostgreSQL with cascading deletes, optimised indexes, and per-thread model overrides |
| 🌙 **Dark Mode UI** | Sleek, dark-first layout built with **Tailwind CSS v4**, Lucide icons, and fluid micro-animations |
| 🐳 **Docker Ready** | Full `docker-compose` setup spins up the app **and** a PostgreSQL database in one command |

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) · React 19 · TypeScript 5 |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) · `tw-animate-css` · Class Variance Authority |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) · [Base UI](https://base-ui.com/) · Lucide React · Sonner |
| **AI / Streaming** | [Vercel AI SDK v7](https://sdk.vercel.ai/) (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`) |
| **Render Engine** | [streamdown v2](https://github.com/nicolo-ribaudo/streamdown) · `@streamdown/code` · `@streamdown/math` · `@streamdown/mermaid` · `@streamdown/cjk` |
| **Database & ORM** | PostgreSQL 16 · [Prisma ORM v7](https://www.prisma.io/) · `@prisma/adapter-pg` |
| **Authentication** | [Clerk v7](https://clerk.com/) (`@clerk/nextjs`) |
| **State / Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/latest) |
| **Containerisation** | Docker · Docker Compose |

---

## 📁 Project Structure

```
chatgpt_streaming_app/
├── app/
│   ├── (auth)/               # Sign-in & sign-up pages (Clerk)
│   ├── (root)/               # Main authenticated workspace
│   │   └── c/[id]/           # Active conversation page
│   └── api/
│       └── chat/             # POST endpoint — streams AI tokens
├── components/
│   ├── ui/                   # Base UI primitives (shadcn-style)
│   └── provider/             # App-wide context providers (TanStack Query, Themes)
├── features/
│   ├── ai/                   # AI SDK helpers, system prompts
│   ├── auth/                 # Clerk hooks & user sync
│   ├── conversation/         # Thread list, CRUD operations, sidebar
│   └── messages/             # Message rendering, streaming status
├── prisma/
│   ├── schema.prisma         # Data models (User, Conversation, Message)
│   └── migrations/           # Migration history
├── lib/                      # Shared utilities, Prisma client, helpers
├── hooks/                    # Custom React hooks
├── public/                   # Static assets
├── Dockerfile                # Multi-stage production build
├── docker-compose.yml        # App + PostgreSQL orchestration
└── .env.example              # Environment variable template
```

---

## 🗄️ Data Model

```
User ──< Conversation ──< Message
```

| Model | Key Fields |
|---|---|
| `User` | `id`, `clerkId` (unique), `email`, `firstname`, `lastname`, `imageUrl` |
| `Conversation` | `id`, `title`, `model` (per-thread override), `systemPrompt`, `isPinned`, `isArchived`, `lastMessageAt` |
| `Message` | `id`, `role` (`USER`\|`ASSISTANT`\|`SYSTEM`\|`TOOL`), `status` (`PENDING`\|`COMPLETE`\|`ERROR`), `content`, `parts` (JSON), `metadata` (JSON) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v20+**
- [pnpm](https://pnpm.io/) **v10+**
- A running **PostgreSQL** database (or use Docker — see below)
- A [Clerk](https://clerk.com/) developer account
- An [OpenAI](https://platform.openai.com/) API key

---

### Option A — Local Development

**1. Clone the repository**

```bash
git clone https://github.com/Mahesh0426/ChatGPT_Streaming_Clone.git
cd chatgpt_streaming_app
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Configure environment variables**

Copy the template and fill in your values:

```bash
cp .env.example .env
```

```env
# ── Database ───────────────────────────────────────────────────────────────────
DATABASE_URL="postgresql://username:password@localhost:5432/chatgpt_clone"

# ── Docker Compose Postgres (only needed when using docker-compose) ────────────
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_strong_password_here
POSTGRES_DB=chatgpt_clone

# ── Clerk Authentication ────────────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# ── OpenAI ─────────────────────────────────────────────────────────────────────
OPENAI_API_KEY=sk-proj-...
```

**4. Push the database schema**

```bash
pnpm prisma db push
# or, for migration-tracked environments:
pnpm prisma migrate dev --name init
```

**5. Start the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

---

### Option B — Docker Compose (App + Database)

Spin up both the Next.js application and a PostgreSQL 16 database with a single command:

**1. Copy and fill in the environment file**

```bash
cp .env.example .env
# Edit .env — set POSTGRES_PASSWORD, CLERK keys, and OPENAI_API_KEY
```

**2. Build and start all services**

```bash
docker compose up --build
```

The app will be available at [http://localhost:3000](http://localhost:3000).
PostgreSQL data is persisted in a named Docker volume (`chatgpt_clone_postgres_data`).

**3. Stop services**

```bash
docker compose down
# To also remove the database volume:
docker compose down -v
```

---

## ⚡ Available Commands

| Command | Description |
|:---|:---|
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Build the application for production |
| `pnpm start` | Start the built production server |
| `pnpm lint` | Run ESLint checks |
| `pnpm prisma generate` | Regenerate the Prisma client from the schema |
| `pnpm prisma db push` | Push schema changes directly to the database (no migration file) |
| `pnpm prisma migrate dev` | Create and apply a new migration (development) |
| `pnpm prisma migrate deploy` | Apply pending migrations (production / CI) |
| `pnpm prisma studio` | Open Prisma's visual database browser |

---

## 🔐 Environment Variables Reference

| Variable | Required | Description |
|:---|:---:|:---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `POSTGRES_USER` | Docker only | Postgres username for docker-compose |
| `POSTGRES_PASSWORD` | Docker only | Postgres password for docker-compose |
| `POSTGRES_DB` | Docker only | Database name for docker-compose |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk public key (baked into JS bundle) |
| `CLERK_SECRET_KEY` | ✅ | Clerk secret key (server-side only) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | ✅ | Sign-in redirect path (e.g. `/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | ✅ | Sign-up redirect path (e.g. `/sign-up`) |
| `OPENAI_API_KEY` | ✅ | OpenAI API key for chat completions |

### GitHub Actions deployment secrets

To enable deployments from pushes to `main`, add the following repository
secrets under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|:---|:---|
| `VPS_HOST` | VPS hostname or IP address |
| `VPS_USER` | SSH username on the VPS |
| `SSH_KEY` | Private SSH key authorized on the VPS |
| `VPS_APP_DIR` | Absolute path to the cloned application directory on the VPS |
| `POSTGRES_USER` | PostgreSQL username |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `POSTGRES_DB` | PostgreSQL database name |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `OPENAI_API_KEY` | OpenAI API key |

The deploy job checks that all of these secrets are present and reports missing
names before attempting to connect to the VPS. Secret values are never printed.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feat/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with ❤️ by <a href="https://github.com/Mahesh0426">Mahesh Kunwar</a></p>
