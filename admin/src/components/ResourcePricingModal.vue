<template>
  <div v-if="isOpen" class="pricing-modal fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="modal-content bg-card p-6 rounded-lg shadow-xl w-full max-w-md relative">
      <button 
        @click="close" 
        class="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
      >
        ✕
      </button>
      
      <h2 class="text-xl font-semibold mb-4">Edit Resource Pricing</h2>
      
      <div class="space-y-4">
        <!-- Pricing Type Selection -->
        <div>
          <label class="block text-sm font-medium mb-1">Pricing Type</label>
          <div class="space-y-2">
            <div class="flex items-center">
              <input 
                type="radio" 
                id="free-option" 
                v-model="pricingType" 
                value="free" 
                class="mr-2"
              />
              <label for="free-option">Free Resource</label>
            </div>
            <div class="flex items-center">
              <input 
                type="radio" 
                id="paid-option" 
                v-model="pricingType" 
                value="paid" 
                class="mr-2"
              />
              <label for="paid-option">Paid Resource</label>
            </div>
          </div>
        </div>
        
        <!-- Price Input (shown only for paid resources) -->
        <div v-if="pricingType === 'paid'" class="space-y-2">
          <label for="price-input" class="block text-sm font-medium">Price ($)</label>
          <input
            id="price-input"
            v-model="price"
            type="number"
            min="0.01"
            step="0.01"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter price (e.g. 9.99)"
            :class="{ 'border-destructive': priceError }"
          />
          <p v-if="priceError" class="text-sm text-destructive">{{ priceError }}</p>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 mt-6">
          <button 
            @click="close" 
            class="px-4 py-2 rounded border border-input bg-background text-sm font-medium"
          >
            Cancel
          </button>
          <button 
            @click="savePricing" 
            class="px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            :disabled="loading"
          >
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { resourceService } from '../services/resource.service'
import type { PricingType } from '@jsr/shared/types'

// Props
interface Props {
  isOpen: boolean;
  resourceId: string;
  initialPricingType: PricingType;
  initialPrice?: number;
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved'): void;
}>()

// State
const pricingType = ref<PricingType>(props.initialPricingType)
const price = ref<number | undefined>(props.initialPrice)
const priceError = ref<string>('')
const loading = ref<boolean>(false)

// Watch for prop changes
watch(() => props.initialPricingType, (newType) => {
  pricingType.value = newType
})

watch(() => props.initialPrice, (newPrice) => {
  price.value = newPrice
})

// Methods
const validatePrice = (): boolean => {
  if (pricingType.value === 'paid') {
    if (!price.value || price.value <= 0) {
      priceError.value = 'Please enter a valid price greater than 0'
      return false
    }
  }
  priceError.value = ''
  return true
}

const savePricing = async () => {
  if (!validatePrice()) return
  
  try {
    loading.value = true
    
    await resourceService.updateResourcePricing(
      props.resourceId,
      pricingType.value,
      pricingType.value === 'paid' ? price.value : undefined
    )
    
    emit('saved')
    close()
  } catch (error) {
    console.error('Failed to update pricing:', error)
    priceError.value = 'Failed to update pricing. Please try again.'
  } finally {
    loading.value = false
  }
}

const close = () => {
  emit('close')
}
</script> 