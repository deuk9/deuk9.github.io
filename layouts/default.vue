<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 dark:text-white transition-colors duration-300">
    <AppHeader />
    <div class="flex justify-center mt-8">
      <div class="ml-0 w-full max-w-3xl">
        <slot />
      </div>
    </div>
    <AppFooter class="h-8" />
  </div>
</template>

<script setup lang="ts">
</script>
