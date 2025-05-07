<template>
  <div class="container mx-auto py-8 px-4">
    <div class="text-center max-w-3xl mx-auto mb-12">
      <h1 class="text-4xl font-bold mb-4">Welcome to JSResources</h1>
      <p class="text-lg text-muted-foreground">
        Your curated platform for JavaScript learning resources. Find the best tutorials, courses, and documentation for your learning journey.
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <Card class="h-full" variant="free">
        <CardHeader>
          <CardTitle>Free Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="mb-4">Discover high-quality free resources to learn JavaScript and its ecosystem. Perfect for beginners and experienced developers alike.</p>
        </CardContent>
        <CardFooter>
          <Button class="w-full" asChild>
            <router-link to="/resources?pricingType=free">Browse Free Resources</router-link>
          </Button>
        </CardFooter>
      </Card>
      
      <Card class="h-full" variant="premium">
        <CardHeader>
          <CardTitle>Premium Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="mb-4">Explore premium paid courses and resources for in-depth learning. Invest in your skills with expert-created content.</p>
        </CardContent>
        <CardFooter>
          <Button class="w-full" variant="secondary" asChild>
            <router-link to="/resources?pricingType=paid">Browse Paid Resources</router-link>
          </Button>
        </CardFooter>
      </Card>
    </div>
    
    <Card class="bg-muted">
      <CardHeader>
        <CardTitle>Join Our Community</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="mb-4">
          Sign in with GitHub to bookmark resources, submit new content, and participate in the community. Help us build the best JavaScript resource platform!
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <router-link to="/auth/login">Sign in with GitHub</router-link>
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
</script> 