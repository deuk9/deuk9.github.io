<template>
  <div>
    <AppHeader class="border h-8 border-gray-200" />
    <div class="flex justify-center">
      <!--      <div> -->
      <!--        <AppAside class="fixed top-60 left-64 " /> -->
      <!--      </div> -->
      <!-- 왼쪽 div의 고정 위치를 본문에 가깝게 설정합니다 -->
      <!--      <div class="w-96"> -->
      <!--        <AppAside class=" top-60 left-0" /> -->
      <!--      </div> -->
      <!-- ml-0으로 본문과 왼쪽 div의 간격을 없앱니다 -->
      <div class="ml-0 w-full max-w-4xl px-6">
        <slot />
      </div>
      <!--      <div class="border-gray-200"> -->
      <!--        <aside>어사이드</aside> -->
      <!--      </div> -->
    </div>
    <!--    <AppFooter /> -->
  </div>
</template>

<script setup lang="ts">
</script>
