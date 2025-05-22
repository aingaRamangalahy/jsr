# UI Components

This directory contains shadcn-vue UI components that are shared across the frontend and admin applications.

## Usage

Components from this directory should be imported using the `@jsr/shared/components/ui` path alias:

```typescript
import { Button } from '@jsr/shared/components/ui/button';
```

## Component Installation

shadcn-vue components should be installed following the manual installation process:

1. Follow the [shadcn-vue manual installation guide](https://www.shadcn-vue.com/docs/installation/manual.html)
2. Install component dependencies as needed
3. Copy component files to this directory
4. Make sure to use zinc color palette for consistency

## Available Components

Initially, this directory will be populated with the following components:

- Button
- Card
- Form elements (Input, Select, Checkbox)
- Dialog
- Table

Additional components will be added as needed throughout development. 