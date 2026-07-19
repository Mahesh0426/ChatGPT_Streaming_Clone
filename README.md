# 🤖 ChatGPT Streaming Clone

A modern, highly responsive, and feature-rich ChatGPT clone featuring real-time message streaming, conversation history persistence, and comprehensive markdown/LaTeX/Mermaid rendering.

---

## 🌟 Key Features

- **⚡ Real-Time Streaming:** Ultra-low latency, token-by-token message streaming using the Vercel AI SDK.
- **📂 Thread Management:** Persistent, multi-turn chat conversations. Create, pin, archive, and delete chat threads.
- **🎨 Rich Render Engine:** Powered by `streamdown` to support real-time rendering of:
  - GitHub Flavored Markdown.
  - Interactive **Mermaid** diagrams.
  - Math formulas and equations (**LaTeX**).
  - Syntax-highlighted code blocks.
- **🔒 Secure Authentication:** Complete user registration and sign-in flows powered by Clerk.
- **💾 Database Persistence:** Relational data model managed via Prisma ORM and PostgreSQL.
- **🌓 Sleek UI/UX:** Stunning dark-mode layout optimized with Tailwind CSS, Lucide icons, and fluid micro-animations.

---

## 🛠️ Tech Stack

| Layer                       | Technology                                                                              |
| :-------------------------- | :-------------------------------------------------------------------------------------- |
| **Frontend Framework**      | [Next.js 16 (App Router)](https://nextjs.org/) & React 19                               |
| **Styling**                 | [Tailwind CSS v4](https://tailwindcss.com/), Class Variance Authority, tw-animate-css   |
| **AI Integration**          | [Vercel AI SDK](https://sdk.ai.byvercel.com/) (`ai`, `@ai-sdk/openai`, `@ai-sdk/react`) |
| **Database & ORM**          | PostgreSQL & [Prisma ORM](https://www.prisma.io/)                                       |
| **Authentication**          | [Clerk](https://clerk.com/)                                                             |
| **Markdown / Code Parsing** | [Streamdown](https://github.com/)                                                       |
| **State Management**        | [TanStack React Query v5](https://tanstack.com/query/latest)                            |

---

## 🚀 Getting Started

### 📋 Prerequisites

Before running the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [pnpm](https://pnpm.io/) (v10 or higher recommended)
- A running [PostgreSQL](https://www.postgresql.org/) database
- A [Clerk](https://clerk.com/) developer account
- An [OpenAI](https://openai.com/) API key

---

### 🔧 Setup & Installation

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/Mahesh0426/ChatGPT_Streaming_Clone.git
    cd chatgpt_streaming_app
    ```

2.  **Install Dependencies:**

    ```bash
    pnpm install
    ```

3.  **Environment Variables Setup:**
    Create a `.env` file in the root directory of the project and fill in your keys:

    ```env
    # Database URL for Prisma (PostgreSQL)
    DATABASE_URL="postgresql://username:password@localhost:5432/chatgpt_clone?schema=public"

    # Clerk Authentication Keys
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

    # OpenAI API Key for Streaming Generation
    OPENAI_API_KEY=sk-proj-...
    ```

4.  **Database Migration & Prisma Client Generation:**
    Sync your database schema and generate the local Prisma Client:

    ```bash
    pnpm prisma db push
    ```

5.  **Run the Development Server:**

    ```bash
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.

---

## 📁 Directory Structure

```text
├── app/                  # Next.js App Router (Layouts, Pages, Routes)
│   ├── (auth)/           # Authentication routes (Sign In / Sign Up)
│   ├── (root)/           # Main chat application workspace
│   │   └── c/[id]/       # Individual active conversation page
│   └── api/              # API endpoints (e.g., chat streaming)
├── components/           # Shared reusable components
│   ├── ui/               # Base UI elements (Shadcn-like primitives)
│   └── provider/         # App-wide context providers
├── features/             # Feature-driven modular workspace
│   ├── ai/               # AI SDK helpers and prompts
│   ├── auth/             # Clerk integrations and user management
│   ├── conversation/     # Chat threads, list view, operations
│   └── messages/         # Individual messages rendering & status
├── prisma/               # Database schemas & migrations
└── lib/                  # Shared utilities & database clients
```

---

## ⚡ Key Commands

- `pnpm dev` - Start the Next.js development server.
- `pnpm build` - Build the application for production.
- `pnpm start` - Start the built production server.
- `pnpm lint` - Run ESLint checks.
- `pnpm prisma init ` - Initialize the Prisma database.
- `pnpm prisma generate` - Generate the Prisma client from the schema.
- `pnpm prisma migrate dev` - Sync the local database schema with the changes in the schema.
- `pnpm prisma studio` - Run Prisma's visual database viewer.

---
