<template>
  <div class="flex flex-col items-center w-full">
    <!-- Profile Section -->
    <div class="w-full max-w-2xl p-4">
      <div class="flex flex-row items-center">
        <!-- Avatar on the left -->
        <NuxtImg
          src="/profile/profile.jpeg"
          width="130"
          height="130"
          class="rounded-full border-2 border-gray-300 mx-0"
          alt="Avatar"
        />

        <!-- Profile Info on the right -->
        <div class="ml-6">
          <!-- Username -->
          <div class="text-2xl font-bold text-gray-800 dark:text-white">
            @{{ author }}
          </div>

          <!-- Comment -->
          <p class="text-gray-600 dark:text-gray-400 text-lg mt-2">
            {{ comment }}
          </p>

          <!-- GitHub Icon -->
          <div
            v-if="github"
            class="flex justify-start mt-2"
          >
            <NuxtLink :to="github">
              <UIcon
                name="octicon:mark-github-16"
                class="w-5 h-5"
              />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Posts -->
    <div class="w-full max-w-2xl mt-8">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white border-b mt-2 pb-2 mb-4">
        📌 Recent Posts
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
