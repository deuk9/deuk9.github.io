<template>
  <div>
    <div>
      <div>
        <p class="text-5xl mb-2">
          해더입니다
        </p>
        <p>날짜</p>
        <p>태그</p>
      </div>
    </div>
    <div
      v-for="post in contents"
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
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PostCard from '~/components/card/PostCard.vue'

const { data: contents } = await useAsyncData('/', () => {
  return queryCollection('contents')
    .select('tags', 'title', 'date', 'description', 'path')
    .order('date', 'desc')
    .limit(10)
    .all()
})
</script>

<style scoped>

</style>
