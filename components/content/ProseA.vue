<template>
  <NuxtLink
    :href="props.href"
    :target="props.target"
    class="underline italic hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  href: {
    type: String,
    default: '',
  },
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined>,
    default: undefined,
    required: false,
  },
})
</script>
