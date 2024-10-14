<template>
  <div>
    <AppHeader />
    <div class="flex">
      <!-- 왼쪽 고정 메뉴바 -->
      <AppAside class="fixed top-32 w-64  bg-gray-200" />

      <!-- 본문 내용 영역 -->
      <div class="ml-96 w-full max-w-3xl px-6">
        <slot />
      </div>

      오른쪽 인덱스 (본문 목차 영역)
      <div class="hidden lg:block w-64 h-screen fixed top-16 right-0 bg-gray-100 border-l pl-4">
        <div class="sticky top-20">
          <!-- 인덱스 내용 -->
          <h2 class="font-semibold">
            Index
          </h2>
          <ul>
            <li>
              <a
                href="#section1"
                class="text-blue-500"
              >Section 1</a>
            </li>
            <li>
              <a
                href="#section2"
                class="text-blue-500"
              >Section 2</a>
            </li>
            <li>
              <a
                href="#section3"
                class="text-blue-500"
              >Section 3</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
