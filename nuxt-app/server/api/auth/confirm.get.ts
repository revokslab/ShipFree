export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const token_hash = query.token_hash as string
  const type = query.type as string

  if (token_hash && type) {
    const supabase = await useSupabaseClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    })

    if (error) {
      console.error('Error confirming email:', error)
      return sendRedirect(event, '/auth/login?error=confirmation_failed')
    }

    return sendRedirect(event, '/dashboard')
  }

  return sendRedirect(event, '/auth/login')
})
