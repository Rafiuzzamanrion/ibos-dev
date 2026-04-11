# Online Assessment Platform

A full-stack Online Assessment Platform built with Next.js (App Router), MongoDB, NextAuth.js, Redux Toolkit, and ShadCN UI. Features employer and candidate panels with real-time exam taking, behavioral tracking, and offline answer persistence.

## Live Demo

> [https://ibos-dev.vercel.app/](https://ibos-dev.vercel.app/)

## Repository

> [https://github.com/Rafiuzzamanrion/ibos-dev](https://github.com/Rafiuzzamanrion/ibos-dev)

## Video Walkthrough

> [https://drive.google.com/file/d/1GuWHBUYxTTEtVH660usdNB2Imx6Z1JdH/view?usp=sharing](https://drive.google.com/file/d/1GuWHBUYxTTEtVH660usdNB2Imx6Z1JdH/view?usp=sharing)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js v4 (CredentialsProvider)
- **State Management**: Redux Toolkit
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **UI Components**: ShadCN UI (Radix Nova style)
- **Styling**: Tailwind CSS v4
- **Offline Storage**: IndexedDB via `idb`

## Features

### Employer Panel
- Secure login with role-based authentication
- Dashboard with exam cards showing candidate/question/slot counts
- Multi-step test creation (Basic Info → Questions)
- Question modal supporting MCQ, Checkbox, and Text question types
- View candidate submissions with scores and behavioral metrics

### Candidate Panel
- Secure login with separate candidate sessions
- Dashboard showing available published exams
- Timed exam screen with countdown timer
- Support for Radio, Checkbox, and Text answer types
- Behavioral tracking (tab switches, fullscreen exits)
- Auto-submit on timer expiry
- Manual submit with confirmation dialog
- Completion and timeout screens

### Backend
- RESTful API routes with session-based authorization
- Mongoose models with proper references and validation
- Automatic score calculation with negative marking support
- Cached MongoDB connection pattern

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```
MONGODB_URI=mongodb://localhost:27017/assessment-platform
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=/api
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Demo Credentials

You can use the following credentials to test the application:

**Employer / Admin**
- Email: `employer@test.com`
- Password: `password123`

**Candidate**
- Email: `candidate@test.com`
- Password: `password123`

## Project Structure

```
src/
├── app/           # Next.js App Router pages and API routes
├── components/    # React components (ui, employer, candidate, shared)
├── hooks/         # Custom React hooks
├── lib/           # Database, auth, and axios configuration
├── models/        # Mongoose models
├── store/         # Redux Toolkit store and slices
├── types/         # TypeScript type definitions
├── schemas/       # Zod validation schemas
└── utils/         # Utility functions
```

## MCP Integration

**Figma MCP** can be used to directly read component specs, spacing values, and color tokens from the Figma design file into the codebase. This eliminates manual pixel measurement and ensures design fidelity. By connecting to the Figma API through MCP, component dimensions, padding, margins, font sizes, and color values can be extracted programmatically and mapped directly to Tailwind utility classes or CSS custom properties.

**Supabase MCP** could serve as an alternative backend, replacing MongoDB with Supabase's PostgreSQL database. Supabase MCP would allow direct database queries, real-time subscriptions for live exam monitoring, and built-in authentication — reducing the need for NextAuth and custom API routes.

**Chrome DevTools MCP** can be used to programmatically audit performance metrics (Lighthouse scores, Core Web Vitals) and accessibility compliance (WCAG standards). This enables automated CI/CD pipeline checks ensuring every deployment meets performance and accessibility benchmarks.

## AI Tools Used

- **Claude Code** was used for scaffolding the folder structure, writing boilerplate code for models/routes/components, and debugging TypeScript type issues across the full stack.
- **GitHub Copilot** provided inline autocomplete suggestions for repetitive patterns like form field definitions, Redux slice actions, and API error handling.
- **Claude (claude.ai)** was used for architecture decisions such as the offline storage strategy, behavioral tracking implementation, and planning the multi-step form state management approach.

## Offline Mode

The platform implements offline answer persistence using **IndexedDB** via the `idb` library:

1. **Auto-save**: Every answer change is debounced (500ms) and saved to IndexedDB under the key `exam_answers_draft`.
2. **Auto-restore**: When the exam screen mounts, it checks for previously saved answers in IndexedDB. If found, answers are restored to the Redux store and a toast notification confirms restoration.
3. **Auto-submit on reconnect**: A `window.addEventListener("online", ...)` listener detects when the browser regains connectivity. If the timer has already expired and the exam hasn't been submitted, it automatically submits the saved answers.
4. **Cleanup**: After a successful submission, the IndexedDB draft is cleared to prevent stale data on subsequent exams.

This ensures candidates don't lose progress during temporary network disruptions or browser crashes.
