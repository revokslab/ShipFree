<script setup lang="ts">
import { cn } from '~/lib/utils'

interface CardContentProps {
  class?: string
}

const props = defineProps<CardContentProps>()
</script>

<template>
  <div :class="cn('p-6 pt-0', props.class)">
    <slot />
  </div>
</template>
