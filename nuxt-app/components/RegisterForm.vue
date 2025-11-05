<script setup lang="ts">
const email = ref('')
const password = ref('')
const router = useRouter()
const supabase = useSupabaseClient()

const handleRegister = async (e: Event) => {
  e.preventDefault()
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })
  if (error) {
    console.error('Error registering:', error.message)
  } else {
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="space-y-6">
    <form @submit="handleRegister" class="space-y-4">
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
        Register
      </UiButton>
    </form>
    <p class="text-center text-sm">
      Already have an account?
      <NuxtLink to="/auth/login" class="text-blue-500 hover:underline">
        Login
      </NuxtLink>
    </p>
  </div>
</template>
