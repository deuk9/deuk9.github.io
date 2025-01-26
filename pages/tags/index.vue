<template>
  <div class="border-amber-50 flex flex-col items-center">
    <!-- Tag Box -->
    <div class="w-full max-w-2xl p-4">
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
    <div class="w-full max-w-2xl mt-4">
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
          }"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import PostCard from '~/components/card/PostCard.vue'

const route = useRoute()

// Fetching the content data
const { data: contents } = await useAsyncData(route.path, () => {
  return queryCollection('contents')
    .select('tags', 'title', 'date', 'description', 'path')
    .order('date', 'desc')
    .all()
})

// Calculating all tags with their counts
const allTags = contents.value
  ?.flatMap(item => item.tags)
  .reduce((acc, tag) => acc.set(tag, (acc.get(tag) || 0) + 1), new Map())

// State for the selected tag
const selectedTag = ref(null)

// Filtered contents based on the selected tag
const filteredContents = computed(() => {
  if (!selectedTag.value) return contents.value || []
  return (contents.value || []).filter(content =>
    content.tags.includes(selectedTag.value),
  )
})

// Function to update the selected tag
const selectTag = (tag) => {
  selectedTag.value = selectedTag.value === tag ? null : tag // Deselect if already selected
}
</script>
