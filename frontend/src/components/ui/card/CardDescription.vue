<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Primitive, type PrimitiveProps } from 'reka-ui'

interface Props extends PrimitiveProps {
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'p',
})
</script>

<template>
  <Primitive
    data-slot="description"
    :as="as"
    :as-child="asChild"
    :class="cn('text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </Primitive>
</template> 