<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <!-- 모달 헤더 -->
        <div class="flex justify-between items-center border-b pb-2">
          <h2 class="text-lg font-semibold">
            Search
          </h2>
          <button
            class="text-gray-500 hover:text-gray-800"
            @click="closeModal"
          >
            ✖
          </button>
        </div>

        <!-- 검색 입력창 -->
        <div class="relative mt-4">
          <input
            type="text"
            placeholder="Search..."
            class="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            @input="onInput"
          >
          <!-- 돋보기 아이콘 -->
          <UIcon
            name="mdi:magnify"
            class="absolute right-3 top-3 w-5 h-5 text-gray-400"
          />
        </div>

        <!-- 검색된 개수 표시 -->
        <p class="text-sm text-gray-600 mt-2 mb-2">
          {{ query ? `Found ${filteredPostsWithCount.length} matching posts` : `Total ${allPost.length} posts available` }}
        </p>

        <!-- 검색 결과 스크롤 가능 -->
        <div class="h-96 overflow-y-auto border rounded-md p-2">
          <ul v-if="filteredPostsWithCount.length > 0">
            <li
              v-for="post in filteredPostsWithCount"
              :key="post.path"
              class="mt-2 border p-2 rounded-md"
            >
              <NuxtLink
                :to="post.path"
                class="text-blue-500 font-medium"
                @click="closeModal"
              >
                {{ post.title }}
              </NuxtLink>

              <p class="text-gray-500 text-xs mt-1">
                {{ post.description }}
              </p>

              <!-- Matching Count -->
              <p class="text-xs text-gray-500 mt-1">
                Matching Count: {{ post.matchCount }}
              </p>

              <!-- 태그 표시 -->
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-md"
                >
                  {{ tag }}
                </span>
              </div>
            </li>
          </ul>

          <!-- 검색 결과 없음 -->
          <p
            v-else
            class="text-gray-500 text-sm mt-4 text-center"
          >
            No matching posts found.
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import MiniSearch from 'minisearch'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const query = ref('')
const onInput = (event: Event) => {
  query.value = (event.target as HTMLInputElement).value
}

const { data } = await useAsyncData('search', () => queryCollectionSearchSections('contents'))

const miniSearch = new MiniSearch({
  fields: ['title', 'content'],
  storeFields: ['title', 'content', 'path'],
  searchOptions: {
    prefix: true, // 부분 검색 가능
  },
})

// MiniSearch에 데이터 추가
miniSearch.addAll(toValue(data.value))

// 검색된 결과 리스트
const result = computed(() => miniSearch.search(toValue(query)))

// 전체 게시물 가져오기
const { data: allPost } = await useAsyncData('all', () => {
  return queryCollection('contents')
    .select('id', 'tags', 'title', 'date', 'description', 'path', 'body')
    .order('date', 'DESC')
    .all()
})

// `#` 앞의 값만 추출하여 URL별 등장 횟수(Map<string, number>) 저장
const uniqueBaseUrls = computed(() => {
  const baseUrlMap = new Map<string, number>()

  result.value.forEach((link) => {
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

const filteredPostsWithCount = computed(() => {
  return allPost.value
    ? allPost.value
        .filter(post => uniqueBaseUrls.value.has(post.path)) // `path` 기준으로 필터링
        .map(post => ({
          ...post,
          matchCount: uniqueBaseUrls.value.get(post.path) || 0, // Map에서 매칭된 개수 가져오기
        }))
    : []
})
</script>
