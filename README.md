# hubk

A Kubernetes-friendly app portal that lists and launches applications accessible to the logged-in user. The monorepo uses Turborepo + pnpm workspaces with a NestJS API and Next.js web UI.

## Architecture

A light hexagonal/clean architecture is used in the API:

- **Domain**: core entities (`apps/api/src/domain`)
- **Application**: use-cases and ports (`apps/api/src/application`)
- **Adapters**: infrastructure + web (`apps/api/src/adapters`)
  - `adapters/auth` contains IdP/JWT implementations
  - `adapters/repositories` contains TypeORM repository adapters

Only adapters know about IdP-specific claim names. The rest of the API consumes normalized claims.

## Local development

### Requirements

- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL)

### Setup

```bash
pnpm install
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### Start Postgres via Docker

```bash
docker compose up postgres
```

### Run the stack

```bash
pnpm dev
```

Alternatively, you can run everything via Docker:

```bash
docker compose up
```

## Environment variables

- `apps/api/.env` controls database + OIDC validation
- `apps/web/.env` controls NextAuth + OIDC login

## Adding a new IdP adapter

1. Implement `IdpClaimsPort` from `@hubk/auth-core` with a new adapter in `apps/api/src/adapters/auth`.
2. Map the IdP-specific claim names to the normalized claims shape (`NormalizedUserClaims`).
3. Swap the adapter in `AppModule` providers.

## Scripts

- `pnpm dev` – run web + api in parallel
- `pnpm build` – build packages
- `pnpm lint` – run linting
