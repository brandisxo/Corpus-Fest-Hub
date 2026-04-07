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
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Corpus Fest Website (`artifacts/corpus-fest`)
- **Type**: react-vite, mounted at `/`
- **Purpose**: Annual medical college sports & cultural fest website
- **Key features**:
  - Hero with Asclepius statue blended (myhealthprac color palette + style)
  - Scrolling previous events carousel
  - "What If" scroll-driven text animation section
  - Interactive 3D SVG brain (scroll-driven, no WebGL dependency) with 4 regions → event categories
  - Events section with tabs: Sports, Arts, Academic, Fun
  - Day-by-day schedule (Kaizen-inspired)
  - Registration form
  - Full hamburger menu overlay
- **Events data**: 13 sports (running, chess, table tennis, kho kho, kabbadi, shot put, etc.) + arts + academic + fun
- **Brain regions**: Cerebrum→Academic, Cerebellum→Racket Sports, Brainstem→Endurance, Frontal→Performance
- **Color palette**: myhealthprac: #0a0a0a deep black, #fafaf8 off-white, #c9a96e gold accent, warm cream/beige

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/corpus-fest run dev` — run corpus fest website locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
