<template>
  <ClientOnly>
    <figure class="flex flex-col items-center">
      <!-- 이미지 -->
      <NuxtImg
        :src="refinedSrc"
        :alt="alt"
        :width="width"
        :height="height"

        class="w-full max-w-lg transition-opacity duration-200"
      />
      <!-- 캡션 -->
      <figcaption
        v-if="alt"
        class="text-gray-600 text-sm italic text-center mt-3 mb-2"
      >
        {{ alt }}
      </figcaption>
    </figure>
  </ClientOnly>
</template>

<script setup lang="ts">
import { joinURL, withLeadingSlash, withTrailingSlash } from 'ufo'
import { computed, useRuntimeConfig } from '#imports'

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
      console.log('joinURL', joinURL(_base, props.src))
      return joinURL(_base, props.src)
    }
  }
  console.log('props.src', props.src)
  return props.src
})
</script>
