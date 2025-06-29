<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 dark:text-white transition-colors duration-300">
    <AppHeader />
    <div class="flex justify-center mt-8">
      <div class="w-full max-w-3xl px-4 sm:px-0">
        <slot />
      </div>
    </div>
    <AppFooter class="h-8" />
  </div>
</template>

<script setup lang="ts">
</script>
