<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { User } from '../types/User'
import logoImage from '../assets/logo.png'

const router = useRouter()

const currentUser = ref<User | null>(
  JSON.parse(localStorage.getItem('currentUser') || 'null')
)

function logout() {
  localStorage.removeItem('currentUser')
  router.push('/')

  window.location.reload()
}
</script>

<template>
  <nav class="top-nav">
    <router-link to="/">
      <img :src="logoImage" alt="Rahal Logo" class="nav-logo" />
    </router-link>

    <div class="nav-links">
      <template v-if="!currentUser">
        <router-link to="/login">Login</router-link>

        <span class="separator">|</span>

        <router-link to="/signup">Signup</router-link>
      </template>

        <template v-else>
        <router-link to="/" class="welcome-text">
            Welcome, {{ currentUser.username }}
        </router-link>

        <span class="separator">|</span>

        <router-link to="/preferences">
            Preferences
        </router-link>

        <span class="separator">|</span>

        <router-link to="/wishlist">
            Wishlist
        </router-link>

        <template v-if="currentUser.isAdmin">
            <span class="separator">|</span>

            <router-link to="/admin">
            Admin Page
            </router-link>
        </template>

        <span class="separator">|</span>

        <button class="logout-btn" @click="logout">
            Logout
        </button>
        </template>
    </div>
  </nav>
</template>