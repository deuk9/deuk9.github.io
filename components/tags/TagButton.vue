<template>
  <div>
    <button
      class="px-3 py-1 text-sm rounded-full transition-colors duration-200 cursor-pointer"
      :class="{
        'bg-gray-400 text-white': isSelected, // 선택된 경우 스타일
        'bg-gray-200 hover:bg-gray-400': !isSelected, // 기본 스타일
      }"
      @click="goToTag(tag)"
    >
      {{ tagText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  tag: string
  count?: number // 선택적 프로퍼티
  selectedTag?: string
}>()

// 버튼에 표시할 텍스트 계산
const tagText = computed(() => {
  return props.count !== undefined ? `${props.tag} (${props.count})` : props.tag
})

// 선택 상태 계산
const isSelected = computed(() => {
  return props.tag === props.selectedTag
})

// 태그 이동 함수
const goToTag = (tag: string) => {
  navigateTo(`/tags?q=${tag}`)
}
</script>
