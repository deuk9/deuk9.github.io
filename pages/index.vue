<template>
  <div class="flex flex-col items-center w-full">
    <!-- Profile Section -->
    <div class="w-full max-w-2xl p-4 flex flex-row">
      <NuxtImg
        src="/profile/profile.jpeg"
        width="130"
        height="130"
        class="rounded-full border-2 border-gray-300"
        alt="Avartar"
      />

      <!-- Profile Info -->
      <div class="ml-6">
        <div class="text-2xl font-bold text-gray-800">
          @{{ author }}
        </div>
        <p class="text-gray-600 text-lg mt-2">
          {{ comment }}
        </p>
        <div v-if="github">
          <NuxtLink :to="github">
            <UIcon
              name="octicon:mark-github-16"
              class="w-5 h-5"
            />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Recent Posts -->
    <div class="w-full max-w-2xl mt-8">
      <h2 class="text-2xl font-semibold text-gray-800 border-b mt-2 pb-2 mb-4">
        📌 Recent Posts
      </h2>
      <div class="grid gap-4">
        <PostCard
          v-for="post in contents"
          :key="post.id"
          :post="{
            date: post.date,
            title: post.title,
            tags: post.tags,
            description: post.description,
            path: post.path,
            content: post,
            needEvent: true,
          }"
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
    .select('id', 'tags', 'title', 'date', 'description', 'path', 'body')
    .order('date', 'DESC')
    .limit(3)
    .all()
})
</script>
