<script setup lang="ts">
/**
 * PricingBadge Component
 * 
 * Displays a badge indicating whether a resource is free or paid.
 * For paid resources, it optionally displays the price.
 */
import { computed } from 'vue';
import { PricingType } from '../../types';

// Props
interface Props {
  /**
   * The pricing type of the resource (free or paid)
   */
  pricingType: PricingType;
  
  /**
   * The price of the resource (required if pricingType is 'paid')
   */
  price?: number;
}

const props = defineProps<Props>();

// Computed
const displayText = computed(() => {
  if (props.pricingType === 'free') {
    return 'Free';
  } else {
    return props.price ? `$${props.price.toFixed(2)}` : 'Paid';
  }
});

const badgeClass = computed(() => {
  return props.pricingType === 'free' 
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
});
</script>

<template>
  <span 
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
    :class="badgeClass"
  >
    {{ displayText }}
  </span>
</template> 