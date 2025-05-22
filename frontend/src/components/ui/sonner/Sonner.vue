<template>
  <Toaster v-bind="props" />
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import type { ToasterProps } from 'vue-sonner'

const props = defineProps<ToasterProps>()
</script>
