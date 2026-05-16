<script setup lang="ts">
import { ref } from 'vue'
import type { User } from '../types/User'
import beachImage from '../assets/beach.jpg'
import Navbar from '../components/Navbar.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const currentUser: User | null = JSON.parse(
  localStorage.getItem('currentUser') || 'null'
)

const climate = ref(currentUser?.preferences.climate || 'any')
const maxBudget = ref(currentUser?.preferences.maxBudget || 0)
const continent = ref(currentUser?.preferences.continent || 'any')
const selectedThemes = ref<string[]>(currentUser?.preferences.theme || [])
const selectedVibes = ref<string[]>(currentUser?.preferences.vibe || [])
const successMessage = ref('')


const availableThemes = [
  'Nature',
  'Adventure',
  'Luxury',
  'Romantic',
  'Shopping',
  'Culture'
]

const availableVibes = [
  'Relaxed',
  'Modern',
  'Luxury',
  'Peaceful',
  'Adventurous',
  'Family-Friendly'
]

function savePreferences() {
  if (!currentUser) return

  currentUser.preferences = {
    climate: climate.value,
    maxBudget: maxBudget.value,
    theme: selectedThemes.value,
    continent: continent.value,
    vibe: selectedVibes.value
  }

  localStorage.setItem('currentUser', JSON.stringify(currentUser))

  const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')

  const updatedUsers = users.map(user =>
    user.id === currentUser.id ? currentUser : user
  )

  localStorage.setItem('users', JSON.stringify(updatedUsers))

  successMessage.value = 'Preferences saved successfully.'

  setTimeout(() => {
    router.push('/')
  }, 1000)
}
</script>

<template>

  <Navbar />
  <div
    class="preferences-page"
    :style="{ backgroundImage: `url(${beachImage})` }"
  >
    <div class="preferences-card">
      <h1>Travel Preferences</h1>
      <p class="preferences-subtitle">
        Customize your travel style so Rahal can recommend better destinations.
      </p>

      <form @submit.prevent="savePreferences">
        <label>Preferred Climate</label>
        <select v-model="climate">
          <option value="any">Any</option>
          <option value="tropical">Tropical</option>
          <option value="cold">Cold</option>
          <option value="hot">Hot</option>
          <option value="temperate">Temperate</option>
        </select>

        <label>Maximum Budget</label>
        <input
          v-model.number="maxBudget"
          type="number"
          placeholder="Enter max budget"
        />

        <label>Preferred Continent</label>
        <select v-model="continent">
          <option value="any">Any</option>
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="africa">Africa</option>
          <option value="americas">Americas</option>
          <option value="oceania">Oceania</option>
        </select>

        <label>Preferred Themes</label>

        <div class="checkbox-group">
          <label
            v-for="theme in availableThemes"
            :key="theme"
            class="checkbox-item"
          >
            <input
              type="checkbox"
              :value="theme"
              v-model="selectedThemes"
            />

            {{ theme }}
          </label>
        </div>

        <label>Preferred Vibes</label>

        <div class="checkbox-group">
          <label
            v-for="vibe in availableVibes"
            :key="vibe"
            class="checkbox-item"
          >
            <input
              type="checkbox"
              :value="vibe"
              v-model="selectedVibes"
            />

            {{ vibe }}
          </label>
        </div>

        <button type="submit">Save Preferences</button>

        <p v-if="successMessage" class="success-message">
          {{ successMessage }}
        </p>
      </form>
    </div>
  </div>
</template>