<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import nightImage from '../assets/night.jpg'
import type { User } from '../types/User'


const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')

const adminExists = users.some(user => user.isAdmin)

if (!adminExists) {
  const adminUser: User = {
    id: 999999,
    username: 'Admin',
    email: 'admin@rahal.com',
    password: 'admin123',
    preferences: {
      climate: 'any',
      maxBudget: 0,
      theme: [],
      continent: 'any',
      vibe: []
    },
    wishlist: [],
    isAdmin: true
  }

  users.push(adminUser)

  localStorage.setItem('users', JSON.stringify(users))
}


function login() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter email and password.'
    return
  }

  const storedUsers: User[] = JSON.parse(
    localStorage.getItem('users') || '[]'
  )

  const foundUser = storedUsers.find(
    user =>
      user.email.toLowerCase() === email.value.toLowerCase() &&
      user.password === password.value
  )

  if (!foundUser) {
    errorMessage.value = 'Invalid email or password.'
    return
  }

  localStorage.setItem('currentUser', JSON.stringify(foundUser))

  router.push('/')
}
</script>

<template>
  <div
    class="auth-page"
    :style="{ backgroundImage: `url(${nightImage})` }"
  >
    <div class="auth-card">
      <h2>Welcome Back</h2>

      <p class="subtitle">
        Login to continue your Rahal journey.
      </p>

      <form @submit.prevent="login">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="Enter email" />

        <label>Password</label>
        <input v-model="password" type="password" placeholder="Enter password" />

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <button type="submit">Login</button>
      </form>

      <p class="switch-text">
        Don’t have an account?
        <router-link to="/signup">Sign up</router-link>
      </p>
    </div>
  </div>
</template>