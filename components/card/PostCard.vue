<template>
  <div
    class="p-6 bg-white dark:bg-gray-800  border-b border-gray-200 dark:border-gray-700 rounded hover:shadow-xl transition-shadow duration-200"
  >
    <!-- 제목 -->
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
      <NuxtLink
        :to="getPostUrl(post.path)"
        class="cursor-pointer hover:text-blue-600 transition-colors"
      >
        {{ post.title }}
      </NuxtLink>
    </h1>

    <!-- 작성 날짜 -->
    <p class="text-xs text-gray-400 dark:text-gray-300 mt-1">
      {{ post.date }}
    </p>

    <!-- 본문 내용 (3줄 제한) - 성능 최적화 적용 -->
    <template v-if="post.showFullContent !== false">
      <ContentRenderer
        v-if="post.content && post.content.body"
        :value="post.content"
        :unwrap="true"
        class="reset-content text-sm text-gray-600 dark:text-gray-200 mt-4 line-clamp-3"
      />
      <div
        v-else-if="post.description"
        class="text-sm text-gray-600 dark:text-gray-200 mt-4 line-clamp-3"
      >
        {{ post.description }}
      </div>
    </template>
    <template v-else>
      <!-- 검색 결과에서는 description만 표시 (성능 최적화) -->
      <div
        v-if="post.description"
        class="text-sm text-gray-600 dark:text-gray-200 mt-4 mb-2 line-clamp-3"
      >
        {{ post.description }}
      </div>
    </template>

    <!-- 태그 리스트 -->
    <div class="flex flex-wrap gap-2 mt-4">
      <TagButton
        v-for="tag in post.tags"
        :key="tag"
        :tag="tag"
        @click="emitClickedTag(tag)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// PostCardInfo 타입 정의

import TagButton from '~/components/tags/TagButton.vue'

interface PostCardInfo {
  title: string
  description: string
  date: string
  tags: string[]
  path: string
  content: object // 추가된 필드: 포스트의 본문 내용
  needEvent: boolean
  showFullContent?: boolean // 전체 콘텐츠 렌더링 여부 (성능 최적화용)
}

// Props 정의
const props = defineProps<{ post: PostCardInfo }>()

// URL 안전 처리 함수
const getPostUrl = (path: string): string => {
  if (!path) return '/'

  try {
    // 이미 완전한 URL인지 확인
    if (path.endsWith('/')) {
      return path
    }
    return path + '/'
  }
  catch (error) {
    console.error('Error processing post URL:', error, path)
    return '/'
  }
}

const emit = defineEmits(['tag-clicked'])

const emitClickedTag = (tag: string) => {
  if (props.post.needEvent) {
    emit('tag-clicked', tag)
  }
}
</script>
