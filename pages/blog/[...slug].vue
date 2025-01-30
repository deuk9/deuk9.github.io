<template>
  <div class="container mx-auto flex flex-col lg:flex-row gap-6 px-4 py-8">
    <!-- Main Blog Content -->
    <main
      v-if="page"
      class="flex-1"
    >
      <!-- Blog Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          {{ page.title }}
        </h1>
        <div class="text-sm text-gray-500 mt-5">
          <div>
            <time :datetime="page.date">{{ formattedDate }}</time>
          </div>
          <div>
            By
            {{ author }}
          </div>
        </div>
        <!-- Blog Tags -->
        <div class="mt-7 border-b pb-7">
          <div class="flex flex-wrap gap-2">
            <TagButton
              v-for="tag in page.tags"
              :key="tag"
              :tag="tag"
            />
          </div>
        </div>
      </div>

      <!-- Blog Content -->
      <article class="mb-7">
        <ContentRenderer
          v-if="page.body"
          :value="page.body"
        />
      </article>
      <!-- Previous and Next Buttons -->
      <div class="border-t border-gray-200">
        <PostNavigation
          :previous-post="previousPost"
          :next-post="nextPost"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TagButton from '~/components/tags/TagButton.vue'
import PostNavigation from '~/components/card/PostNavigation.vue'

// Fetch blog data
const author = useRuntimeConfig().public.author
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('contents')
    .path(route.path)
    .first()
})

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
})
// Format the date
const formattedDate = computed(() => {
  const date = new Date(page.value.date)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

const { data: allPosts } = await useAsyncData('all-posts', () => {
  return queryCollection('contents')
    .select('title', 'path', 'date') // 필요한 필드만 가져오기
    .order('date', 'DESC') // 날짜순 정렬
    .all()
})

// Compute previous and next posts
const nextPost = computed(() => {
  const currentIndex = allPosts.value.findIndex(post => post.path === route.path)
  return currentIndex > 0 ? allPosts.value[currentIndex - 1] : null
})

const previousPost = computed(() => {
  const currentIndex = allPosts.value.findIndex(post => post.path === route.path)
  return currentIndex < allPosts.value.length - 1 ? allPosts.value[currentIndex + 1] : null
})
</script>
