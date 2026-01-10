import { render } from '@react-email/components'
import { OTPVerificationEmail, ResetPasswordEmail, WelcomeEmail } from '@/components/emails/auth'

export type { EmailSubjectType } from './subjects'
export { getEmailSubject } from './subjects'

export async function renderOTPEmail(
  otp: string,
  email: string,
  type: 'sign-in' | 'email-verification' | 'forget-password' = 'email-verification'
): Promise<string> {
  return await render(OTPVerificationEmail({ otp, email, type }))
}

export async function renderPasswordResetEmail(
  username: string,
  resetLink: string
): Promise<string> {
  return await render(ResetPasswordEmail({ username, resetLink }))
}

export async function renderWelcomeEmail(userName?: string): Promise<string> {
  return await render(WelcomeEmail({ userName }))
}
