import type { Metadata } from 'next'
import { getBaseUrl } from '@/lib/utils'
import { getBrandConfig } from '@/config/branding'

/**
 * Site configuration for SEO
 */
const brandConfig = getBrandConfig()

export const siteConfig = {
  name: brandConfig.name,
  description:
    'ShipFree is a free open-source Next.js SaaS boilerplate alternative to ShipFast. Simplify and optimize your shipping process with modern web technologies.',
  url: getBaseUrl(),
  ogImage: '/og.png',
  twitterHandle: '@codedoesdev',
  creator: 'The Revoks Company',
  keywords: [
    'ShipFree',
    'ShipFast alternative',
    'Next.js SaaS boilerplate',
    'Open source boilerplate',
    'SaaS template',
    'Next.js template',
    'Shipping solution',
    'E-commerce boilerplate',
    'Stripe integration',
    'LemonSqueezy integration',
    'Supabase authentication',
    'Drizzle ORM',
    'Mailgun',
    'TypeScript boilerplate',
    'React SaaS',
  ],
} as const

/**
 * Type for SEO metadata options
 */
export type SEOOptions = {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  noindex?: boolean
  nofollow?: boolean
  canonical?: string
  isRootLayout?: boolean
  allowCanonicalQuery?: boolean
}

/**
 * Generate absolute URL from a path
 */
const getAbsoluteUrl = (path: string): string => {
  const trimmed = path.trim()
  const isAbsolute = /^https?:\/\//i.test(trimmed) || trimmed.startsWith('//')
  if (isAbsolute) {
    return trimmed
  }

  const baseUrl = getBaseUrl().replace(/\/$/, '')
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${baseUrl}${cleanPath}`
}

const normalizeCanonicalPath = (canonicalPath?: string, allowQuery?: boolean) => {
  if (!canonicalPath) {
    return canonicalPath
  }

  const [withoutHash] = canonicalPath.split('#')
  if (allowQuery) {
    return withoutHash
  }

  const [withoutQuery] = withoutHash.split('?')
  return withoutQuery
}

/**
 * Generate Open Graph metadata
 */
const getOpenGraph = (options: SEOOptions) => {
  const ogImage = options.image ? getAbsoluteUrl(options.image) : getAbsoluteUrl(siteConfig.ogImage)

  return {
    type: options.type || 'website',
    url: options.canonical ? getAbsoluteUrl(options.canonical) : siteConfig.url,
    title: options.title || siteConfig.name,
    description: options.description || siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: options.imageAlt || options.title || siteConfig.name,
      },
    ],
    ...(options.publishedTime && { publishedTime: options.publishedTime }),
    ...(options.modifiedTime && { modifiedTime: options.modifiedTime }),
    ...(options.authors && { authors: options.authors }),
  }
}

/**
 * Generate Twitter Card metadata
 */
const getTwitterCard = (options: SEOOptions) => {
  const twitterImage = options.image
    ? getAbsoluteUrl(options.image)
    : getAbsoluteUrl(siteConfig.ogImage)

  return {
    card: 'summary_large_image' as const,
    title: options.title || siteConfig.name,
    description: options.description || siteConfig.description,
    creator: siteConfig.twitterHandle,
    images: [twitterImage],
  }
}

/**
 * Generate comprehensive metadata for a page
 * This is the main function to use for generating SEO metadata
 */
export const generateMetadata = (options: SEOOptions = {}): Metadata => {
  const description = options.description || siteConfig.description
  const keywords = options.keywords || siteConfig.keywords
  const normalizedCanonicalPath = normalizeCanonicalPath(
    options.canonical,
    options.allowCanonicalQuery
  )
  const canonicalUrl = normalizedCanonicalPath
    ? getAbsoluteUrl(normalizedCanonicalPath)
    : siteConfig.url

  // For root layout, use absolute and template
  // For child pages, just use string title (template will be applied automatically)
  const titleMetadata = options.isRootLayout
    ? {
        absolute: options.title || siteConfig.name,
        template: `%s · ${siteConfig.name}`,
      }
    : options.title || siteConfig.name

  return {
    title: titleMetadata,
    description,
    keywords: keywords.join(', '),
    authors: options.authors
      ? options.authors.map((author) => ({ name: author }))
      : [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    publisher: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: getOpenGraph({
      ...options,
      canonical: normalizedCanonicalPath,
    }),
    twitter: getTwitterCard({
      ...options,
      canonical: normalizedCanonicalPath,
    }),
    robots: {
      index: !options.noindex,
      follow: !options.nofollow,
      googleBot: {
        index: !options.noindex,
        follow: !options.nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(options.publishedTime && {
      publicationDate: options.publishedTime,
    }),
    ...(options.modifiedTime && {
      modificationDate: options.modifiedTime,
    }),
  }
}

/**
 * Generate JSON-LD structured data for organization
 */
export const getOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: getAbsoluteUrl('/logo.png'),
    sameAs: ['https://github.com/revokslab', 'https://x.com/codedoesdev'],
  }
}

/**
 * Generate JSON-LD structured data for website
 */
export const getWebsiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.url),
    })),
  }
}

/**
 * Generate JSON-LD structured data for article/blog post
 */
export const getArticleSchema = (options: {
  title: string
  description: string
  image?: string
  publishedTime: string
  modifiedTime?: string
  author?: string
  url: string
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.title,
    description: options.description,
    image: options.image ? getAbsoluteUrl(options.image) : getAbsoluteUrl(siteConfig.ogImage),
    datePublished: options.publishedTime,
    ...(options.modifiedTime && { dateModified: options.modifiedTime }),
    author: {
      '@type': 'Person',
      name: options.author || siteConfig.creator,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: getAbsoluteUrl('/image.png'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getAbsoluteUrl(options.url),
    },
  }
}

/**
 * Generate JSON-LD structured data for blog/collection page
 */
export const getBlogSchema = (options: {
  name: string
  description: string
  url: string
  posts: Array<{
    title: string
    url: string
    datePublished: string
    author?: string
  }>
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: options.name,
    description: options.description,
    url: getAbsoluteUrl(options.url),
    blogPost: options.posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: getAbsoluteUrl(post.url),
      datePublished: post.datePublished,
      ...(post.author && {
        author: {
          '@type': 'Person',
          name: post.author,
        },
      }),
    })),
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: getAbsoluteUrl('/image.png'),
      },
    },
  }
}
