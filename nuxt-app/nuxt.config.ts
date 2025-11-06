// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // App configuration
  app: {
    head: {
      title: 'ShipFree - Nuxt 4 SaaS Boilerplate',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Build and ship your SaaS faster with ShipFree' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
    },
  },

  // Supabase configuration
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: ['/'],
    },
  },

  // Runtime configuration
  runtimeConfig: {
    // Private keys (server-side only)
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    lemonSqueezyApiKey: process.env.LEMON_SQUEEZY_API_KEY,
    lemonSqueezyStoreId: process.env.LEMON_SQUEEZY_STORE_ID,
    mailgunApiKey: process.env.MAILGUN_API_KEY,
    mailgunDomain: process.env.MAILGUN_DOMAIN,
    mailgunFromEmail: process.env.MAILGUN_FROM_EMAIL,
    databaseUrl: process.env.DATABASE_URL,

    // Public keys (exposed to client)
    public: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      appName: 'ShipFree',
      domainName: 'https://shipfree.idee8.agency',
    }
  },

  // Nitro configuration for API routes
  nitro: {
    preset: 'node-server',
  },

  // CSS configuration
  css: ['~/assets/css/globals.css'],

  // Tailwind configuration
  tailwindcss: {
    cssPath: '~/assets/css/globals.css',
    configPath: 'tailwind.config',
    exposeConfig: false,
    viewer: true,
  },
})
