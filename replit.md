# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Build**: esbuild (CJS bundle)

## Artifacts

### Corpus Fest Website (`artifacts/corpus-fest`)
- **Type**: react-vite, mounted at `/`
- **Purpose**: Annual medical college sports & cultural fest website
- **Fonts**: Cormorant Garamond (display/serif) + DM Sans (body/UI)
- **Key features**:
  - Hero: warm cream background, Asclepius statue blended (multiply), Cormorant Garamond italic title
  - Scrolling previous events cards carousel
  - Scroll-driven SVG anatomical brain (3D CSS perspective animation) with 4 regions → event categories
  - On desktop WebGL: Three.js procedural brain with anatomical warm-pink colors
  - Events section with 4 tabs: Sports, Arts, Academic, Fun (20+ events)
  - Day-by-day schedule (Kaizen-inspired)
  - Working registration form → POST /api/register
  - About Corpus section below Schedule
  - Full hamburger menu overlay
  - No emojis — professional icons/typography only
- **Events data**: 13 sports + arts + academic + fun events
- **Brain regions**: Frontal→Academic/Arts, Parietal→Racket/Court Sports, Cerebellum→Field/Track, Temporal→Performance Arts
- **Color palette**: #0a0a0a deep black, #f5f0e8 warm cream, #c9a96e gold accent, #1a0e04 dark brown

### API Server (`artifacts/api-server`)
- **Type**: api, port 8080
- **Routes**:
  - `GET /api/health` — health check
  - `POST /api/register` — registration form submission (stores to `registrations.json`, sends emails via Resend if configured)
  - `GET /api/registrations` — view all registrations (requires `x-admin-token` header)
- **Registration data stored at**: `artifacts/api-server/registrations.json`

## Email Setup (Registration)

To enable email confirmation:
1. Get a Resend API key from resend.com (free tier: 100 emails/day)
2. Set the `RESEND_API_KEY` environment secret
3. Set `ORGANIZER_EMAIL` to your email (default: ayushxbaranda@gmail.com)

Without `RESEND_API_KEY`, registrations are still saved to `registrations.json` — no email is sent, but data is preserved.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-server run dev` — run API server locally (port 8080)
- `pnpm --filter @workspace/corpus-fest run dev` — run corpus fest website
- `pnpm --filter @workspace/corpus-fest install` — install frontend packages (three.js etc.)

## Vite Proxy

The corpus-fest Vite dev server proxies `/api` → `http://localhost:8080` so registration form calls work in development.
