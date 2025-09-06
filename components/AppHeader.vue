<template>
  <header class="flex justify-between items-center p-3 shadow-md bg-white dark:bg-gray-800 dark:text-white">
    <div class="font-bold cursor-pointer ml-4 sm:ml-16 text-xl">
      <NuxtLink to="/">
        {{ author }}.blog
      </NuxtLink>
    </div>
    <div class="flex space-x-4 pr-2 sm:pr-7">
      <button
        class="focus:outline-none"
        aria-label="Toggle dark mode"
        @click="toggleDarkMode"
      >
        <Icon
          :name="isDark ? 'mdi:white-balance-sunny' : 'mdi:moon-waning-crescent'"
          class="w-5 h-5"
        />
      </button>
      <NuxtLink to="/search">
        <Icon
          name="mdi:magnify"
          class="w-5 h-5"
        />
      </NuxtLink>
      <NuxtLink to="/tags">
        <Icon
          name="mdi:tag"
          class="w-5 h-5"
        />
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
const author = useRuntimeConfig().public.author
const isDark = ref(false)

// Check for saved color scheme preference or use user's system preference
onMounted(() => {
  if (
    localStorage.theme === 'dark'
    || (!('theme' in localStorage)
      && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
    isDark.value = true
  }
  else {
    document.documentElement.classList.remove('dark')
    isDark.value = false
  }
})

// Toggle dark mode
function toggleDarkMode() {
  isDark.value = !isDark.value

  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
  }
  else {
    document.documentElement.classList.remove('dark')
    localStorage.theme = 'light'
  }
}
</script>
