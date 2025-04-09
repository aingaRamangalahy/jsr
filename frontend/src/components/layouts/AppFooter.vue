<template>
  <footer class="py-2">
    <div>
      <div class="flex items-center justify-between space-y-2">
        <router-link
          to="/about"
          class="text-xs text-gray-600 dark:text-blue-300 text-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline"
        >
          @ 2025 JS Resources
        </router-link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          class="flex text-xs text-center text-gray-600 dark:text-blue-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <i class="pi pi-github mr-1"></i>
          GitHub
        </a>
      </div>
    </div>
  </footer>
</template>
