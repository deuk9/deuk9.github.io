<template>
  <div class="container mx-auto flex flex-col lg:flex-row gap-6 px-4 py-8">
    <!-- Main Blog Content -->
    <main class="flex-1">
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
            By {{ author }}
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
        <ContentRenderer :value="page" />
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

// 1. 런타임 설정과 현재 라우트 정보 가져오기
const { public: { author } } = useRuntimeConfig()
const route = useRoute()

// 2. 페이지 데이터와 전체 포스트 데이터를 병렬로 가져오기
const [pageResponse, allPostsResponse] = await Promise.all([
  useAsyncData(`page-${route.path}`, () =>
    queryCollection('contents')
      .path(route.path)
      .first(),
  ),
  useAsyncData('all-posts', () =>
    queryCollection('contents')
      .select('title', 'path', 'date')
      .order('date', 'DESC')
      .all(),
  ),
])

const page = pageResponse.data
const allPosts = allPostsResponse.data

// 3. SEO 메타 정보 설정 (page 데이터가 로드된 후)
useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
})

// 4. 날짜 포맷팅 (page 데이터가 존재하는지 안전하게 확인)
const formattedDate = computed(() => {
  if (!page.value?.date) return ''
  const date = new Date(page.value.date)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// 5. 현재 포스트의 인덱스를 한 번만 계산하여 네비게이션에 활용
const currentIndex = computed(() =>
  allPosts.value.findIndex(post => post.path === route.path),
)

// 6. 이전, 다음 포스트 계산 (인덱스에 기반)
const nextPost = computed(() => {
  const index = currentIndex.value
  return index > 0 ? allPosts.value[index - 1] : null
})

const previousPost = computed(() => {
  const index = currentIndex.value
  return index < allPosts.value.length - 1 ? allPosts.value[index + 1] : null
})
</script>
