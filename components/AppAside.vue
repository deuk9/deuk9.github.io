<template>
  <UVerticalNavigation
    :links="links"
  />
</template>

<script setup lang="ts">
const links = [
  [{
    label: 'Profile',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4',
    },
    badge: 100,
  }, {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  }, {
    label: 'Tags',
    icon: 'i-mdi:tag-search',
    to: '/tags',
  }, {
    label: 'categories',
    icon: 'i-fa6-solid:folder',
    to: '/categories',
  }], [{
    label: 'Examples',
    icon: 'i-heroicons-light-bulb',
  }, {
    label: 'Help',
    icon: 'i-heroicons-question-mark-circle',
  }],
]
</script>
