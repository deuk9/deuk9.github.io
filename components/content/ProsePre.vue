<template>
  <div class="bg-gray-50 border-gray-200  border border-solid mt-2 relative ">
    <div class="absolute right-0">
      <UButton
        :label="language"
        color="gray"
        icon="i-heroicons-pencil-square"
        @click="copyCode"
      />
    </div>
    <pre
      :class="$props.class"
      class="text-wrap"
    >
      <slot />
    </pre>
  </div>
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

const copyCode = () => {
  console.log('click')
}
</script>

<style>
pre code .line {
  display: block;
  font-size: 0.8rem;
}
</style>
