<script setup lang="ts">
const email = ref('')
const password = ref('')
const router = useRouter()
const supabase = useSupabaseClient()

const handleLogin = async (e: Event) => {
  e.preventDefault()
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (error) {
    console.error('Error logging in:', error.message)
  } else {
    router.push('/dashboard')
  }
}

const handleMagicLink = async (e: Event) => {
  e.preventDefault()
  const { error } = await supabase.auth.signInWithOtp({ email: email.value })
  if (error) {
    console.error('Error sending magic link:', error.message)
  } else {
    alert('Check your email for the magic link!')
  }
}

const handleGoogleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) {
    console.error('Error signing in with Google:', error.message)
  }
}
</script>

<template>
  <div class="space-y-6">
    <form @submit="handleLogin" class="space-y-4">
      <div class="space-y-2">
        <UiLabel for="email">Email</UiLabel>
        <UiInput
          id="email"
          v-model="email"
          type="email"
          required
        />
      </div>
      <div class="space-y-2">
        <UiLabel for="password">Password</UiLabel>
        <UiInput
          id="password"
          v-model="password"
          type="password"
          required
        />
      </div>
      <UiButton type="submit" class="w-full">
        Login
      </UiButton>
    </form>
    <div class="flex flex-col space-y-4">
      <UiButton
        @click="handleMagicLink"
        variant="outline"
        class="w-full"
      >
        Send Magic Link
      </UiButton>
      <UiButton
        @click="handleGoogleSignIn"
        variant="outline"
        class="w-full"
      >
        Sign in with Google
      </UiButton>
    </div>
    <p class="text-center text-sm">
      Don't have an account?
      <NuxtLink to="/auth/register" class="text-blue-500 hover:underline">
        Register
      </NuxtLink>
    </p>
  </div>
</template>
