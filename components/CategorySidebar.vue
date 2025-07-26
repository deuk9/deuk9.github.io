<template>
  <div>
    <div class="w-56 mt-64 mr-16 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        📁 Categories
      </h3>
      <div class="space-y-2">
        <div
          v-for="category in categories"
          :key="category.name"
          class="cursor-pointer"
        >
          <div
            class="flex items-center justify-between p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            :class="{ 'bg-blue-100 dark:bg-blue-900': selectedCategory === category.name }"
            @click="toggleCategory(category.name)"
          >
            <div class="flex items-center space-x-2">
              <UIcon
                :name="expandedCategories.includes(category.name) ? 'mdi:chevron-down' : 'mdi:chevron-right'"
                class="w-4 h-4"
              />
              <span class="text-sm font-medium">
                {{ category.name }}({{ category.count }})
              </span>
            </div>
          </div>

          <div
            v-if="expandedCategories.includes(category.name)"
            class="ml-6 mt-2 space-y-1"
          >
            <div
              v-for="post in category.posts"
              :key="post.path"
              class="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer p-1 rounded"
              @click="navigateToPost(post)"
            >
              {{ post.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

defineProps<{
  categories: Category[]
  selectedCategory: string | null
}>()

defineEmits<{
  selectPost: [post: Post]
  selectCategory: [category: string | null]
}>()

const expandedCategories = ref<string[]>([])

function toggleCategory(categoryName: string) {
  const index = expandedCategories.value.indexOf(categoryName)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  }
  else {
    expandedCategories.value.push(categoryName)
  }

  // 카테고리 선택 이벤트 발생
  const emit = getCurrentInstance()?.emit
  emit?.('selectCategory', categoryName)
}

function navigateToPost(post: Post) {
  const path = post.path.endsWith('/') ? post.path : post.path + '/'
  navigateTo(path)
}
</script>
