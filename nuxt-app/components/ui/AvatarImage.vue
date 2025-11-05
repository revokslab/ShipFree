<script setup lang="ts">
import { AvatarImage } from 'radix-vue'
import { cn } from '~/lib/utils'

interface AvatarImageProps {
  src: string
  alt?: string
  class?: string
}

const props = defineProps<AvatarImageProps>()
</script>

<template>
  <AvatarImage
    :src="src"
    :alt="alt"
    :class="cn('aspect-square h-full w-full', props.class)"
  />
</template>
