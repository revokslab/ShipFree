<script setup lang="ts">
import { Label as RadixLabel } from 'radix-vue'
import { cn } from '~/lib/utils'

interface LabelProps {
  for?: string
  class?: string
}

const props = defineProps<LabelProps>()
</script>

<template>
  <RadixLabel
    :for="for"
    :class="cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', props.class)"
  >
    <slot />
  </RadixLabel>
</template>
