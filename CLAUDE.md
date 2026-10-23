# ShipFree - AI Agent Onboarding Guide

## Overview

ShipFree is a production-ready Next.js boilerplate designed to help developers ship startups quickly. It's a free, open-source alternative to ShipFast, built with modern web technologies and best practices.

### Key Characteristics
- **Framework**: Next.js  with App Router
- **Runtime**: Bun (package manager and runtime)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better-Auth with multiple OAuth providers
- **Payments**: Multi-provider support (Stripe, Polar, Lemon Squeezy, Creem, AgentaOS)
- **Email**: Multi-provider support (Resend, Postmark, Plunk, Nodemailer)
- **UI**: TailwindCSS 4, BaseUI components, Shadcn-style patterns
- **Internationalization**: next-intl (i18n) with support for en, es, fr
- **Monitoring**: Sentry integration
- **Storage**: Cloudflare R2 support

## Architecture

### Project Structure

Application code lives under `src/`. The path alias `@/*` maps to `src/*` (e.g. `@/lib/auth` is `src/lib/auth`).

```
ShipFree/
├── src/                    # Application source
│   ├── app/                # Next.js App Router pages and routes
│   │   ├── [locale]/       # Internationalized routes
│   │   │   ├── (auth)/     # Authentication pages (login, register, etc.)
│   │   │   ├── (main)/     # Main app pages (dashboard, etc.)
│   │   │   └── (site)/     # Marketing/landing pages
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Better-Auth endpoints
│   │   │   ├── payments/   # Payment processing
│   │   │   └── webhooks/   # Webhook handlers
│   │   └── _providers/     # React context providers
│   ├── components/         # Reusable React components
│   │   ├── emails/        # Email templates (React Email)
│   │   └── ui/            # BaseUI/Shadcn UI components
│   ├── config/            # Configuration files
│   │   ├── env.ts        # Environment variable validation (t3-env)
│   │   ├── payments.ts   # Payment plans and pricing
│   │   ├── branding.ts   # Brand configuration
│   │   └── feature-flags.ts
│   ├── database/          # Database schema and connection
│   │   ├── schema.ts     # Drizzle ORM schema
│   │   └── index.ts      # Database connection
│   ├── lib/               # Core libraries and utilities
│   │   ├── auth/         # Authentication setup
│   │   ├── payments/     # Payment service and adapters
│   │   ├── messaging/    # Email service and providers
│   │   ├── storage.ts    # Cloudflare R2 storage client
│   │   └── utils/        # Utility functions
│   ├── i18n/              # Internationalization configuration
│   │   ├── routing.ts    # Routing configuration
│   │   └── request.ts    # Request configuration
│   ├── messages/          # Translation files (JSON format)
│   │   ├── en.json
│   │   ├── fr.json
│   │   └── es.json
│   └── hooks/             # React hooks
├── scripts/               # Runtime scripts (e.g. migrate.ts)
├── migrations/            # Drizzle migrations
├── drizzle.config.ts      # Drizzle Kit config
└── instrumentation*.ts    # Sentry and Next.js instrumentation
```

### Key Patterns

#### 1. **Server Components by Default**
- Most components are Server Components unless marked with `'use client'`
- Client components are used for interactivity (forms, state, etc.)

#### 2. **Route Groups**
- `(auth)`, `(main)`, `(site)` are route groups for organization
- They don't affect URL structure but organize layouts

#### 3. **Internationalization**
- All routes are under `[locale]` dynamic segment
- Supported languages: `en`, `es`, `fr`
- Use `next-intl` for translations
- Server components: Use `getTranslations` from `next-intl/server`
- Client components: Use `useTranslations` hook from `next-intl`

#### 4. **Environment Configuration**
- All env vars validated via `@t3-oss/env-nextjs` in `src/config/env.ts`
- Server-only vars in `server` object
- Client-accessible vars in `client` object (prefixed with `NEXT_PUBLIC_`)

## Code Style

### TypeScript

- **Strict mode**: Enabled
- **Path aliases**: `@/*` maps to `src/*`
- **No implicit any**: Enabled

### React Patterns

1. **Component Naming**: PascalCase
2. **File Naming**: kebab-case for files, PascalCase for components
3. **Hooks**: Prefix with `use`
4. **Event Handlers**: Prefix with `handle` (e.g., `handleClick`)
5. **Const over function**: Prefer `const fn = () => {}` over `function fn() {}`

### Styling

- **TailwindCSS**: Primary styling method
- **No CSS files**: Avoid custom CSS, use Tailwind classes
- **Class utilities**: Use `cn()` from `src/lib/utils/css.ts` (or `@/lib/utils/css.ts`) for conditional classes

## Common Tasks

### Adding a New Page

1. Create file in `src/app/[locale]/(group)/page.tsx`
2. Add metadata export if needed
3. Use appropriate layout group
4. Add translations if needed

### Adding an API Route

1. Create file in `src/app/api/{route}/route.ts`
2. Export `GET`, `POST`, etc. functions
3. Validate input with Zod
4. Handle errors gracefully
5. Return JSON responses

### Adding a Database Table

1. Define schema in `src/database/schema.ts`
2. Add relations if needed
3. Generate migration: `bun run generate-migration`
4. Run migration: `bun run migrate:local`

### Adding a UI Component

1. Use BaseUI components from `src/components/ui/`
2. Follow existing component patterns
3. Add proper TypeScript types
4. Include accessibility attributes
5. Use Tailwind for styling

### Adding Email Template

1. Create template in `src/components/emails/`
2. Use React Email components
3. Add subject in `src/components/emails/subjects.ts`
4. Export render function
5. Use in auth flows or custom emails

## Development Workflow

### Setup

1. Install dependencies: `bun install`
2. Copy `.env.example` to `.env`
3. Set up PostgreSQL database
4. Run migrations: `bun run migrate:local`
5. Start dev server: `bun dev`

### Scripts

- `bun dev`: Start development server
- `bun build`: Build for production
- `bun start`: Start production server
- `bun lint`: Run linter
- `bun format`: Format code
- `bun generate-migration`: Generate DB migration
- `bun migrate:local`: Run migrations locally

### Testing

- No test framework configured yet
- Manual testing recommended
- Use Sentry for error tracking in production

## Important Notes

1. **Bun Runtime**: This project uses Bun, not Node.js
2. **Server Components**: Default to Server Components, use `'use client'` only when needed
3. **Environment Variables**: Always validate via `src/config/env.ts`
4. **Database**: Use Drizzle ORM, not raw SQL
5. **Authentication**: Use Better-Auth client/server APIs, don't access DB directly
6. **Payments**: Use payment service, don't call providers directly
7. **Email**: Use email mailer, don't call providers directly
8. **Internationalization**: All user-facing text should be translatable
9. **Error Handling**: Always handle errors gracefully with proper messages
10. **Type Safety**: Leverage TypeScript, avoid `any` types

## Resources

- **Better-Auth**: https://better-auth.com
- **Drizzle ORM**: https://orm.drizzle.team
- **Next.js**: https://nextjs.org/docs
- **next-intl**: https://next-intl-docs.vercel.app
- **BaseUI**: https://base-ui.com
