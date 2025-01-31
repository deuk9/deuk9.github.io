<template>
  <div class="border-amber-50 flex flex-col items-center">
    <!-- Search Box -->
    <div class="w-full max-w-2xl p-4">
      <div class="relative">
        <input
          type="text"
          placeholder="Search posts..."
          class="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          @input="onInput"
        >
        <UIcon
          name="mdi:magnify"
          class="absolute right-3 top-3 w-5 h-5 text-gray-400"
        />
      </div>
    </div>

    <!-- Card Box -->
    <div class="w-full max-w-2xl mt-4 mb-4">
      <p class="text-lg font-semibold text-gray-700 mb-4">
        <!--        {{ searchStatus }} -->
      </p>
      <div class="flex flex-col gap-6">
        <template v-if="query">
          <PostCard
            v-for="post in filteredPost"
            :key="post.id"
            :post="{
              id: post.id,
              date: post.date,
              title: post.title,
              content: post,
              tags: post.tags,
              description: post.description,
              needEvent: true,
              path: post.path,
            }"
            class="w-full"
          />
        </template>
        <template v-else>
          <PostCard
            v-for="post in allPosts"
            :key="post.id"
            :post="{
              id: post.id,
              date: post.date,
              title: post.title,
              content: post,
              tags: post.tags,
              description: post.description,
              needEvent: true }
            "
            class="w-full"
          />
        </template>
      </div>

      <!-- 검색 결과 없음 -->
      <p
        v-if="filteredPost.length === 0 && query"
        class="text-gray-500 text-sm mt-4 text-center"
      >
        No matching posts found.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import MiniSearch from 'minisearch'
import PostCard from '~/components/card/PostCard.vue'

// 검색어 상태
const query = ref('')

const onInput = (event: Event) => {
  query.value = (event.target as HTMLInputElement).value
}

const { data: allPosts } = await useAsyncData('posts', async () => {
  return queryCollection('contents')
    .select('id', 'title', 'date', 'description', 'path', 'body')
    .order('date', 'DESC')
    .all()
})

const { data } = await useAsyncData('search', () => queryCollectionSearchSections('contents'))

// MiniSearch 설정
const miniSearch = new MiniSearch({
  fields: ['title', 'content'],
  storeFields: ['id', 'title', 'description', 'path'],
  searchOptions: { prefix: true },
})

// MiniSearch에 데이터 추가
miniSearch.addAll(toValue(data.value))

// 검색된 결과 리스트
const searchResults = computed(() => miniSearch.search(toValue(query)))

// 전체 게시글 가져오기

const uniqueBaseUrls = computed(() => {
  const baseUrlMap = new Map<string, number>()

  searchResults.value.forEach((link) => {
    const baseUrl = link.id.split('#')[0] // `#` 앞의 값만 사용

    if (baseUrlMap.has(baseUrl)) {
      baseUrlMap.set(baseUrl, baseUrlMap.get(baseUrl)! + 1) // 기존 값 +1 증가
    }
    else {
      baseUrlMap.set(baseUrl, 1) // 처음 추가하는 경우 count=1
    }
  })

  return baseUrlMap
})

const filteredPost = computed(() => {
  return allPosts.value
    ? allPosts.value.filter(post => uniqueBaseUrls.value.has(post.path))
        .map(post => ({
          ...post,
        }))
    : []
})
</script>
