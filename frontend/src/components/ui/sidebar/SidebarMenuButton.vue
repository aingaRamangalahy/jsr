<script setup lang="ts">
import { type Component, computed } from 'vue'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import SidebarMenuButtonChild, { type SidebarMenuButtonProps } from './SidebarMenuButtonChild.vue'
import { useSidebar } from './utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SidebarMenuButtonProps & {
  tooltip?: string | Component
}>(), {
  as: 'button',
  variant: 'default',
  size: 'default',
})

const { isMobile, state } = useSidebar()

const typedAs = computed(() => props.as as any)
</script>

<template>
  <template v-if="!tooltip">
    <SidebarMenuButtonChild
      :as="typedAs"
      :variant="props.variant"
      :size="props.size"
      :isActive="props.isActive"
      :class="props.class"
      :asChild="props.asChild"
      v-bind="$attrs"
    >
      <slot />
    </SidebarMenuButtonChild>
  </template>

  <Tooltip v-else>
    <TooltipTrigger as-child>
      <SidebarMenuButtonChild
        :as="typedAs"
        :variant="props.variant"
        :size="props.size"
        :isActive="props.isActive"
        :class="props.class"
        :asChild="props.asChild"
        v-bind="$attrs"
      >
        <slot />
      </SidebarMenuButtonChild>
    </TooltipTrigger>
    <TooltipContent
      side="right"
      align="center"
      :hidden="state !== 'collapsed' || isMobile"
    >
      <template v-if="typeof tooltip === 'string'">
        {{ tooltip }}
      </template>
      <component :is="tooltip" v-else />
    </TooltipContent>
  </Tooltip>
</template>
