<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Primitive, type PrimitiveProps } from 'reka-ui'

interface Props extends PrimitiveProps {
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'h3',
})
</script>

<template>
  <Primitive
    data-slot="title"
    :as="as"
    :as-child="asChild"
    :class="cn('text-2xl font-semibold leading-none tracking-tight', props.class)"
  >
    <slot />
  </Primitive>
</template> 