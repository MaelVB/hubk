# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-01-01

### 🔒 Security Improvements
- **Fixed SQL injection vulnerability** in `apps.service.ts` - Corrected `orWhere` logic that could cause false access matches
- Added `ValidationPipe` globally in NestJS for input validation
- Created `SECURITY.md` with security best practices

### ✨ Features
- **Enhanced error handling** - Frontend now displays user-friendly error messages with retry functionality
- **Icon placeholders** - Beautiful gradient placeholders with initials when app icons are missing
- **SEO optimization** - Added proper `<Head>` tags with titles and meta descriptions
- **Accessibility improvements** - Added ARIA labels and roles throughout the application

### 🎨 UI/UX Improvements
- Added error message styling with clear visual feedback
- Improved icon display with consistent sizing
- Better loading states and error recovery

### 📝 Documentation
- Created comprehensive `DEPLOYMENT.md` with step-by-step deployment guide
- Enhanced `README.md` with badges, features list, and better structure
- Added `SECURITY.md` with security guidelines
- Improved `.gitignore` for better file exclusion

### 🔧 Technical Improvements
- Enhanced `next-auth.d.ts` type definitions for better TypeScript support
- Fixed type safety issues in `apps.service.ts`
- Better environment variable documentation
- Improved CSS organization with dedicated classes for new features

### 📦 Configuration
- Verified all environment variables are properly configured in `docker-compose.yml`
- Updated `.env.example` with better documentation
- Added proper CORS configuration notes

### 🐛 Bug Fixes
- Fixed TypeScript compilation errors in apps service
- Corrected access rule query logic to prevent unauthorized access
- Fixed missing error handling in API calls

## Initial Release

### Features
- OAuth2/OIDC authentication via Authentik
- Role-based access control (Groups and Roles)
- NestJS backend API with TypeORM
- Next.js frontend with NextAuth.js
- Docker Compose setup for easy deployment
- Monorepo structure with Turborepo
- PostgreSQL database integration
