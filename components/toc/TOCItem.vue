<template>
  <li :class="{ 'pl-4': item.depth === 3, 'pl-6': item.depth > 3 }">
    <!-- 현재 항목 -->
    <a
      :href="'#' + item.id"
      class="text-blue-500 hover:underline"
    >
      {{ item.text }}
    </a>
    <!-- 자식 항목 -->
    <ul
      v-if="item.children && item.children.length"
      class="space-y-2 mt-2"
    >
      <TOCItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
      />
    </ul>
  </li>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

// Props 정의: 단일 TOC 항목 데이터
const props = defineProps({
  item: {
    type: Object as PropType<{
      id: string
      depth: number
      text: string
      children?: Array<TOCLink>
    }>,
    required: true,
  },
})

// TOCLink 타입 정의
interface TOCLink {
  id: string
  depth: number
  text: string
  children?: Array<TOCLink>
}
</script>
