import formData from 'form-data'
import Mailgun from 'mailgun.js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { to, subject, text, html } = await readBody(event)

  const mailgun = new Mailgun(formData)
  const mg = mailgun.client({
    username: 'api',
    key: config.mailgunApiKey as string,
  })

  try {
    const result = await mg.messages.create(config.mailgunDomain as string, {
      from: config.mailgunFromEmail as string,
      to: [to],
      subject,
      text,
      html,
    })

    return { success: true, messageId: result.id }
  } catch (err: any) {
    console.error('Error sending email:', err)
    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    })
  }
})
