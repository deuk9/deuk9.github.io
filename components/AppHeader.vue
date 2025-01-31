<template>
  <header class="flex justify-between items-center  p-3 shadow-md bg-white">
    <div class="font-bold cursor-pointer ml-16 text-xl">
      <NuxtLink to="/">
        {{ author }}.blog
      </NuxtLink>
    </div>
    <div class="flex space-x-4 pr-7">
      <NuxtLink to="/search">
        <UIcon
          name="mdi:magnify"
          class="w-5 h-5"
        />
      </NuxtLink>
      <NuxtLink to="/tags">
        <UIcon
          name="mdi:tag"
          class="w-5 h-5"
        />
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
const author = useRuntimeConfig().public.author
</script>
