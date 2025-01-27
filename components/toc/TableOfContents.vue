<template>
  <aside class="w-64 hidden lg:block sticky top-8">
    <p class="text-lg font-semibold text-gray-700 mb-4">
      목차
    </p>
    <ul class="space-y-2">
      <TOCItem
        v-for="item in props.toc.links"
        :key="item.id"
        :item="item"
      />
    </ul>
  </aside>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import TOCItem from './TOCItem.vue'

// Props 정의: 계층적 목차 데이터를 받음
const props = defineProps({
  toc: {
    type: Object as PropType<{
      title: string
      searchDepth: number
      depth: number
      links: Array<TOCLink>
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
