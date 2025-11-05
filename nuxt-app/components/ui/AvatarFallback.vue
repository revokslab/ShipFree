<script setup lang="ts">
import { AvatarFallback } from 'radix-vue'
import { cn } from '~/lib/utils'

interface AvatarFallbackProps {
  class?: string
}

const props = defineProps<AvatarFallbackProps>()
</script>

<template>
  <AvatarFallback
    :class="cn('flex h-full w-full items-center justify-center rounded-full bg-muted', props.class)"
  >
    <slot />
  </AvatarFallback>
</template>
