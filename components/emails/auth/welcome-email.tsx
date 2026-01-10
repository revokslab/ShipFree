import { Link, Text } from '@react-email/components'

import { baseStyles } from '@/components/emails/_styles'
import { getBrandConfig } from '@/config/branding'
import { getBaseUrl } from '@/lib/utils'
import { EmailLayout } from '../components/email-layout'

interface WelcomeEmailProps {
  userName?: string
}

export function WelcomeEmail({ userName }: WelcomeEmailProps) {
  const brand = getBrandConfig()
  const baseUrl = getBaseUrl()

  return (
    <EmailLayout preview={`Welcome to ${brand.name}`}>
      <Text style={{ ...baseStyles.paragraph, marginTop: 0 }}>
        {userName ? `Hey ${userName},` : 'Hey,'}
      </Text>
      <Text style={baseStyles.paragraph}>
        Welcome to {brand.name}! Your account is ready. Start building, and deploying
        production-ready apps.
      </Text>

      <Link href={`${baseUrl}/w`} style={{ textDecoration: 'none' }}>
        <Text style={baseStyles.button}>Get Started</Text>
      </Link>

      <Text style={baseStyles.paragraph}>
        If you have any questions or feedback, just reply to this email. I read every message!
      </Text>

      <Text style={baseStyles.paragraph}>- Irere Emmanuel, co-founder of {brand.name}</Text>
    </EmailLayout>
  )
}

export default WelcomeEmail
