<template>
  <Badge 
    :variant="pricingType" 
    :class="props.class"
  >
    {{ pricingType === 'free' ? 'Free' : formatPrice(price || 0) }}
  </Badge>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

interface Props {
  pricingType: 'free' | 'paid';
  price?: number;
  class?: string;
}

const props = defineProps<Props>();

defineExpose({});
</script> 