<script setup lang="ts">
useHead({
  title: 'ShipFree - Ship your startup in days, not weeks',
  meta: [
    { name: 'description', content: 'Build and ship your SaaS faster with ShipFree' }
  ]
})
</script>

<template>
  <div class="bg-[#212121] min-h-screen">
    <!-- Navbar -->
    <nav class="fixed top-0 z-50 w-full bg-[#212121]">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex items-center gap-2 text-lg font-semibold text-white">
          <span class="text-2xl">⚡</span>
          ShipFree
        </NuxtLink>
        <div class="flex items-center gap-8">
          <a href="#pricing" class="text-white/90 hover:text-white">Pricing</a>
          <a href="#faq" class="text-white/90 hover:text-white">FAQ</a>
          <NuxtLink to="/auth/login" class="text-white/90 hover:text-white">Login</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="pt-32 px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl text-center">
        <h1 class="text-5xl md:text-6xl font-extrabold text-[#CFCFCF] mb-6">
          Ship your startup<br />
          in days, <span class="bg-[#CFCFCF] text-[#2E1A05] px-2">not weeks</span>
        </h1>
        <p class="text-xl text-[#CFCFCF] mb-8 max-w-3xl mx-auto">
          Tired of wasting time on setup instead of build? ShipFree is the fastest way to launch your SaaS, AI tool, or web app—for free.
        </p>
        <a
          href="https://github.com/idee8/shipfree"
          target="_blank"
          class="inline-flex items-center gap-2 bg-[#FFBE1A] hover:bg-yellow-500 text-black px-12 py-4 rounded-xl font-medium text-lg transition-colors"
        >
          <span class="text-2xl">⚡</span>
          Get ShipFree
        </a>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="py-24 px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <h2 class="text-4xl font-bold text-center text-[#CFCFCF] mb-12">Everything you need to ship fast</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="p-6 bg-[#2C2C2C] rounded-xl">
            <div class="text-4xl mb-4">🚀</div>
            <h3 class="text-xl font-bold text-white mb-2">Authentication</h3>
            <p class="text-zinc-400">Supabase auth with email, magic link, and OAuth</p>
          </div>
          <div class="p-6 bg-[#2C2C2C] rounded-xl">
            <div class="text-4xl mb-4">💳</div>
            <h3 class="text-xl font-bold text-white mb-2">Payments</h3>
            <p class="text-zinc-400">Stripe & LemonSqueezy integration</p>
          </div>
          <div class="p-6 bg-[#2C2C2C] rounded-xl">
            <div class="text-4xl mb-4">📧</div>
            <h3 class="text-xl font-bold text-white mb-2">Email</h3>
            <p class="text-zinc-400">Mailgun ready for transactional emails</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Section -->
    <div id="pricing" class="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F0F0F]">
      <div class="mx-auto max-w-5xl text-center">
        <h2 class="text-4xl font-bold text-[#CFCFCF] mb-4">Simple Pricing</h2>
        <p class="text-xl text-zinc-400 mb-12">Pay once, use forever</p>
        <div class="p-8 bg-[#2C2C2C] rounded-2xl">
          <h3 class="text-3xl font-bold text-white mb-4">$0</h3>
          <p class="text-zinc-400 mb-8">Yes, it's completely free!</p>
          <a
            href="https://github.com/idee8/shipfree"
            target="_blank"
            class="inline-flex items-center gap-2 bg-[#FFBE1A] hover:bg-yellow-500 text-black px-8 py-3 rounded-xl font-medium transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div id="faq" class="py-24 px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl">
        <h2 class="text-4xl font-bold text-center text-[#CFCFCF] mb-12">Frequently Asked Questions</h2>
        <div class="space-y-6">
          <div class="p-6 bg-[#2C2C2C] rounded-xl">
            <h3 class="text-xl font-bold text-white mb-2">Is it really free?</h3>
            <p class="text-zinc-400">Yes! ShipFree is completely open source and free to use.</p>
          </div>
          <div class="p-6 bg-[#2C2C2C] rounded-xl">
            <h3 class="text-xl font-bold text-white mb-2">What tech stack does it use?</h3>
            <p class="text-zinc-400">Next.js 15, Supabase, Stripe, Tailwind CSS, and more.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-zinc-800 bg-[#0F0F0F] px-4 py-12">
      <div class="mx-auto max-w-7xl text-center">
        <p class="text-zinc-400 mb-4">⚡ ShipFree - Built for makers, by makers</p>
        <p class="text-zinc-500 text-sm">© 2025 ShipFree. All Rights Reserved.</p>
      </div>
    </footer>
  </div>
</template>
