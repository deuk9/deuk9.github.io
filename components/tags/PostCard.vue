<template>
  <div class="p-4 border rounded-md shadow-sm">
    <h2 class="text-lg font-bold">
      {{ post.title }}
    </h2>
    <p class="text-sm text-gray-500">
      {{ post.description }}
    </p>
    <p class="text-sm text-gray-400 mt-1">
      date: {{ post.date }}
    </p>
    <div class="flex space-x-2 mt-2">
      <span
        v-for="tag in post.tags"
        :key="tag"
        class="text-sm text-blue-500"
      >#{{ tag }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PostCardInfo {
  title: string
  description: string
  date: string
  tags: string[]
}

// Props 정의
defineProps<{ post: PostCardInfo }>()
</script>
