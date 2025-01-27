<template>
  <footer
    :class="[
      'bg-white text-gray-500 text-xs  m text-center p-2 fixed bottom-0 left-0 w-full',
      showFooter ? 'block' : 'hidden',
    ]"
  >
    <p>© 2025 {{ author }}.blog. Built with Nuxt.</p>
  </footer>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

const author = useRuntimeConfig().public.author
const showFooter = ref(false)

const handleScroll = () => {
  const hasScroll = document.documentElement.scrollHeight > window.innerHeight
  const scrolledToBottom
      = Math.ceil(window.innerHeight + window.scrollY)
        >= document.documentElement.scrollHeight

  // 스크롤이 없는 경우 항상 표시, 스크롤이 있는 경우 마지막에만 표시
  showFooter.value = !hasScroll || scrolledToBottom
}

onMounted(() => {
  handleScroll() // 초기 상태 확인
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
