<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import desertImage from '../assets/desert.jpg'
import type { User } from '../types/User'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

function signup() {
  errorMessage.value = ''

    if (!username.value || !email.value || !password.value) {
    errorMessage.value = 'Please fill all fields.'
    return
    }

    if (username.value.length < 3) {
    errorMessage.value = 'Username must be at least 3 characters.'
    return
    }

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

if (!emailPattern.test(email.value)) {
  errorMessage.value = 'Invalid email format.'
  return
}

if (password.value.length < 6) {
  errorMessage.value = 'Password must be at least 6 characters.'
  return
}

  const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')

  const usernameExists = users.some(
    user => user.username.toLowerCase() === username.value.toLowerCase()
  )

  if (usernameExists) {
    errorMessage.value = 'Username already exists.'
    return
  }

  const newUser: User = {
    id: Date.now(),
    username: username.value,
    email: email.value,
    password: password.value,
    preferences: {
      climate: 'any',
      maxBudget: 0,
      theme: 'any',
      continent: 'any',
      safety: 'any',
      vibe: 'any'
    },
    wishlist: [],
    isAdmin: false
  }

  users.push(newUser)

  localStorage.setItem('users', JSON.stringify(users))
  localStorage.setItem('currentUser', JSON.stringify(newUser))

  router.push('/')
}
</script>

<template>
  <div
    class="auth-page"
    :style="{ backgroundImage: `url(${desertImage})` }"
  >
    <div class="auth-card">
      <h2>Create Account</h2>

      <p class="subtitle">
        Sign up to save preferences and get recommendations.
      </p>

        <form @submit.prevent="signup">
        <label>Username</label>
        <input v-model="username" type="text" placeholder="Enter username" />

        <label>Email</label>
        <input v-model="email" type="email" placeholder="Enter email" />

        <label>Password</label>
        <input v-model="password" type="password" placeholder="Enter password" />

        <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </p>

        <button type="submit">Sign Up</button>
        </form>

      <p class="switch-text">
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>