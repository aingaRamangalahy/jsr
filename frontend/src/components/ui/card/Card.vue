<template>
  <Primitive
    data-slot="card"
    :as="as"
    :as-child="asChild"
    :class="cn(cardVariants({ variant }), props.class)"
  >
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cardVariants } from '.'

interface Props extends PrimitiveProps {
  variant?: 'default' | 'outline' | 'premium' | 'free'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  variant: 'default',
})
</script> 