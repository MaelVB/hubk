# hubk

A Kubernetes-friendly app portal that lists and launches applications accessible to the logged-in user. The monorepo uses Turborepo + pnpm workspaces with a NestJS API and Next.js web UI.

## Architecture

The API follows standard NestJS modules/controllers/services, while the IdP-specific adapters live in shared packages to keep a light hexagonal boundary:

- **Apps module**: `apps/api/src/apps` (controllers/services + TypeORM entities)
- **Auth module**: `apps/api/src/auth` (guard + auth service)
- **IdP adapters**: `packages/idp-authentik` (Authentiik-specific implementation of ports)
- **Ports**: `packages/auth-core` (IdP ports + adapter types)

Only adapters know about IdP-specific claim names. The API consumes normalized claims and generic IdP ports.

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

- `apps/api/.env` controls database + OIDC validation + optional IdP apps endpoint
- `apps/web/.env` controls NextAuth + OIDC login

## Adding a new IdP adapter

1. Implement the ports from `@hubk/auth-core` in a new package (e.g. `packages/idp-keycloak`).
2. Export a factory that returns an `IdpAdapter` with `claims`, `jwtVerifier`, and `apps` implementations.
3. Update `apps/api/src/auth/auth.module.ts` to use the new factory.

## Scripts

- `pnpm dev` – run web + api in parallel
- `pnpm build` – build packages
- `pnpm lint` – run linting
