<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 dark:text-white transition-colors duration-300">
    <AppHeader />
    <div class="mt-8">
      <slot />
    </div>
    <AppFooter class="h-8" />
  </div>
</template>

<script setup lang="ts">
</script>
