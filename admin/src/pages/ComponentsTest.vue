<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="flex justify-between items-center px-5 h-[60px] bg-slate-800 text-white">
      <div class="text-2xl font-bold">JSR Admin</div>
      <div class="flex items-center gap-2.5">
        <button class="bg-transparent border border-white text-white px-2.5 py-1.5 rounded hover:bg-white/10">
          Logout
        </button>
      </div>
    </header>
    
    <!-- Main Container -->
    <div class="flex flex-1 min-h-[calc(100vh-60px)]">
      <!-- Sidebar -->
      <aside class="w-[220px] bg-gray-100 py-5">
        <nav>
          <ul class="list-none p-0 m-0">
            <li class="mb-1.5">
              <a href="/dashboard" class="block px-5 py-2.5 text-gray-800 no-underline hover:bg-gray-200">
                Dashboard
              </a>
            </li>
            <li class="mb-1.5">
              <a href="/components" class="block px-5 py-2.5 text-gray-800 no-underline bg-gray-200 font-medium">
                Components Test
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      
      <!-- Main Content -->
      <main class="flex-1 p-5">
        <div class="p-6 space-y-8">
          <h1 class="text-3xl font-bold">JSR Components</h1>
          
          <!-- Tailwind CSS v4 Test Component -->
          <section class="space-y-4">
            <h2 class="text-2xl font-bold">Tailwind CSS v4 Test</h2>
            <div class="p-6 bg-zinc-100 rounded-lg shadow-md">
              <h2 class="text-2xl font-bold text-zinc-800 mb-4">Tailwind CSS v4 Test</h2>
              <p class="text-zinc-600 mb-4">
                This component is using Tailwind CSS v4 styling.
              </p>
              <button class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Test Button
              </button>
            </div>
          </section>
          
          <!-- Button Component Section -->
          <section class="space-y-4">
            <h2 class="text-2xl font-bold">Button Component</h2>
            
            <div class="space-y-2">
              <h3 class="text-lg font-medium">Variants</h3>
              <div class="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
            
            <div class="space-y-2">
              <h3 class="text-lg font-medium">Sizes</h3>
              <div class="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <span class="transform scale-75">+</span>
                </Button>
              </div>
            </div>
          </section>

          <!-- Card Component Section -->
          <section class="space-y-4">
            <h2 class="text-2xl font-bold">Card Component</h2>
            
            <Card class="w-full max-w-md">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>This is a card description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the main content of the card.</p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>
          </section>

          <!-- Input Component Section -->
          <section class="space-y-4">
            <h2 class="text-2xl font-bold">Input Component</h2>
            
            <div class="space-y-2 max-w-md">
              <Input placeholder="Default input" />
              <Input placeholder="Disabled input" disabled />
            </div>
          </section>

          <!-- Label Component Section -->
          <section class="space-y-4">
            <h2 class="text-2xl font-bold">Label Component</h2>
            
            <div class="space-y-2 max-w-md">
              <Label for="example">Example Label</Label>
              <Input id="example" placeholder="Input with label" />
            </div>
          </section>

          <!-- Form Components Section -->
          <section class="space-y-4">
            <h2 class="text-2xl font-bold">Form Components</h2>
            
            <div class="space-y-4 max-w-md">
              <FormField name="example">
                <FormItem>
                  <FormLabel>Example Field</FormLabel>
                  <FormControl>
                    <Input placeholder="Form input example" />
                  </FormControl>
                  <FormMessage>This is a form message</FormMessage>
                </FormItem>
              </FormField>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import UI components
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

// Define component options
defineOptions({
  name: 'ComponentsTest'
})
</script> 