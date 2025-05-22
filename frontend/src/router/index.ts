import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'vue-sonner'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('@/pages/AuthCallbackPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/ResourcesPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/DashboardPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/resources',
      name: 'resources',
      component: () => import('@/pages/ResourcesPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/resources/:id',
      name: 'resource-details',
      component: () => import('@/pages/ResourceDetailsPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/submit',
      name: 'submit-resource',
      component: () => import('@/pages/SubmitResourcePage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue')
    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  console.log(`Navigation: ${from.path} -> ${to.path}`)
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // Special handling for auth callback route
  if (to.name === 'auth-callback') {
    console.log('Detected auth callback route, allowing navigation')
    return next()
  }

  // Check if route requires authentication
  if (requiresAuth) {
    console.log('Route requires authentication')
    if (!authStore.isAuthenticated) {
      console.log('User not authenticated, showing auth modal')
      const authState = useAuth()
      authState.openAuthModal()
      toast.error('Please sign in to access this page')
      // Redirect to home page instead of login page
      return next({ name: 'home' })
    }
  }

  // Default: allow navigation
  return next()
})

export default router 