<script lang="ts" setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('contents')
    .path(route.path)
    .first()
})
</script>

<template>
  <div>
    <header>
      <p class="text-5xl mb-2">
        해더입니다
      </p>
      <p>날짜</p>
      <p>태그</p>
    </header>
    <ContentRenderer
      v-if="page"
      :value="page"
    />

    <footer>푸터입니다</footer>
  </div>
</template>
