<template>
  <footer
    class="bg-white text-gray-500 text-xs text-center p-2  w-full"
  >
    <p>© 2025 {{ author }}.blog. Built with Nuxt.</p>
  </footer>
</template>

<script lang="ts" setup>
const author = useRuntimeConfig().public.author
</script>
