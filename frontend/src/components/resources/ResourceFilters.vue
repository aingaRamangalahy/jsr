<template>
  <Card class="mb-4 bg-white dark:bg-[#1e1f23] border border-gray-200 dark:border-[#27292f]">
    <template #content>
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0"
      >
        <h2 class="text-lg font-semibold flex items-center text-gray-900 dark:text-blue-300">
          <i class="pi pi-filter mr-2"></i>
          Active Filters
          <span
            v-if="hasActiveFilters"
            class="ml-2 text-xs font-normal px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full"
          >
            {{ activeFilterCount }}
          </span>
          <Button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="ml-3 text-xs text-gray-500 dark:text-blue-300 hover:text-gray-700 dark:hover:text-indigo-400"
            text
          >
            Clear all
          </Button>
        </h2>
        <div class="flex flex-wrap gap-2">
          <Select
            v-model="sortBy"
            :options="sortOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Sort by"
            class="w-36"
          />
        </div>
      </div>

      <!-- Active filters chips -->
      <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mt-3">
        <Chip
          v-if="filters.type !== 'all'"
          :label="`Type: ${getTypeName(filters.type)}`"
          class="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
          :removable="true"
          @remove="clearTypeFilter"
        />

        <Chip
          v-if="filters.skillLevel !== 'all'"
          :label="`Level: ${getSkillLevelName(filters.skillLevel)}`"
          class="bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300"
          :removable="true"
          @remove="clearSkillLevelFilter"
        />

        <Chip
          v-if="filters.sortBy !== 'newest'"
          :label="`Sort: ${getSortName(filters.sortBy)}`"
          class="bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
          :removable="true"
          @remove="clearSortFilter"
        />

        <Chip
          v-for="framework in filters.frameworks"
          :key="framework"
          :label="`${framework}`"
          class="bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-300"
          :removable="true"
          @remove="() => removeFramework(framework)"
        />

        <Chip
          v-if="filters.search"
          :label="`Search: ${filters.search}`"
          class="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300"
          :removable="true"
          @remove="clearSearchFilter"
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from '@/volt/Card.vue';
import Select from '@/volt/Select.vue';
import Button from '@/volt/Button.vue';
import Chip from '@/volt/Chip.vue';
import { useFilters } from '@/composables/useFilters';
import type { FrameworkFilters } from '@jsr/common';

const {
  filters,
  updateFilter,
  clearFilters,
  getSortOptions,
  getTypeOptions,
  getSkillLevelOptions,
  toggleFramework,
  setSearchQuery,
} = useFilters();

// Set up reactive bindings to store filters
const sortBy = computed({
  get: () => filters.value.sortBy,
  set: (value) => updateFilter('sortBy', value),
});

const type = computed({
  get: () => filters.value.type,
  set: (value) => updateFilter('type', value),
});

const skillLevel = computed({
  get: () => filters.value.skillLevel,
  set: (value) => updateFilter('skillLevel', value),
});

const sortOptions = getSortOptions();
const typeOptions = getTypeOptions();
const levelOptions = getSkillLevelOptions();

// Helper methods for display names
const getTypeName = (typeId: string) => {
  const option = typeOptions.find((opt) => opt.value === typeId);
  return option ? option.label : typeId;
};

const getSkillLevelName = (levelId: string) => {
  const option = levelOptions.find((opt) => opt.value === levelId);
  return option ? option.label : levelId;
};

const getSortName = (sortId: string) => {
  const option = sortOptions.find((opt) => opt.value === sortId);
  return option ? option.label : sortId;
};

// Individual filter clear methods
const clearTypeFilter = () => updateFilter('type', 'all');
const clearSkillLevelFilter = () => updateFilter('skillLevel', 'all');
const clearSortFilter = () => updateFilter('sortBy', 'newest');
const clearSearchFilter = () => setSearchQuery('');
const removeFramework = (framework: FrameworkFilters) => toggleFramework(framework);

// Check if any non-default filters are active
const hasActiveFilters = computed(() => {
  return (
    filters.value.sortBy !== 'newest' ||
    filters.value.type !== 'all' ||
    filters.value.skillLevel !== 'all' ||
    filters.value.frameworks.length > 0 ||
    filters.value.search !== ''
  );
});

// Count active filters for the badge
const activeFilterCount = computed(() => {
  let count = 0;
  if (filters.value.sortBy !== 'newest') count++;
  if (filters.value.type !== 'all') count++;
  if (filters.value.skillLevel !== 'all') count++;
  count += filters.value.frameworks.length;
  if (filters.value.search !== '') count++;
  return count;
});
</script>
