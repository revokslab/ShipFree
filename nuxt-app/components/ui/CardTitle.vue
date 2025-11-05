<script setup lang="ts">
import { cn } from '~/lib/utils'

interface CardTitleProps {
  class?: string
}

const props = defineProps<CardTitleProps>()
</script>

<template>
  <div :class="cn('font-semibold leading-none tracking-tight', props.class)">
    <slot />
  </div>
</template>
