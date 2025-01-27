<template>
  <header class="flex justify-between items-center  p-3 shadow-md bg-white">
    <div class="font-bold cursor-pointer ml-16 text-xl">
      <a :href="`/`">{{ author }}.blog</a>
    </div>
    <div class="flex space-x-4 pr-7">
      <NuxtLink to="/">
        <UIcon
          name="mdi:home-variant"
          class="w-5 h-5"
        />
      </NuxtLink>
      <NuxtLink to="/tags">
        <UIcon
          name="mdi:tag-outline"
          class="w-5 h-5"
        />
      </NuxtLink>
      <NuxtLink to="/categories">
        <UIcon
          name="mdi:folder-multiple"
          class="w-5 h-5"
        />
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
const author = useRuntimeConfig().public.author
</script>
