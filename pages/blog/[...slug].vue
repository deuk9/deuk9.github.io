<template>
  <div class="container mx-auto flex flex-col lg:flex-row gap-6 px-4 py-8">
    <!-- Main Blog Content -->
    <main class="flex-1">
      <!-- Blog Header -->
      <div class="mb-12">
        <h1 class="text-5xl font-bold text-gray-800 mb-2">
          {{ page.title }}
        </h1>
        <div class="text-sm text-gray-500 mt-5">
          <div>
            <time :datetime="page.date">{{ formattedDate }}</time>
          </div>
          <div>
            By
            {{ author }}
          </div>
        </div>
        <!-- Blog Tags -->
        <div class="mt-7 border-b pb-7">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in page.tags"
              :key="tag"
              class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Blog Content -->
      <article>
        <ContentRenderer
          :value="page.body"
          :tag="abc"
        />
      </article>
    </main>

    <!--    Table of Contents Sidebar -->
    <!--    <aside -->
    <!--      class="hidden lg:block w-48 sticky bg-gray-50 shadow-md rounded-md p-3" -->
    <!--    > -->
    <!--      <h2 class="font-semibold text-gray-800 text-base mb-3"> -->
    <!--        Contents -->
    <!--      </h2> -->
    <!--      <TableOfContents :toc="page.body.toc" /> -->
    <!--    </aside> -->
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'

// Fetch blog data
const author = useRuntimeConfig().public.author
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('contents')
    .path(route.path)
    .first()
})

// Format the date
const formattedDate = computed(() => {
  const date = new Date(page.value.date)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

// TOC highlighting logic
onMounted(() => {
  const updateActiveToc = () => {
    const tocItems = document.querySelectorAll('.toc-link')
    tocItems.forEach((item) => {
      const target = document.querySelector(item.getAttribute('href')!)
      if (target) {
        const rect = target.getBoundingClientRect()
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
          item.classList.add('text-blue-500', 'font-bold')
        }
        else {
          item.classList.remove('text-blue-500', 'font-bold')
        }
      }
    })
  }

  window.addEventListener('scroll', updateActiveToc)
})
</script>
