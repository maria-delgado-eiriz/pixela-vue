import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('./views/LayoutView.vue'),
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          return next({ name: 'login' })
        }
        return next()
      },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('./views/HomeView.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('./views/SignUpView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('./views/ForgotPasswordView.vue'),
    },
  ],
})

export default router
