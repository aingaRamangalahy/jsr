<script setup lang="ts">
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { truncateText, formatPrice } from '@/lib/utils';

interface Resource {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pricingType: 'free' | 'paid';
  price?: number;
  url: string;
}

interface Props {
  resource: Resource;
}

const props = defineProps<Props>();

function openResource() {
  window.open(props.resource.url, '_blank');
}

// Add default export
export default {}
</script>

<template>
  <Card 
    :variant="props.resource.pricingType === 'free' ? 'free' : 'premium'"
    class="h-full flex flex-col transition-all hover:shadow-md"
  >
    <CardHeader>
      <div class="flex justify-between items-start">
        <CardTitle class="text-xl">{{ props.resource.name }}</CardTitle>
        <Badge :variant="props.resource.pricingType">
          {{ props.resource.pricingType === 'free' 
            ? 'Free' 
            : formatPrice(props.resource.price || 0) }}
        </Badge>
      </div>
      <CardDescription>
        {{ props.resource.category }} • {{ props.resource.difficulty }}
      </CardDescription>
    </CardHeader>
    
    <CardContent class="flex-grow">
      <p>{{ truncateText(props.resource.description, 120) }}</p>
    </CardContent>
    
    <CardFooter class="pt-4">
      <Button @click="openResource" class="w-full">
        Open Resource
      </Button>
    </CardFooter>
  </Card>
</template> 