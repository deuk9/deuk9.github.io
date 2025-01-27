<template>
  <div class="max-w-4xl mx-auto px-4 py-8 bg-white shadow-lg rounded-lg">
    <!-- Blog Title -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">
        {{ page.title }}
      </h1>
      <p class="text-sm text-gray-500">
        Published on {{ page.date }}
      </p>
    </div>

    <!-- Blog Content -->
    <div>
      <ContentRenderer
        v-if="page"
        :value="page"
      />
    </div>
    <TableOfContents :toc="page.body.toc" />
    <!-- Tags Section (Moved to Footer) -->
    <div class="mt-8 pt-4 border-t">
      <p class="text-lg font-semibold text-gray-700 mb-2">
        Tags:
      </p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in page.tags"
          :key="tag"
          class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full shadow-sm"
        >
          #{{ tag }}
        </span>
      </div>
    </div>

    <!-- Blog Footer -->
    <div class="mt-8 pt-4 border-t">
      <p class="text-center text-sm text-gray-500">
        Thanks for reading! Feel free to share this post or leave a comment.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TableOfContents from '~/components/toc/TableOfConents.vue'

const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('contents')
    .path(route.path)
    .first()
})
</script>
