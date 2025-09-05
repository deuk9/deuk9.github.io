<template>
  <div class="border-amber-50 flex flex-col items-center">
    <!-- Search Box -->
    <div class="w-full max-w-2xl p-4">
      <div class="relative">
        <input
          v-model="query"
          type="text"
          placeholder="Search posts..."
          class="w-full px-4 py-2 text-gray-700 bg-white  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClientOnly>
          <PostCard
            v-for="post in paginatedResults"
            :key="post.id"
            :post="{
              id: post.id,
              date: post.date,
              title: post.title,
              content: post,
              tags: post.tags,
              path: post.path,
              description: post.description,
              needEvent: true,
              showFullContent: false,
            }"
            class="w-full"
          />
        </ClientOnly>
      </div>

      <!-- 페이지네이션 -->
      <div
        v-if="totalPages > 1"
        class="flex justify-center items-center gap-2 mt-8"
      >
        <!-- 이전 페이지 버튼 -->
        <button
          :disabled="currentPage === 1"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2',
            currentPage === 1
              ? 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
          ]"
          @click="currentPage = Math.max(1, currentPage - 1)"
        >
          Previous
        </button>

        <!-- 페이지 번호들 -->
        <template v-for="pageNum in totalPages" :key="pageNum">
          <button
            v-if="shouldShowPageNumber(pageNum)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2',
              currentPage === pageNum
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105 font-semibold dark:bg-blue-500 dark:border-blue-500'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
            ]"
            @click="currentPage = pageNum"
          >
            {{ pageNum }}
          </button>
        </template>

        <!-- 다음 페이지 버튼 -->
        <button
          :disabled="currentPage === totalPages"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2',
            currentPage === totalPages
              ? 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
          ]"
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
        >
          Next
        </button>
      </div>

      <!-- 검색 결과 없음 -->
      <ClientOnly>
        <p
          v-if="filteredPost.length === 0 && query"
          class="text-gray-500 text-sm mt-4 text-center"
        >
          No matching posts found.
        </p>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import MiniSearch from 'minisearch'
import PostCard from '~/components/card/PostCard.vue'

// 검색어 상태
const query = ref('')
const isLoading = ref(true)
const error = ref<string | null>(null)

const { data: allPosts } = await useAsyncData('posts', async () => {
  return queryCollection('contents')
    .select('id', 'title', 'date', 'description', 'path', 'body', 'tags')
    .order('date', 'DESC')
    .all()
})

const { data: searchData } = await useAsyncData('search', () => queryCollectionSearchSections('contents'))

// MiniSearch 인스턴스
const miniSearch = ref<MiniSearch | null>(null)

// 클라이언트에서만 MiniSearch 초기화
onMounted(() => {
  if (searchData.value && searchData.value.length > 0) {
    try {
      miniSearch.value = new MiniSearch({
        fields: ['title', 'content'],
        storeFields: ['id', 'title', 'description', 'path'],
        searchOptions: { prefix: true },
      })

      miniSearch.value.addAll(searchData.value)
      isLoading.value = false
      error.value = null
    }
    catch (e) {
      console.error('Failed to initialize search:', e)
      error.value = 'Failed to initialize search'
      isLoading.value = false
    }
  }
})

// 검색된 결과 리스트
const searchResults = computed(() => {
  if (!miniSearch.value || !query.value.trim()) return []

  try {
    return miniSearch.value.search(query.value)
  }
  catch {
    console.error('Search failed')
    return []
  }
})

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

// 페이징 설정
const POSTS_PER_PAGE = 6
const currentPage = ref(1)

const filteredPost = computed(() => {
  if (!allPosts.value) return []

  const filtered = allPosts.value
    .filter(post => uniqueBaseUrls.value.has(post.path))
    .map(post => ({
      ...post,
    }))

  return filtered
})

// 페이징된 결과
const paginatedResults = computed(() => {
  const startIndex = (currentPage.value - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  return query.value ? filteredPost.value.slice(startIndex, endIndex) : allPosts.value?.slice(startIndex, endIndex) || []
})

// 전체 페이지 수
const totalPages = computed(() => {
  const totalPosts = query.value ? filteredPost.value.length : (allPosts.value?.length || 0)
  return Math.ceil(totalPosts / POSTS_PER_PAGE)
})

// 검색어 변경 시 첫 페이지로 리셋
watch(query, () => {
  currentPage.value = 1
})

// 페이지 번호 표시 로직
const shouldShowPageNumber = (pageNum: number) => {
  if (totalPages.value <= 5) return true
  
  const current = currentPage.value
  
  // 첫 페이지와 마지막 페이지는 항상 표시
  if (pageNum === 1 || pageNum === totalPages.value) return true
  
  // 현재 페이지 주변 2개씩 표시
  return Math.abs(pageNum - current) <= 1
}

// 리소스 정리
onUnmounted(() => {
  miniSearch.value = null
})
</script>
