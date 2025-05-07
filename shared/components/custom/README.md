# Custom Components

This directory contains custom Vue components that are specific to the JSR application and shared across the frontend and admin applications.

## Usage

Components from this directory should be imported using the `@jsr/shared/components/custom` path alias:

```typescript
import { ResourceCard } from '@jsr/shared/components/custom/ResourceCard';
```

## Component Design

Custom components should follow these guidelines:

1. Use the shadcn-vue components from the UI directory whenever possible
2. Maintain consistent styling with the zinc color palette
3. Include proper TypeScript typings for props and emits
4. Document the component's purpose and usage in the component file
5. Write tests for complex components

## Available Components

This directory will include the following custom components:

- ResourceCard (displays a learning resource with title, description, tags, etc.)
- CategoryBadge (shows a category with appropriate styling)
- DifficultyIndicator (visual indicator of resource difficulty)
- PricingBadge (indicates if a resource is free or paid)

Additional components will be added as needed throughout development. 