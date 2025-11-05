<script setup lang="ts">
import { TabsList } from 'radix-vue'
import { cn } from '~/lib/utils'

interface TabsListProps {
  class?: string
}

const props = defineProps<TabsListProps>()
</script>

<template>
  <TabsList
    :class="cn('inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground', props.class)"
  >
    <slot />
  </TabsList>
</template>
