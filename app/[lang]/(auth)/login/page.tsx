import { getOAuthProviderStatus } from '../components/oauth-provider-checker'
import LoginForm from './login-form'
import { generateMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata = generateMetadata({
  title: 'Login | ShipFree',
})

export default async function LoginPage() {
  const { githubAvailable, googleAvailable, facebookAvailable, microsoftAvailable, isProduction } =
    await getOAuthProviderStatus()
  return (
    <LoginForm
      githubAvailable={githubAvailable}
      googleAvailable={googleAvailable}
      facebookAvailable={facebookAvailable}
      microsoftAvailable={microsoftAvailable}
      isProduction={isProduction}
    />
  )
}
