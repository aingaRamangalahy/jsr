<template>
  <Card class="mb-4 bg-white dark:bg-[#1e1f23] border border-gray-200 dark:border-[#27292f]">
    <template #content>
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0"
      >
        <h2 class="text-lg font-semibold flex items-center text-gray-900 dark:text-blue-300">
          <i class="pi pi-filter mr-2"></i>
          Filters
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
          <Select
            v-model="type"
            :options="typeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Resource type"
            class="w-36"
          />
          <Select
            v-model="skillLevel"
            :options="levelOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Skill level"
            class="w-36"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import Card from '@/volt/Card.vue'
  import Select from '@/volt/Select.vue'
  import Button from '@/volt/Button.vue'
  import { useFilters } from '@/composables/useFilters'

  const {
    filters,
    updateFilter,
    clearFilters,
    getSortOptions,
    getTypeOptions,
    getSkillLevelOptions,
  } = useFilters()

  // Set up reactive bindings to store filters
  const sortBy = computed({
    get: () => filters.value.sortBy,
    set: (value) => updateFilter('sortBy', value),
  })

  const type = computed({
    get: () => filters.value.type,
    set: (value) => updateFilter('type', value),
  })

  const skillLevel = computed({
    get: () => filters.value.skillLevel,
    set: (value) => updateFilter('skillLevel', value),
  })

  const sortOptions = getSortOptions()
  const typeOptions = getTypeOptions()
  const levelOptions = getSkillLevelOptions()

  // Check if any non-default filters are active
  const hasActiveFilters = computed(() => {
    return (
      filters.value.sortBy !== 'newest' ||
      filters.value.type !== 'all' ||
      filters.value.skillLevel !== 'all' ||
      filters.value.frameworks.length > 0 ||
      filters.value.category !== 'all' ||
      filters.value.search !== ''
    )
  })
</script>
