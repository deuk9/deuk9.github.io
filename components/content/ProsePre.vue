<template>
  <pre
    :class="$props.class"
    class="text-wrap text-sm w-auto bg-gray-50 border-gray-200  border border-solid mt-2 mb-2 py-4 break-all"
  ><!--
    --><slot /><!--
  --></pre>
</template>

<script setup lang="ts">
interface HighlightCode {
  code: string
  class: string
  language: string
  filename?: string
  highlights?: number[]
  meta?: string
}

withDefaults(defineProps<HighlightCode>(), {
  code: '',
  language: null,
  class: '',
  filename: null,
  highlights: null,
  meta: '',
})
</script>

<style>
pre code .line {
  display: block;
}
</style>
