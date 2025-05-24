<template>
  <div class="border-amber-50 flex flex-col items-center">
    <!-- Tag Box -->
    <div class="w-full max-w-2xl p-4">
      <!-- 태그 개수 표시 -->
      <p class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
        {{ tagCountText }}
      </p>

      <div class="flex flex-wrap gap-2">
        <div
          v-for="([tag, count]) in allTags"
          :key="tag"
          class="m-1"
        >
          <TagButton
            :tag="tag"
            :count="count"
            :selected-tag="selectedTag"
            @click="clickTag(tag)"
          />
        </div>
      </div>
    </div>

    <!-- Card Box -->
    <div class="w-full max-w-2xl mt-4 mb-4">
      <div class="flex flex-col gap-6 ">
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
import TagButton from '~/components/tags/TagButton.vue'

const route = useRoute()

const { data: contents } = await useAsyncData(route.path, () => {
  return queryCollection('contents')
    .select('id', 'tags', 'title', 'date', 'description', 'path', 'body')
    .order('date', 'DESC')
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

// 태그 개수 표시용 computed
const tagCountText = computed(() => {
  if (!selectedTag.value) {
    return `There are a total of ${filteredContents.value.length} posts`
  }
  return `#${selectedTag.value} - There are a total of ${filteredContents.value.length} posts`
})

// 태그 선택 함수
const clickTag = (tag) => {
  selectedTag.value = selectedTag.value === tag ? null : tag
  navigateTo(`/tags?q=${tag}`)
}

const onSelectedTag = (tag) => {
  selectedTag.value = tag
  navigateTo(`/tags?q=${tag}`)
}
</script>
