<script setup lang="ts">
useHead({
  title: 'Login - ShipFree',
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Welcome Back</h1>
        <p class="text-muted-foreground">Login to your ShipFree account</p>
      </div>
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Login</UiCardTitle>
          <UiCardDescription>Enter your credentials to continue</UiCardDescription>
        </UiCardHeader>
        <UiCardContent>
          <LoginForm />
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>
