import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue')
    },
    {
      // Authenticated routes with layout wrapper
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('../pages/DashboardPage.vue')
        },
        {
          path: '/resources',
          name: 'resources',
          component: () => import('../pages/ResourcesPage.vue')
        },
        {
          path: '/categories',
          name: 'categories',
          component: () => import('../pages/CategoriesPage.vue')
        },
        {
          path: '/types',
          name: 'types',
          component: () => import('../pages/ResourceTypesPage.vue')
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('../pages/UsersPage.vue')
        },
        {
          path: '/components',
          name: 'components',
          component: () => import('../pages/ComponentsTest.vue'),
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFoundPage.vue')
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('adminToken')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.path === '/login' && isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router 