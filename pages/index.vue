<template>
  <div class="flex flex-row mt-8 w-full min-h-screen justify-center">
    <!-- Left Sidebar -->
    <div class="hidden lg:block lg:w-96 lg:flex-shrink-0 lg:flex lg:justify-center">
      <div class="h-screen">
        <CategorySidebar
          :categories="categories"
          :selected-category="selectedCategory"
          @select-post="handleSelectPost"
          @select-category="handleSelectCategory"
        />
      </div>
    </div>
    <!-- Main Content in the center -->
    <div class="flex-1 max-w-3xl flex justify-center">
      <div class="flex pt-8 px-8">
        <div class="w-full flex flex-col items-start">
          <!-- Profile Section -->
          <div class=" p-4">
            <div class="w-full">
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
                      <Icon
                        name="octicon:mark-github-16"
                        class="w-5 h-5"
                      />
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Posts -->
          <div class="w-full mt-8 p-4">
            <div class="w-full">
              <h2 class="text-2xl font-semibold text-gray-800 dark:text-white border-b mt-2 pb-2 mb-4">
                Recent Posts
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
        </div>
      </div>
    </div>
    <!-- Right empty space -->
    <div class="hidden lg:block w-96 flex-shrink-0">
      <!-- Empty space for future use -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import PostCard from '~/components/card/PostCard.vue'
import CategorySidebar from '~/components/CategorySidebar.vue'

// Layout 지정
definePageMeta({
  layout: 'main',
})

interface Post {
  title: string
  path: string
  date: string
  tags: string[]
  description?: string
}

interface Category {
  name: string
  count: number
  posts: Post[]
}

const author = useRuntimeConfig().public.author
const comment = useRuntimeConfig().public.comment
const github = useRuntimeConfig().public.github

const route = useRoute()
const router = useRouter()

const selectedCategory = ref<string | null>(null)

const { data: contents } = await useAsyncData(route.path, () => {
  return queryCollection('contents')
    .select('id', 'tags', 'title', 'date', 'description', 'path', 'body')
    .order('date', 'DESC')
    .limit(3)
    .all()
})

const { data: allPosts } = await useAsyncData('all-posts', () => {
  return queryCollection('contents')
    .select('id', 'tags', 'title', 'date', 'description', 'path')
    .order('date', 'DESC')
    .all()
})

const categories = computed<Category[]>(() => {
  if (!allPosts.value) return []

  const categoryMap = new Map<string, Post[]>()

  allPosts.value.forEach((post) => {
    const categoryPath = post.path.split('/')[2]
    if (categoryPath) {
      if (!categoryMap.has(categoryPath)) {
        categoryMap.set(categoryPath, [])
      }
      categoryMap.get(categoryPath)!.push({
        title: post.title,
        path: post.path,
        date: post.date,
        tags: post.tags || [],
        description: post.description,
      })
    }
  })

  return Array.from(categoryMap.entries()).map(([name, posts]) => ({
    name,
    count: posts.length,
    posts,
  }))
})

function handleSelectPost(post: Post) {
  router.push(post.path)
}

function handleSelectCategory(category: string | null) {
  selectedCategory.value = category
}
</script>
