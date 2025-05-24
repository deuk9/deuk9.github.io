<!-- components/PostNavigation.vue -->
<template>
  <div class="grid grid-cols-2 gap-40 mt-6 ">
    <!-- 이전 게시물 카드 -->
    <NuxtLink
      v-if="previousPost"
      :to="previousPost.path"
      class="block p-2 border rounded-md shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 w-full"
    >
      <div class="text-xs text-gray-500 dark:text-gray-400">Previous Post</div>
      <div class="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1 truncate w-full">
        {{ previousPost.title }}
      </div>
    </NuxtLink>

    <!-- 다음 게시물 카드 -->
    <NuxtLink
      v-if="nextPost"
      :to="nextPost.path"
      class="block p-2 border rounded-md shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-right w-full"
    >
      <div class="text-xs text-gray-500 dark:text-gray-400">Next Post</div>
      <div class="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1 truncate w-full">
        {{ nextPost.title }}
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  previousPost: { title: string, path: string } | null
  nextPost: { title: string, path: string } | null
}>()
</script>
