<template>
  <header class="flex justify-between items-center p-4 shadow-md bg-white">
    <div class="text-xl font-bold cursor-pointer">
      deuk.9.blog
    </div>
    <div class="flex space-x-4">
      <NuxtLink to="/">
        <UButton icon="i-heroicons-home">Home</UButton>
      </NuxtLink>
      <NuxtLink to="/tags">
        <UButton icon="i-mdi:tag-search">Tags</UButton>
      </NuxtLink>
      <NuxtLink to="/categories">
        <UButton icon="i-fa6-solid:folder">Categories</UButton>
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>
