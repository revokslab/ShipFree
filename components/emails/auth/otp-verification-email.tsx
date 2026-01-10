import { Section, Text } from '@react-email/components'

import { baseStyles } from '@/components/emails/_styles'
import { getBrandConfig } from '@/config/branding'
import { EmailLayout } from '../components/email-layout'

interface OTPVerificationEmailProps {
  otp: string
  email?: string
  type?: 'sign-in' | 'email-verification' | 'forget-password'
}

const getSubjectByType = (type: string, brandName: string) => {
  switch (type) {
    case 'sign-in':
      return `Sign in to ${brandName}`
    case 'email-verification':
      return `Verify your email for ${brandName}`
    case 'forget-password':
      return `Reset your ${brandName} password`
    default:
      return `Verification code for ${brandName}`
  }
}

export function OTPVerificationEmail({
  otp,
  type = 'email-verification',
}: OTPVerificationEmailProps) {
  const brand = getBrandConfig()

  return (
    <EmailLayout preview={getSubjectByType(type, brand.name)}>
      <Text style={baseStyles.paragraph}>Your verification code:</Text>

      <Section style={baseStyles.codeContainer}>
        <Text style={baseStyles.code}>{otp}</Text>
      </Section>

      <Text style={baseStyles.paragraph}>This code will expire in 15 minutes.</Text>

      {/* Divider */}
      <div style={baseStyles.divider} />

      <Text style={{ ...baseStyles.footerText, textAlign: 'left' }}>
        Do not share this code with anyone. If you didn't request this code, you can safely ignore
        this email.
      </Text>
    </EmailLayout>
  )
}

export default OTPVerificationEmail
