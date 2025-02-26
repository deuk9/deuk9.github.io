<template>
  <div
    class="p-6 bg-white border-b border-gray-200  rounded-s hover:shadow-xl transition-shadow duration-200"
  >
    <!-- 제목 -->
    <h1
      class="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600"
      @click="goToPost"
    >
      <a>{{ post.title }}</a>
    </h1>

    <!-- 작성 날짜 -->
    <p class="text-xs text-gray-400 mt-1">
      {{ post.date }}
    </p>

    <!-- 본문 내용 (3줄 제한) -->
    <ContentRenderer
      v-if="post.content"
      :value="post.content"
      :unwrap="true"
      class="reset-content text-sm text-gray-600 mt-4 line-clamp-3"
    />

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
}

// Props 정의
const props = defineProps<{ post: PostCardInfo }>()

// 클릭 시 이동 함수
const goToPost = () => {
  navigateTo(props.post.path + '/')
}

const emit = defineEmits(['tag-clicked'])

const emitClickedTag = (tag: string) => {
  if (props.post.needEvent) {
    emit('tag-clicked', tag)
  }
}
</script>
