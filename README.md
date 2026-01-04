# Hubk - Application Hub Portal

> 🚀 A modern, Kubernetes-friendly application hub portal that integrates with your IdP (Authentik) to provide a centralized hub for accessing all your applications. Acts as the entry point for your applications, with your identity provider as the source of truth.

[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

## ✨ Features

- 🔐 **OAuth2/OIDC Authentication**
- 🎯 **Role-Based Access Control** - Show apps based on user groups/roles
- 🎨 **Clean Modern UI** - Beautiful card-based interface
- 🔄 **Real-time Sync** - Automatically syncs with Authentik applications
- 🏗️ **Monorepo Architecture** - Turborepo + pnpm workspaces
- 🐳 **Docker Ready** - Easy deployment with Docker Compose
- ☸ **Kubernetes Ready** - Easy deployment with Kustomize

## 🏛️ Architecture

The application follows a clean architecture with hexagonal design principles:

- **Apps module**: `apps/api/src/apps` (controllers/services + TypeORM entities)
- **Auth module**: `apps/api/src/auth` (guard + auth service)
- **IdP adapters**: `packages/idp-authentik` (Authentik-specific implementation of ports)
- **Ports**: `packages/auth-core` (IdP ports + adapter types)
- **Shared types**: `packages/shared` (Common types across frontend/backend)

### Technology Stack

**Backend (API)**
- NestJS - Progressive Node.js framework
- TypeORM - ORM for PostgreSQL
- Jose - JWT verification

**Frontend (Web)**
- Next.js - React framework
- NextAuth.js - Authentication for Next.js
- TypeScript - Type safety

**Database**
- PostgreSQL 15 (optional)

## 📦 Project Structure

```
hubk/
├── apps/
│   ├── api/          # NestJS backend API
│   └── web/          # Next.js frontend
├── packages/
│   ├── auth-core/    # Authentication ports (interfaces)
│   ├── idp-authentik/# Authentik adapter implementation
│   ├── shared/       # Shared types
│   ├── eslint-config/# Shared ESLint config
│   └── tsconfig/     # Shared TypeScript config
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose or Kubernetes

### Installation

1. **Clone and install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Authentik configuration
   ```

3. **Start with Docker Compose (Recommended)**
   ```bash
   docker-compose up -d
   ```
   
   Or run services individually:
   ```bash
   # Start PostgreSQL only
   docker-compose up postgres -d
   
   # Run in development mode
   pnpm dev
   ```

4. **Access the application**
   - 🌐 Frontend: http://localhost:3000
   - 🔌 API: http://localhost:3001

## 📖 Documentation

- [**Deployment Guide**](./docs/DEPLOYMENT.md) - Complete production deployment instructions
- [**Security Best Practices**](./docs/SECURITY.md) - Security guidelines and recommendations

## 🔧 Configuration

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed configuration options.

**Key Environment Variables:**
- `OIDC_ISSUER` - Your Authentik issuer URL
- `OIDC_CLIENT_ID` / `OIDC_CLIENT_SECRET` - OAuth2 credentials
- `NEXTAUTH_SECRET` - NextAuth.js secret (generate with `openssl rand -base64 32`)
- Root `.env` controls shared configuration
- Environment variables are passed via docker-compose.yml

## 🔌 Adding a New IdP Adapter

The architecture supports multiple identity providers through adapters:

1. Create a new package (e.g. `packages/idp-keycloak`)
2. Implement the ports from `@hubk/auth-core`:
   - `IdpClaimsPort` - Claims normalization
   - `JwtVerifierPort` - JWT verification
   - `IdpAppsPort` - Apps listing
3. Export a factory that returns an `IdpAdapter`
4. Update `apps/api/src/auth/auth.module.ts` to use the new factory

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run web + api in parallel (development mode) |
| `pnpm build` | Build all packages |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm test` | Run tests (when implemented) |

## 🐛 Troubleshooting

See [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting) for common issues and solutions.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ for Kubernetes clusters
