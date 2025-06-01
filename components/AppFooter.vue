<template>
  <footer
    class="bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-300 text-xs text-center p-2 w-full transition-colors duration-300"
  >
    <p>© 2025 {{ author }}.blog. Built with Nuxt.</p>
  </footer>
</template>

<script lang="ts" setup>
const author = useRuntimeConfig().public.author
</script>
