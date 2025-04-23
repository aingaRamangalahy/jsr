<template>
  <Card
    class="overflow-hidden hover:shadow-md transition-shadow duration-200 bg-white dark:bg-[#1e1f23] border border-gray-200 dark:border-[#1e1f23]"
  >
    <template #content>
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Resource Image -->
        <div
          class="w-full md:w-20 h-48 md:h-20 flex-shrink-0 rounded overflow-hidden cursor-pointer"
          @click="visitResource(resource.url)"
        >
          <img
            :src="resource.image"
            :alt="`${resource.title} cover`"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>

        <div class="flex flex-col flex-grow">
          <!-- Header with title and type -->
          <div class="flex items-start justify-between mb-2">
            <div @click="visitResource(resource.url)" class="cursor-pointer">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-semibold text-xl text-gray-900 dark:text-gray-200">
                  {{ resource.title }}
                </h3>
                <component
                  :is="getTypeIcon(resource.type)"
                  class="text-gray-500 dark:text-teal-400"
                  :size="18"
                />
              </div>
              <p class="text-gray-700 dark:text-gray-400 line-clamp-3 mb-3">
                {{ resource.description }}
              </p>
            </div>
          </div>

          <!-- Tags -->
          <div class="flex justify-between">
            <div class="flex flex-wrap gap-2 mb-4 text-sm font-medium">
              <Chip
                :pt:root:class="getSkillLevelChipClass(resource.skillLevel)"
                :label="formatSkillLevel(resource.skillLevel)"
              />

              <template v-for="(tag, index) in resource.tags.slice(0, 2)" :key="index">
                <Chip
                  :label="tag"
                  class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                />
              </template>

              <Chip
                v-if="resource.tags.length > 2"
                :label="`+${resource.tags.length - 2} more`"
                class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              />
            </div>
            <Button text severity="primary" class="text-blue-600 dark:text-blue-400">
              <i class="pi pi-external-link"></i>
              <a :href="resource.url" target="_blank" rel="noopener noreferrer">Visit</a>
            </Button>
          </div>

          <!-- Actions -->
          <div
            v-if="false"
            class="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center"
          >
            <div class="flex items-center gap-4">
              <Button
                text
                @click="handleVote"
                :class="
                  voted ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-200'
                "
              >
                <i
                  class="pi pi-thumbs-up"
                  :class="voted ? 'text-blue-600 dark:text-blue-400' : ''"
                ></i>
                {{ voteCount }}
              </Button>

              <Button text class="text-gray-600 dark:text-gray-200">
                <i class="pi pi-comments"></i>
                Comment
              </Button>

              <Button
                text
                @click="toggleBookmark"
                :class="
                  bookmarked
                    ? 'text-amber-500 dark:text-teal-400'
                    : 'text-gray-600 dark:text-gray-200'
                "
              >
                <i
                  class="pi pi-bookmark"
                  :class="bookmarked ? 'text-amber-500 dark:text-teal-400' : ''"
                ></i>
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Card from '@/volt/Card.vue';
import Button from '@/volt/Button.vue';
import Chip from '@/volt/Chip.vue';
import { BookOpenIcon, GlobeIcon, TwitterIcon, YoutubeIcon } from 'lucide-vue-next';
import type { Resource } from '@jsr/common';

const props = defineProps<{
  resource: Resource;
}>();

const voted = ref(false);
const bookmarked = ref(false);
const voteCount = ref(props.resource.votes || 0);

const handleVote = () => {
  if (voted.value) {
    voteCount.value--;
  } else {
    voteCount.value++;
  }
  voted.value = !voted.value;
};

const toggleBookmark = () => {
  bookmarked.value = !bookmarked.value;
};

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = 'https://images.pexels.com/photos/965345/pexels-photo-965345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'book':
      return BookOpenIcon;
    case 'youtube':
      return YoutubeIcon;
    case 'twitter':
      return TwitterIcon;
    default:
      return GlobeIcon;
  }
};

const getSkillLevelChipClass = (level: string) => {
  const normalizedLevel = (level || '').toLowerCase().trim();
  switch (normalizedLevel) {
    case 'beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-teal-400';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400';
    case 'advanced':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

const formatSkillLevel = (level: string) => {
  return level.charAt(0).toUpperCase() + level.slice(1);
};

const visitResource = (url: string) => {
  window.open(url, '_blank');
};
</script>
