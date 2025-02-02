<template>
  <figure class="flex flex-col items-center">
    <!-- 이미지 -->
    <NuxtImg
      :src="refinedSrc"
      :alt="alt"
      :placeholder="img(`/${refinedSrc}`, { quality: 80, blur: 3 })"
      format="webp"
      loading="lazy"
      class="w-full  "
    />
    <!-- 캡션 -->
    <figcaption
      v-if="alt"
      class="text-gray-600 text-sm italic text-center mt-4 mb-4"
    >
      <p>{{ alt }}</p>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { joinURL, withLeadingSlash, withTrailingSlash } from 'ufo'
import { computed, useRuntimeConfig } from '#imports'

const img = useImage()

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  width: { type: [String, Number], default: undefined },
  height: { type: [String, Number], default: undefined },
})

const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
    if (_base !== '/' && !props.src.startsWith(_base)) {
      return joinURL(_base, props.src)
    }
  }
  return props.src
})
</script>
