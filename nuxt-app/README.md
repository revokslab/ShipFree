# ShipFree - Nuxt 4 Version

> 🚀 **This is a complete migration of ShipFree from Next.js 15 to Nuxt 4**

A full-stack SaaS boilerplate built with Nuxt 4, Vue 3, Supabase, Stripe, and Tailwind CSS. Ship your startup in days, not weeks!

## ✨ Features

- ⚡ **Nuxt 4** - Latest version with full TypeScript support
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔐 **Supabase Authentication** - Email, Magic Link, and OAuth (Google)
- 💳 **Payments** - Stripe & LemonSqueezy integration
- 📧 **Email** - Mailgun for transactional emails
- 🗃️ **Database** - PostgreSQL with Drizzle ORM
- 🎯 **UI Components** - Radix Vue components with CVA
- 📱 **Responsive Design** - Mobile-first approach
- 🔒 **Protected Routes** - Middleware-based authentication
- 🚀 **API Routes** - Server-side API with Nitro

## 🛠️ Tech Stack

- **Framework:** Nuxt 4
- **UI:** Vue 3 + Composition API
- **Styling:** Tailwind CSS
- **Authentication:** Supabase
- **Payments:** Stripe + LemonSqueezy
- **Email:** Mailgun
- **Database:** PostgreSQL + Drizzle ORM
- **Icons:** Lucide Vue
- **Components:** Radix Vue

## 📦 Installation

### Prerequisites

- Node.js 20+
- pnpm 9+ (recommended)
- PostgreSQL database
- Supabase account
- Stripe account (optional)
- Mailgun account (optional)

### Setup

1. **Clone and navigate to the Nuxt app:**

```bash
cd nuxt-app
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Copy environment variables:**

```bash
cp .env.example .env
```

4. **Configure your .env file:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# LemonSqueezy
LEMON_SQUEEZY_API_KEY=xxx
LEMON_SQUEEZY_STORE_ID=xxx

# Mailgun
MAILGUN_API_KEY=xxx
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_FROM_EMAIL=noreply@yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

5. **Run database migrations (if needed):**

```bash
pnpm drizzle-kit push:pg
```

6. **Start development server:**

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy
```

## 📁 Project Structure

```
nuxt-app/
├── assets/
│   └── css/
│       └── globals.css          # Global styles + Tailwind
├── components/
│   ├── ui/                      # UI components (Button, Input, Card, etc.)
│   ├── LoginForm.vue
│   └── RegisterForm.vue
├── composables/
│   └── useStripe.ts             # Stripe composable
├── layouts/
│   └── default.vue              # Default layout
├── middleware/
│   └── auth.ts                  # Authentication middleware
├── pages/
│   ├── index.vue                # Home page
│   ├── dashboard.vue            # Protected dashboard
│   └── auth/
│       ├── login.vue
│       └── register.vue
├── server/
│   └── api/
│       ├── stripe/
│       │   ├── checkout.post.ts
│       │   └── webhook.post.ts
│       ├── lemonsqueezy/
│       │   └── webhook.post.ts
│       └── mailgun.post.ts
├── lib/
│   ├── config.ts                # App configuration
│   └── utils.ts                 # Utility functions (cn)
├── utils/
│   └── github.ts                # GitHub API helpers
├── nuxt.config.ts               # Nuxt configuration
├── tailwind.config.ts           # Tailwind configuration
└── package.json
```

## 🔑 Key Differences from Next.js Version

### 1. **Components**
- React → Vue 3 with Composition API
- JSX → Vue Template Syntax
- `useState` → `ref()` / `reactive()`
- `useEffect` → `watch()` / `watchEffect()`
- `useRouter` (Next) → `useRouter` (Vue Router)

### 2. **API Routes**
- Next.js Route Handlers → Nitro Server Handlers
- `NextRequest/NextResponse` → `H3Event`
- `req.json()` → `readBody(event)`

### 3. **Middleware**
- Next.js Middleware → Nuxt Route Middleware
- Different API but similar functionality

### 4. **Authentication**
- Uses `@nuxtjs/supabase` module
- Auto-imports: `useSupabaseClient()`, `useSupabaseUser()`

### 5. **Configuration**
- `next.config.ts` → `nuxt.config.ts`
- Environment variables accessed via `useRuntimeConfig()`

## 📚 Documentation

### Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Get your Project URL and Anon Key
3. Add them to your .env file
4. Enable Email Auth in Supabase Dashboard
5. Configure OAuth providers (optional)

### Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard
3. Create products and prices
4. Set up webhooks pointing to `/api/stripe/webhook`
5. Add webhook secret to .env

### Database Schema

The project uses Drizzle ORM. Schema is located in `db/schema.ts`.

To push schema changes:

```bash
pnpm drizzle-kit push:pg
```

## 🎨 UI Components

All UI components are built with Radix Vue and styled with Tailwind CSS:

- Button
- Input
- Label
- Card (with Header, Title, Description, Content, Footer)
- Tabs (with List, Trigger, Content)
- Avatar (with Image, Fallback)

## 🔐 Authentication Flow

1. User visits `/auth/login` or `/auth/register`
2. Submits credentials via Supabase Auth
3. On success, redirected to `/dashboard`
4. Protected routes check auth via middleware
5. Logout clears session and redirects to login

## 💳 Payment Flow

1. User clicks payment button
2. Frontend calls `/api/stripe/checkout`
3. Server creates Stripe session
4. User completes payment
5. Webhook receives event
6. Server updates database

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own SaaS!

## 🙏 Credits

- Original Next.js version: [ShipFree](https://github.com/idee8/shipfree)
- Migrated to Nuxt 4 by Claude
- Built for makers, by makers

## 🆘 Support

- [Documentation](https://shipfree.idee8.agency/docs)
- [GitHub Issues](https://github.com/idee8/shipfree/issues)
- [Twitter](https://x.com/idee8agency)

---

**Happy Shipping! 🚀**
