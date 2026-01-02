# Deployment Guide

## Prerequisites

- Docker and Docker Compose
- Authentik instance configured
- PostgreSQL database (included in docker-compose)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo>
   cd hubk
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Authentik configuration
   ```

3. **Start the services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OIDC_ISSUER` | Authentik issuer URL | `https://auth.example.com/application/o/hubk/` |
| `OIDC_CLIENT_ID` | OAuth2 client ID | `hubk-web` |
| `OIDC_CLIENT_SECRET` | OAuth2 client secret | `your-secret-here` |
| `NEXTAUTH_SECRET` | NextAuth.js secret (min 32 chars) | Generate with `openssl rand -base64 32` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OIDC_JWKS_URL` | Custom JWKS endpoint | `{OIDC_ISSUER}/.well-known/jwks.json` |
| `OIDC_APPS_ENDPOINT` | Authentik apps API endpoint | None |
| `OIDC_SCOPES` | OAuth2 scopes | `openid profile email groups` |
| `TYPEORM_SYNCHRONIZE` | Auto-sync database schema | `false` (⚠️ Never `true` in production) |

## Authentik Configuration

### 1. Create an OAuth2/OIDC Provider

1. Go to **Applications** → **Providers**
2. Create a new **OAuth2/OpenID Provider**
3. Configure:
   - **Name**: `hubk-provider`
   - **Client Type**: Confidential
   - **Redirect URIs**: `http://localhost:3000/api/auth/callback/oidc`
   - **Scopes**: `openid`, `profile`, `email`, `groups`

### 2. Create an Application

1. Go to **Applications** → **Applications**
2. Create a new application
3. Configure:
   - **Name**: `Hubk Portal`
   - **Slug**: `hubk`
   - **Provider**: Select the provider created above

### 3. Note Your Configuration

- **Issuer**: `https://your-authentik.com/application/o/hubk/`
- **Client ID**: Copy from provider settings
- **Client Secret**: Copy from provider settings

## Database Setup

The application uses TypeORM with PostgreSQL. The database schema is automatically created when `TYPEORM_SYNCHRONIZE=true` in development.

### Tables

- **apps**: Application definitions
- **access_rules**: Role/Group-based access rules

### Adding Applications Manually

```sql
-- Add an application
INSERT INTO apps (id, slug, name, description, "iconUrl", "targetUrl", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'grafana',
  'Grafana',
  'Monitoring and observability',
  'https://grafana.com/static/img/logos/grafana_icon.svg',
  'https://grafana.example.com',
  NOW(),
  NOW()
);

-- Add access rule (group-based)
INSERT INTO access_rules (id, "claimType", "claimValue", "appId")
VALUES (
  gen_random_uuid(),
  'GROUP',
  'admins',
  (SELECT id FROM apps WHERE slug = 'grafana')
);
```

## Production Deployment

### Security Checklist

- [ ] Set `TYPEORM_SYNCHRONIZE=false`
- [ ] Use strong, unique secrets
- [ ] Enable HTTPS for all services
- [ ] Configure proper CORS origins
- [ ] Use a reverse proxy (nginx, Traefik)
- [ ] Enable database backups
- [ ] Set up monitoring and logging
- [ ] Review the SECURITY.md file

### Docker Compose for Production

Update the `docker-compose.yml`:

```yaml
services:
  api:
    environment:
      WEB_ORIGIN: https://apps.your-domain.com
      TYPEORM_SYNCHRONIZE: "false"
      # ... other production settings

  web:
    environment:
      NEXTAUTH_URL: https://apps.your-domain.com
      NEXT_PUBLIC_API_BASE_URL: https://api.your-domain.com
      # ... other production settings
```

## Troubleshooting

### Authentication fails
- Verify Authentik redirect URIs match your deployment URL
- Check OIDC_ISSUER ends with a trailing slash
- Ensure client secret is correct

### Applications not showing
- Check database for apps and access_rules
- Verify user has correct groups/roles in Authentik
- Check API logs for errors

### CORS errors
- Ensure WEB_ORIGIN matches your frontend URL
- Verify API is accessible from the frontend

## Development

### Install dependencies
```bash
pnpm install
```

### Run in development mode
```bash
pnpm dev
```

### Build for production
```bash
pnpm build
```

## Support

For issues and questions, please open a GitHub issue.
