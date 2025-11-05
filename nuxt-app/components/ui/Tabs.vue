<script setup lang="ts">
import { TabsRoot } from 'radix-vue'

interface TabsProps {
  defaultValue?: string
  modelValue?: string
}

const props = defineProps<TabsProps>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <TabsRoot
    :default-value="defaultValue"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot />
  </TabsRoot>
</template>
