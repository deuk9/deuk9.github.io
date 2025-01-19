<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('paths')
    .select('path', 'tags', 'id')
    .all()
})
</script>

<template>
  <div>
    <p>{{ page }}</p>
  </div>
</template>

<style scoped>

</style>
