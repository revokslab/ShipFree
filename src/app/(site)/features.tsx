'use client'

export default function Features() {
  const features = [
    {
      title: 'Authentication',
      description:
        'Built-in auth with Better Auth. Social logins, email verification, and session management ready to go.',
      logo: '/stack-icons/better-auth.svg',
    },
    {
      title: 'Payments',
      description:
        'Stripe, Polar, Lemon Squeezy, and Creem integrations. Subscriptions, one-time payments, and webhooks configured.',
      logos: ['/stack-icons/stripe.svg', '/stack-icons/polar.svg', '/stack-icons/creem.png'],
    },
    {
      title: 'Database',
      description:
        'Drizzle ORM with PostgreSQL. Migrations, relations, and type-safe queries out of the box.',
      logos: ['/stack-icons/drizzle-orm.svg', '/stack-icons/prisma.svg'],
    },
    {
      title: 'UI Components',
      description:
        'Beautiful, accessible components built with Base UI. Dark mode, animations, and responsive design.',
      logos: ['/stack-icons/tailwindcss.svg', '/stack-icons/base-ui.svg'],
    },
  ]

  const stack = [
    {
      title: 'Analytics',
      description:
        'Analytics with PostHog. Track user behavior, conversions, and product insights out of the box.',
      logo: '/stack-icons/posthog.svg',
    },
    {
      title: 'Emails',
      description:
        'Emails with Resend. Transactional emails, templates, and delivery tracking configured.',
      logo: '/stack-icons/resend.svg',
    },
    {
      title: 'TypeScript',
      description:
        'TypeScript typesafe. Full type safety across your entire stack with zero runtime overhead.',
      logo: '/stack-icons/typescript.svg',
    },
    {
      title: 'Rate Limiting',
      description:
        'Rate limiting with Upstash. Protect your API endpoints and prevent abuse automatically.',
      logo: '/stack-icons/upstash.svg',
    },
    {
      title: 'Vercel AI SDK',
      description:
        'Build AI-powered applications with Vercel AI SDK. Integrate with OpenAI, Anthropic, and more.',
      logo: '/stack-icons/vercel.svg',
    },
    {
      title: 'Internationalization',
      description:
        'Multi-language support with Lingui. Translate your app and reach global audiences.',
    },
    {
      title: 'AI Tools',
      description:
        'Integrating in AI tools like Cursor, Windsurf, Claude Code, and GitHub Copilot for enhanced development.',
      logos: ['/stack-icons/windsurf.svg', '/stack-icons/cursor.svg', '/stack-icons/claude.svg', '/stack-icons/copilot.svg'],
    },
    {
      title: 'And More',
      description:
        'Plus many more production-ready features and integrations to help you ship faster.',
    },
  ]

  return (
    <section id="features" className='py-24 bg-[#F4F4F5]'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6'>
        <h2
          className='text-center text-sm font-medium text-muted-foreground mb-8'
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          FEATURES
        </h2>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-semibold tracking-tight mb-4'>
            Everything you need to ship fast
          </h2>
          <p className='text-lg text-muted-foreground'>
            Production-ready features that save you weeks of setup time
          </p>
        </div>

        <div className='border border-[#E4E4E7] rounded-none overflow-hidden bg-transparent'>
          <div className='grid grid-cols-4 grid-rows-3 h-full'>
            {[...features, ...stack].map((item, index) => (
                <div
                  key={index}
                  className={`p-6 bg-transparent flex flex-col ${
                  index % 4 !== 3 ? 'border-r border-[#E4E4E7]' : ''
                } ${
                  index < 8 ? 'border-b border-[#E4E4E7]' : ''
                }`}
              >
                {item.logo && !item.logos && (
                  <div className='mb-3 flex items-center gap-2'>
                    <img
                      src={item.logo}
                      alt={item.title}
                      className='h-10 w-10 object-contain'
                    />
                  </div>
                )}
                {item.logos && (
                  <div className='mb-3 flex items-center gap-2 flex-wrap'>
                    {item.logos.map((logo, logoIndex) => (
                      <img
                        key={logoIndex}
                        src={logo}
                        alt={item.title}
                        className={`h-10 w-10 object-contain ${
                          logo.includes('prisma') ? 'brightness-0' : ''
                        }`}
                      />
                    ))}
                  </div>
                )}
                <h3 className='text-lg font-semibold mb-2'>{item.title}</h3>
                <p className='text-sm text-muted-foreground'>{item.description}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
