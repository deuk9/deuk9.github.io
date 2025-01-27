<template>
  <div class="border-amber-50 flex flex-col items-center">
    <!-- Tag Box -->
    <div class="w-full max-w-2xl p-4 flex flex-row">
      <NuxtImg
        src="/profile/profile.jpeg"
        width="130"
        height="130"
        class="rounded-full border-2 border-gray-300"
        alt="Profile Picture"
      />

      <!-- Profile Info -->
      <div class="ml-6">
        <div class="text-2xl font-bold text-gray-800">
          @{{ author }}
        </div>
        <p class="text-gray-600 text-lg mt-2">
          {{ comment }}
        </p>
      </div>
    </div>

    <!-- Card Box -->
    <div class="w-full max-w-2xl mt-4 mb-4">
      <div class="flex flex-col gap-6">
        <PostCard
          v-for="post in contents"
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
import { useRoute } from 'vue-router'
import PostCard from '~/components/card/PostCard.vue'

const author = useRuntimeConfig().public.author
const comment = useRuntimeConfig().public.comment
const github = useRuntimeConfig().public.github

const route = useRoute()

const { data: contents } = await useAsyncData(route.path, () => {
  return queryCollection('contents')
    .select('id', 'tags', 'title', 'date', 'description', 'path', 'body', 'excerpt')
    .order('date', 'desc')
    .limit(10)
    .all()
})
</script>
