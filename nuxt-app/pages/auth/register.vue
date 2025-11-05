<script setup lang="ts">
useHead({
  title: 'Register - ShipFree',
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Create Account</h1>
        <p class="text-muted-foreground">Sign up for ShipFree</p>
      </div>
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Register</UiCardTitle>
          <UiCardDescription>Create a new account to get started</UiCardDescription>
        </UiCardHeader>
        <UiCardContent>
          <RegisterForm />
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>
