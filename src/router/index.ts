import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import SignupPage from '../pages/SignupPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import PreferencesPage from '../pages/PreferencesPage.vue'
import WishlistPage from '../pages/WishlistPage.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      component: HomePage
    },

    {
      path: '/login',
      component: LoginPage
    },

    {
      path: '/signup',
      component: SignupPage
    },

    {
      path: '/admin',
      component: AdminPage
    },

    {
      path: '/preferences',
      component: PreferencesPage
    },

    {
      path: '/wishlist',
      component: WishlistPage
    }

  ]
})

export default router