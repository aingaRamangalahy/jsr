import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
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
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isAuthenticated()) {
    toast.error('Please sign in to access this page')
    next({ name: 'login' })
  } else if (to.name === 'login' && authStore.isAuthenticated()) {
    next({ name: 'resources' })
  } else {
    next()
  }
})

export default router 