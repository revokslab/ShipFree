# ⚡ ShipFree V2

Hi there! 👋

ShipFree is a free alternative to ShipFast, designed to simplify and optimize your shipping process. It’s built using modern web technologies like Next.js, Bun, Stripe, Drizzle ORM, Postgres and Tailwindcss.

## Features

- SEO Optimization
- User authentication with Better-Auth
- Stripe, Polar, Autumn Billing, Dodo Payments, Commet and Creem integration
- Email messaging via Resend, Postmark, Plunk, and Nodemailer
- Modern UI built with Next.js, TailwindCSS, and BaseUI
- Bun as runtime and package manager
- Drizzle ORM and Postgres for database operations
- Internationalization (i18n) with next-intl supporting English, French, and Spanish

## Docs

For full documentation, visit: [ShipFree Docs](https://shipfree.revoks.dev/docs)

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## Contributing

For people who want to contribute, please refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## Internationalization (i18n) Navigation

ShipFree includes internationalization support using `next-intl` with automatic locale routing. The template supports English (`en`), French (`fr`), and Spanish (`es`) out of the box.

### Navigation Components and Hooks

The `i18n/navigation.ts` file exports internationalized versions of Next.js navigation components and hooks that automatically handle locale prefixes:

- **`Link`** - Internationalized Link component that automatically prefixes routes with the current locale
- **`redirect`** - Server-side redirect function that preserves locale
- **`usePathname`** - Hook that returns the pathname without the locale prefix
- **`useRouter`** - Hook for programmatic navigation with locale support

### Usage Examples

#### Using the Link Component

```tsx
import { Link } from '@/i18n/navigation'

// Automatically includes locale prefix (e.g., /en/about, /fr/about)
<Link href="/about">About</Link>

// Switch to a different locale
<Link href="/about" locale="fr">À propos</Link>
```

#### Using Navigation Hooks

```tsx
'use client'

import { useRouter, usePathname } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

export function MyComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  // Navigate to a route (automatically includes locale)
  const handleClick = () => {
    router.push('/dashboard')
  }

  // Switch locale for current page
  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div>
      <p>Current locale: {locale}</p>
      <p>Current pathname: {pathname}</p>
      <button onClick={handleClick}>Go to Dashboard</button>
      <button onClick={() => switchLanguage('fr')}>Switch to French</button>
    </div>
  )
}
```

#### Using Translations

```tsx
// Server Component
import { getTranslations } from 'next-intl/server'

export default async function ServerPage() {
  const t = await getTranslations('MyPage')
  return <h1>{t('title')}</h1>
}

// Client Component
'use client'
import { useTranslations } from 'next-intl'

export default function ClientPage() {
  const t = useTranslations('MyPage')
  return <h1>{t('title')}</h1>
}
```



### Adding New Locales

To add a new locale:

1. Add the locale to `i18n/routing.ts`:
   ```ts
   locales: ['en', 'fr', 'es', 'de'], // Add 'de' for German
   ```

2. Create a translation file in `messages/`:
   ```json
   // messages/de.json
   {
     "PRICING": "Preise"
   }
   ```

3. Update the `localeNames` object in `components/language-switcher.tsx`:
   ```tsx
   const localeNames: Record<string, string> = {
     en: 'English',
     fr: 'Français',
     es: 'Español',
     de: 'Deutsch', // Add German
   }
   ```

### Route Structure

All routes are automatically prefixed with the locale:
- `/` or `/en` → English homepage
- `/fr` → French homepage
- `/es` → Spanish homepage
- `/en/about` → English about page
- `/fr/about` → French about page

The default locale (`en`) uses the `as-needed` prefix strategy, meaning it doesn't show the locale prefix in the URL when it's the default language.

## Removing Premium Purchase Feature

This template includes a premium purchase feature that allows users to buy the Premium version of ShipFree. This feature is **completely isolated** from the template's payment system and can be easily removed if you don't need it.

### What is the Premium Purchase Feature?

The premium purchase feature is used to sell the Premium template itself ($90 one-time payment). It includes:
- Stripe Checkout integration for one-time payments
- Success page that collects GitHub email and Twitter handle
- Discord invite link display after purchase
- Client-side purchase tracking via localStorage

**Important:** This is separate from the template's built-in payment system (Stripe, Polar, Lemon Squeezy, Creem, AgentaOS) which is used by your application to accept payments from your customers.

### How to Remove

To completely remove the premium purchase feature:

1. **Delete the following folders:**
   - `app/api/premium-purchase/`
   - `app/api/webhooks/premium-purchase/` (if created)
   - `app/[locale]/(site)/premium-purchase/`

2. **Delete the following files:**
   - `lib/premium-purchase.ts`
   - `lib/premium-purchase/hooks.ts`
   - `app/[locale]/(site)/pricing/premium-button.tsx`

3. **Update `app/[locale]/(site)/pricing.tsx`:**
   - Remove the import: `import { PremiumButton } from './pricing/premium-button'`
   - Replace `<PremiumButton />` with a regular button or remove the button handler
   - Look for the comment: `// Premium template purchase - can be removed if not needed`

4. **Remove environment variables from `config/env.ts`:**
   - Remove all variables with `PREMIUM_PURCHASE_` prefix:
     - `PREMIUM_PURCHASE_STRIPE_SECRET_KEY` (server)
     - `PREMIUM_PURCHASE_STRIPE_PRICE_ID` (server)
     - `PREMIUM_PURCHASE_STRIPE_WEBHOOK_SECRET` (server, optional)
     - `NEXT_PUBLIC_PREMIUM_PURCHASE_STRIPE_PUBLISHABLE_KEY` (client)
     - `NEXT_PUBLIC_PREMIUM_PURCHASE_DISCORD_INVITE_LINK` (client)

5. **Remove from `.env` file:**
   - Remove all `PREMIUM_PURCHASE_*` environment variables

6. **Remove webhook endpoint (if configured):**
   - Remove the webhook endpoint from your Stripe Dashboard pointing to `/api/webhooks/premium-purchase`

After removal, the template's payment functionality (for your customers) will continue to work normally. The premium purchase feature is completely decoupled and does not affect any other features.

---

Cooked for you with ❤️ by [Revoks](https://revoks.dev)
