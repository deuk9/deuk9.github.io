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
      <p>
        해더입니다
      </p>
    </header>
    <ContentRenderer
      v-if="page"
      :value="page"
    />

    <footer>푸터입니다</footer>
  </div>
</template>
