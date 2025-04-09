<template>
  <div
    class="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-blue-500 dark:to-blue-700 p-4 text-white">
    <div class="max-w-3xl mx-auto">
      <p class="text-lg font-bold mb-3">JavaScript Learning Resources</p>
      <p class="text-sm opacity-90 mb-6 max-w-2xl">
        Discover the best resources to learn JavaScript from beginner to advanced. Curated and rated
        by the community.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 mt-6">
        <Button severity="secondary"
          class="bg-white/20 hover:bg-white/30 dark:bg-gray-900/30 dark:hover:bg-gray-900/50 p-2 rounded-md">
          <i class="pi pi-lightbulb mr-2"></i>
          <router-link to="/add-resource" class="text-white dark:text-blue-300">
            Submit Resource
          </router-link>
        </Button>
      </div>
    </div>
  </div>
</template>
