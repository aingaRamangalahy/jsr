<template>
  <Card
    unstyled
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
  >
    <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </Card>
</template>

<script setup lang="ts">
  import Card, { type CardPassThroughOptions, type CardProps } from 'primevue/card'
  import { ref } from 'vue'
  import { ptViewMerge } from './utils'

  interface Props extends /* @vue-ignore */ CardProps {}
  defineProps<Props>()

  const theme = ref<CardPassThroughOptions>({
    root: `flex flex-col rounded-xl
        bg-white dark:bg-[#1e1f23]
        text-gray-700 dark:text-gray-200
        border border-gray-200 dark:border-[#27292f]
        shadow-md`,
    header: ``,
    body: `p-5 flex flex-col gap-2`,
    caption: `flex flex-col gap-2`,
    title: `font-medium text-xl`,
    subtitle: `text-gray-500 dark:text-gray-400`,
    content: ``,
    footer: ``,
  })
</script>
