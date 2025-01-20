<template>
  <div>
    <div class="flex flex-wrap w-96 border-2">
      <div
        v-for="([tag, count]) in allTags"
        :key="tag"
        class="m-1"
      >
        <UButton
          :to="{ name: 'tags-id', params: { id: tag } }"
        >
          {{ tag }}({{ count }})
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: contents } = await useAsyncData(route.path, () => {
  return queryCollection('contents')
    .select('tags')
    .all()
})
const allTags = contents.value
  ?.flatMap((tag) => {
    return tag.tags
  })
  .reduce((acc, tag) => acc.set(tag, (acc.get(tag) || 0) + 1), new Map())
</script>

<style scoped>

</style>
