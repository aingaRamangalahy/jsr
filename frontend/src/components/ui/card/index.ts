import { cva } from 'class-variance-authority'

export { default as Card } from './Card.vue'
export { default as CardContent } from './CardContent.vue'
export { default as CardDescription } from './CardDescription.vue'
export { default as CardFooter } from './CardFooter.vue'
export { default as CardHeader } from './CardHeader.vue'
export { default as CardTitle } from './CardTitle.vue'

export const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: '',
        outline: 'shadow-none',
        premium: 'border-primary shadow-md',
        free: 'border-green-500 shadow-md',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
) 