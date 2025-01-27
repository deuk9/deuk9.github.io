<template>
  <div class="border-amber-50 flex flex-col items-center">
    <!-- Tag Box -->
    <div class="w-full max-w-2xl p-4">
      <!-- 태그 개수 표시 -->
      <p class="text-lg font-semibold text-gray-700 mb-4">
        총 {{ filteredContents.length }}개의 태그가 있습니다. #{{ selectedTag }}
      </p>

      <div class="flex flex-wrap gap-2">
        <div
          v-for="([tag, count]) in allTags"
          :key="tag"
          class="m-1"
        >
          <UButton
            class="bg-gray-200 text-black rounded-2xl"
            :class="{ 'bg-gray-400': tag === selectedTag }"
            @click="selectTag(tag)"
          >
            {{ tag }} ({{ count }})
          </UButton>
        </div>
      </div>
    </div>

    <!-- Card Box -->
    <div class="w-full max-w-2xl mt-4 mb-4">
      <div class="flex flex-col gap-6">
        <PostCard
          v-for="post in filteredContents"
          :key="post.id"
          :post="{
            id: post.id,
            date: post.date,
            title: post.title,
            tags: post.tags,
            description: post.description,
            path: post.path,
            content: post,
            needEvent: true,
          }"
          class="w-full"
          @tag-clicked="onSelectedTag"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import PostCard from '~/components/card/PostCard.vue'

const route = useRoute()
const { q } = route.query

console.log(q)

const { data: contents } = await useAsyncData(route.path, () => {
  return queryCollection('contents')
    .select('id', 'tags', 'title', 'date', 'description', 'path', 'body', 'excerpt')
    .order('date', 'desc')
    .all()
})

// 태그 계산
const allTags = contents.value
  ?.flatMap(item => item.tags)
  .reduce((acc, tag) => acc.set(tag, (acc.get(tag) || 0) + 1), new Map())

const selectedTag = ref(route.query.q || null)

// 필터된 콘텐츠 계산
const filteredContents = computed(() => {
  if (!selectedTag.value) return contents.value || []
  return (contents.value || []).filter(content =>
    content.tags.includes(selectedTag.value),
  )
})

// 태그 선택 함수
const selectTag = (tag) => {
  selectedTag.value = selectedTag.value === tag ? null : tag
  navigateTo(`/tags?q=${tag}`)
}

const onSelectedTag = (tag) => {
  selectedTag.value = tag
  navigateTo(`/tags?q=${tag}`)
}
</script>
