<template>
  <Card class="h-full min-w-[300px] w-full relative flex flex-col overflow-hidden pt-0">
    <!-- Skeleton for image -->
    <Skeleton class="w-full h-40 rounded-t-lg" />

    <CardHeader class="pb-0 pt-0 space-y-2">
      <!-- Skeleton for title -->
      <div class="flex items-center gap-2">
        <Skeleton class="w-5 h-5 rounded-full" />
        <Skeleton class="h-7 w-full" />
      </div>
    </CardHeader>

    <!-- Skeleton for description -->
    <CardContent class="flex-grow py-3">
      <Skeleton class="h-4 w-full mb-2" />
      <Skeleton class="h-4 w-11/12 mb-2" />
      <Skeleton class="h-4 w-3/4 mb-4" />

      <!-- Skeleton for tags -->
      <div class="flex flex-wrap gap-2 mt-4">
        <Skeleton class="h-5 w-16" />
        <Skeleton class="h-5 w-20" />
        <Skeleton class="h-5 w-14" />
      </div>
    </CardContent>

    <!-- Skeleton for footer -->
    <CardFooter class="pt-3 border-t flex justify-between items-center">
      <!-- Upvote/Downvote skeletons -->
      <div class="flex items-center gap-2">
        <Skeleton class="h-8 w-16 rounded-full" />
        <Skeleton class="h-8 w-8 rounded-full" />
      </div>

      <!-- Action buttons skeletons -->
      <div class="flex items-center">
        <Skeleton class="h-8 w-12 rounded-full mr-1" />
        <Skeleton class="h-8 w-8 rounded-full mr-1" />
        <Skeleton class="h-8 w-8 rounded-full" />
      </div>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

defineOptions({
  name: 'ResourceCardSkeleton'
})
</script>

<script lang="ts">
export default {
  name: 'ResourceCardSkeleton'
}
</script> 