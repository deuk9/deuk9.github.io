<template>
  <div>
    <span
      class="px-2 py-1 text-xs bg-gray-200 rounded-full transition-colors duration-200 cursor-pointer hover:bg-gray-400"
      @click="goToTag(tag)"
    >
      #{{ tag }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tag: string
}>()
const goToTag = (tag: string) => {
  navigateTo(`/tags?q=${tag}`)
}
</script>
