<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/auth/login')
}

useHead({
  title: 'Dashboard - ShipFree',
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Dashboard Navbar -->
    <nav class="border-b bg-card">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-2 text-lg font-semibold">
            <span class="text-2xl">⚡</span>
            ShipFree
          </NuxtLink>
          <div class="flex items-center gap-4">
            <span class="text-sm text-muted-foreground">{{ user?.email }}</span>
            <UiButton @click="handleLogout" variant="outline" size="sm">
              Logout
            </UiButton>
          </div>
        </div>
      </div>
    </nav>

    <!-- Dashboard Content -->
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold mb-8">Dashboard</h1>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UiCard>
          <UiCardHeader>
            <UiCardTitle>Welcome</UiCardTitle>
            <UiCardDescription>You're logged in to ShipFree</UiCardDescription>
          </UiCardHeader>
          <UiCardContent>
            <p class="text-sm text-muted-foreground">
              Email: {{ user?.email }}
            </p>
          </UiCardContent>
        </UiCard>

        <UiCard>
          <UiCardHeader>
            <UiCardTitle>Quick Stats</UiCardTitle>
            <UiCardDescription>Your account overview</UiCardDescription>
          </UiCardHeader>
          <UiCardContent>
            <div class="text-3xl font-bold">0</div>
            <p class="text-sm text-muted-foreground">Total projects</p>
          </UiCardContent>
        </UiCard>

        <UiCard>
          <UiCardHeader>
            <UiCardTitle>Get Started</UiCardTitle>
            <UiCardDescription>Build something amazing</UiCardDescription>
          </UiCardHeader>
          <UiCardContent>
            <UiButton class="w-full">
              Create Project
            </UiButton>
          </UiCardContent>
        </UiCard>
      </div>

      <!-- Account Settings -->
      <div class="mt-8">
        <UiCard>
          <UiCardHeader>
            <UiCardTitle>Account Settings</UiCardTitle>
            <UiCardDescription>Manage your account preferences</UiCardDescription>
          </UiCardHeader>
          <UiCardContent class="space-y-4">
            <div>
              <UiLabel>Email</UiLabel>
              <UiInput :value="user?.email" disabled class="mt-2" />
            </div>
            <div>
              <UiLabel>User ID</UiLabel>
              <UiInput :value="user?.id" disabled class="mt-2" />
            </div>
          </UiCardContent>
        </UiCard>
      </div>
    </div>
  </div>
</template>
