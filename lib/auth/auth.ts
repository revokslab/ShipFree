import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { emailOTP, organization } from 'better-auth/plugins'

import { db } from '@/database'
import { APP_COOKIE_NAME, isProd } from '@/lib/constants'
import { env } from '@/config/env'
import { getBaseUrl } from '@/lib/utils'
import {
  getEmailSubject,
  renderOTPEmail,
  renderPasswordResetEmail,
  renderWelcomeEmail,
} from '@/components/emails'
import { getFromEmailAddress, quickValidateEmail, sendEmail } from '@/lib/messaging/email'
import { isEmailVerificationEnabled } from '@/config/feature-flags'

export const auth = betterAuth({
  baseURL: getBaseUrl(),
  trustedOrigins: [getBaseUrl()],
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),

  advanced: {
    cookiePrefix: APP_COOKIE_NAME, // Change this to your cookie prefix
    crossSubDomainCookies: {
      enabled: !isProd,
      domain: '.shipfree.app', // Change this to your domain, if you are using a custom domain
    },
    useSecureCookies: !isProd,
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 24 * 60 * 60, // 24 hours in seconds
    },
    expiresIn: 30 * 24 * 60 * 60, // 30 days (how long a session can last overall)
    updateAge: 24 * 60 * 60, // 24 hours (how often to refresh the expiry)
    freshAge: 60 * 60, // 1 hour (or set to 0 to disable completely)
  },

  socialProviders: {
    ...(env.GOOGLE_CLIENT_ID &&
      env.GOOGLE_CLIENT_SECRET && {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          scope: ['email', 'profile'],
        },
      }),
    ...(env.GITHUB_CLIENT_ID &&
      env.GITHUB_CLIENT_SECRET && {
        github: {
          clientId: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET,
          scope: ['user:email'],
        },
      }),
    ...(env.MICROSOFT_CLIENT_ID &&
      env.MICROSOFT_CLIENT_SECRET && {
        microsoft: {
          clientId: env.MICROSOFT_CLIENT_ID,
          clientSecret: env.MICROSOFT_CLIENT_SECRET,
          tenantId: env.MICROSOFT_TENANT_ID || 'common',
        },
      }),
    ...(env.FACEBOOK_CLIENT_ID &&
      env.FACEBOOK_CLIENT_SECRET && {
        facebook: {
          clientId: env.FACEBOOK_CLIENT_ID,
          clientSecret: env.FACEBOOK_CLIENT_SECRET,
          scope: ['email', 'public_profile'],
        },
      }),
  },

  emailVerification: {
    autoSignInAfterVerification: true,
    afterEmailVerification: async (user) => {
      if (user.email) {
        try {
          const html = await renderWelcomeEmail(user.name || undefined)

          await sendEmail({
            to: user.email,
            subject: getEmailSubject('welcome'),
            html,
            from: getFromEmailAddress(),
            emailType: 'transactional',
          })

          console.info('[emailVerification.afterEmailVerification] Welcome email sent', {
            userId: user.id,
          })
        } catch (error) {
          console.error('[emailVerification.afterEmailVerification] Failed to send welcome email', {
            userId: user.id,
            error,
          })
        }
      }
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: isEmailVerificationEnabled,
    sendResetPassword: async ({ user, url }) => {
      const username = user.name || ''

      const html = await renderPasswordResetEmail(username, url)

      const result = await sendEmail({
        to: user.email,
        subject: getEmailSubject('reset-password'),
        html,
        from: getFromEmailAddress(),
        emailType: 'transactional',
      })

      if (!result.success) {
        throw new Error(`Failed to send reset password email: ${result.message}`)
      }
    },
  },
  plugins: [
    nextCookies(),
    emailOTP({
      sendVerificationOTP: async (data: {
        email: string
        otp: string
        type: 'sign-in' | 'email-verification' | 'forget-password'
      }) => {
        try {
          if (!data.email) {
            throw new Error('Email is required')
          }

          const validation = quickValidateEmail(data.email)
          if (!validation.isValid) {
            console.warn('Email validation failed', {
              email: data.email,
              reason: validation.reason,
              checks: validation.checks,
            })
            throw new Error(
              validation.reason ||
                "We are unable to deliver the verification email to that address. Please make sure it's valid and able to receive emails."
            )
          }

          const html = await renderOTPEmail(data.otp, data.email, data.type)

          const result = await sendEmail({
            to: data.email,
            subject: getEmailSubject(data.type),
            html,
            from: getFromEmailAddress(),
            emailType: 'transactional',
          })

          if (!result.success && result.message.includes('no email service configured')) {
            console.info('🔑 VERIFICATION CODE FOR LOGIN/SIGNUP', {
              email: data.email,
              otp: data.otp,
              type: data.type,
              validation: validation.checks,
            })
            return
          }

          if (!result.success) {
            throw new Error(`Failed to send verification code: ${result.message}`)
          }
        } catch (error) {
          console.error('Error sending verification code:', {
            error,
            email: data.email,
          })
          throw error
        }
      },
      sendVerificationOnSignUp: false,
      otpLength: 6, // Explicitly set the OTP length
      expiresIn: 15 * 60, // 15 minutes in seconds
    }),

    organization({
      // allowUserToCreateOrganization: async (user) => {
      //   const dbSubscriptions = await db
      //     .select()
      //     .from(schema.subscription)
      //     .where(eq(schema.subscription.referenceId, user.id))

      //   const hasTeamPlan = dbSubscriptions.some(
      //     (sub) => sub.status === 'active' && (sub.plan === 'team' || sub.plan === 'enterprise')
      //   )

      //   return hasTeamPlan
      // },
      organizationCreation: {
        afterCreate: async ({ organization, user }) => {
          console.info('[organizationCreation.afterCreate] Organization created', {
            organizationId: organization.id,
            creatorId: user.id,
          })
        },
      },
    }),
  ],

  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/error',
    verify: '/verify',
  },
})
