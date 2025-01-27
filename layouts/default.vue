<template>
  <div>
    <AppHeader />
    <div class="flex justify-center mt-8">
      <div class="ml-0 w-full max-w-4xl">
        <slot />
      </div>
    </div>
    <AppFooter class="border h-8 border-gray-200" />
  </div>
</template>

<script setup lang="ts">
</script>
