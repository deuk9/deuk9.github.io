<template>
  <div
    class="p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-xl  transition-shadow duration-200"
  >
    <!-- 제목 -->
    <h1
      class="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600"
      @click="goToPost"
    >
      <a>{{ post.title }}</a>
    </h1>

    <!-- 설명 -->
    <p class="text-sm text-gray-500 mt-2">
      {{ post.description }}
    </p>

    <!-- 작성 날짜 -->
    <p class="text-xs text-gray-400 mt-1">
      {{ post.date }}
    </p>

    <!-- 태그 리스트 -->
    <div class="flex flex-wrap gap-2 mt-4">
      <span
        v-for="tag in post.tags"
        :key="tag"
        class="px-2 py-1 text-xs bg-gray-200 rounded-full transition-colors duration-200 cursor-pointer hover:bg-gray-400"
        @click="goToTag(tag)"
      >
        #{{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// PostCardInfo 타입 정의
interface PostCardInfo {
  title: string
  description: string
  date: string
  tags: string[]
  path: string
}

// Props 정의
const props = defineProps<{ post: PostCardInfo }>()

// 클릭 시 이동 함수
const goToPost = () => {
  navigateTo(props.post.path)
}

const goToTag = (tag: string) => {
  navigateTo(`/tags/${tag}`)
}
</script>
