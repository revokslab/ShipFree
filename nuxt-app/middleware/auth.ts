export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()

  // Protect dashboard routes
  if (to.path.startsWith('/dashboard') && !user.value) {
    return navigateTo('/auth/login')
  }

  // Redirect authenticated users away from auth pages
  if ((to.path.startsWith('/auth/login') || to.path.startsWith('/auth/register')) && user.value) {
    return navigateTo('/dashboard')
  }
})
