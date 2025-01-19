<script setup lang="ts">
import PostCard from '~/components/tags/PostCard.vue'

const route = useRoute()
const id = route.params.id

const { data: contents } = await useAsyncData(route.path, () => {
  return queryCollection('contents')
    .select('tags', 'title', 'date', 'description', 'path')
    .all()
})

const filteredContents = contents.value?.filter(item => item.tags.includes(id))
</script>

<template>
  <div>
    <div>{{ filteredContents }}</div>
    <div>{{ t }}</div>
    <PostCard
      v-for="post in filteredContents"
      :key="post.id"
      :post="{
        id: post.id,
        date: post.date,
        title: post.title,
        tags: post.tags,
        description: post.description,
      }"
    />
  </div>
</template>

<style scoped>

</style>
