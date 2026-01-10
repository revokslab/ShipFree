import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // to use Lingui macros
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
  turbopack: {
    rules: {
      '*.po': {
        loaders: ['@lingui/loader'],
        as: '*.js',
      },
    },
  },
}

export default nextConfig
