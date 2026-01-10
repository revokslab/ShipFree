'use server'

import { env } from '@/config/env'
import { isProd } from '@/lib/constants'

export async function getOAuthProviderStatus() {
  const githubAvailable = !!(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET)

  const googleAvailable = !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)

  const microsoftAvailable = !!(env.MICROSOFT_CLIENT_ID && env.MICROSOFT_CLIENT_SECRET)

  const facebookAvailable = !!(env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET)

  return {
    githubAvailable,
    googleAvailable,
    microsoftAvailable,
    facebookAvailable,
    isProduction: isProd,
  }
}
