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

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Dkhoon Emirates Store (`artifacts/dkhoon-store`)
- Arabic luxury perfume e-commerce clone of dkhoonemirates.com
- React + Vite frontend with RTL (right-to-left) layout
- Dark theme with gold/amber accents
- Arabic-first bilingual interface (Arabic + English)
- Pages: Home (hero, categories, featured, new arrivals, bestsellers), Products listing, Product detail, Cart, Categories
- Uses Noto Naskh Arabic and Amiri fonts from Google Fonts
- Cart state persisted via local storage / CartContext

### API Server (`artifacts/api-server`)
- Express 5 REST API at `/api`
- Routes: `/api/products`, `/api/categories`, `/api/featured`, `/api/cart`, `/api/healthz`

## Database Schema
- `categories` — product categories with Arabic names
- `products` — perfume/bukhoor products with Arabic names, prices in AED
- `banners` — hero banner content
- `cart_items` — shopping cart items keyed by session ID

## Seeded Data
- 5 categories: Bukhoor, Men Perfumes, Women Perfumes, Cosmetics, Gift Sets
- 15 Arabic perfume products with realistic AED pricing
- 3 hero banners
