<template>
  <main>
    <UBreadcrumb
      :links="links"
      :ui="ui"
    />
    <ContentDoc class="mt-16" />
  </main>
</template>

<script setup lang="ts">
const links = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/',
}, {
  label: 'Navigation',
  icon: 'i-heroicons-square-3-stack-3d',
}, {
  label: 'Breadcrumb',
  icon: 'i-heroicons-link',
}]
const ui = {
  ol: 'justify-center',
}
</script>
