<template>
  <div>
    <div
      v-for="post in filteredContents"
      :key="post.id"
      class="mt-3"
    >
      <PostCard
        :post="{
          id: post.id,
          date: post.date,
          title: post.title,
          tags: post.tags,
          description: post.description,
          path: post.path,
          content: post,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PostCard from '~/components/card/PostCard.vue'

const route = useRoute()
const id = route.params.id

const { data: contents } = await useAsyncData(route.path, () => {
  return queryCollection('contents')
    .select('tags', 'title', 'date', 'description', 'path')
    .order('date', 'desc')
    .all()
})

const filteredContents = contents.value?.filter(item => item.tags.includes(id))

// event
</script>

<style scoped>

</style>
