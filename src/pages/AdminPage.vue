<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Destination } from '../types/Destination'
import Navbar from '../components/Navbar.vue'
import worldImage from '../assets/world.jpg'
import {
  getAvailableDestinations,
  saveEditedDestination
} from '../utils/destinationStorage'

const adminDestinations = ref<Destination[]>(
  JSON.parse(localStorage.getItem('adminDestinations') || '[]')
)

const deletedDestinationIds = ref<number[]>(
  JSON.parse(localStorage.getItem('deletedDestinationIds') || '[]')
)

const allDestinations = ref<Destination[]>(
  getAvailableDestinations()
)

const name = ref('')
const country = ref('')
const climate = ref('hot')
const budget = ref(0)
const theme = ref('')
const continent = ref('asia')
const vibe = ref('')
const image = ref('')
const imageError = ref('')
const formError = ref('')
const editingDestinationId = ref<number | null>(null)
const isEditing = computed(() => editingDestinationId.value !== null)

function removeSelectedImage() {
image.value = ''
imageError.value = ''
}

function handleImageUpload(event: Event) {
  imageError.value = ''

  const target = event.target as HTMLInputElement

  if (!target.files || target.files.length === 0) {
    return
  }

  const file = target.files[0]

  const validTypes = ['image/png', 'image/jpeg', 'image/jpg']

  if (!validTypes.includes(file.type)) {
    imageError.value = 'Only PNG and JPG images are allowed.'
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    image.value = reader.result as string
    formError.value = ''
    imageError.value = ''
  }

  reader.readAsDataURL(file)
}

function validateDestinationForm() {
  formError.value = ''

  if (!name.value.trim() || name.value.trim().length < 2) {
    formError.value = 'Destination name must be at least 2 characters.'
    return false
  }

  if (!country.value.trim() || country.value.trim().length < 2) {
    formError.value = 'Country must be at least 2 characters.'
    return false
  }

  if (budget.value <= 0) {
    formError.value = 'Budget must be greater than 0.'
    return false
  }

  if (!theme.value.trim()) {
    formError.value = 'Theme cannot be empty.'
    return false
  }

  if (!vibe.value.trim()) {
    formError.value = 'Vibe cannot be empty.'
    return false
  }

  if (!image.value) {
    formError.value = 'Please upload a destination image.'
    return false
  }

  const destinationExists = allDestinations.value.some(
    destination =>
      destination.name.toLowerCase() === name.value.trim().toLowerCase() &&
      destination.country.toLowerCase() === country.value.trim().toLowerCase()
  )

  if (destinationExists) {
    formError.value = 'This destination already exists.'
    return false
  }

  return true
}

function loadDestinationForEdit(destination: Destination) {
  editingDestinationId.value = destination.id

  name.value = destination.name
  country.value = destination.country
  climate.value = destination.climate
  budget.value = destination.budget
  theme.value = destination.theme
  continent.value = destination.continent
  vibe.value = destination.vibe
  image.value = destination.image

  window.scrollTo({
  top: 0,
  behavior: 'smooth'
})

}

function addDestination() {

  if (!validateDestinationForm()) return

  const newDestination: Destination = {
    id: Date.now(),
    name: name.value,
    country: country.value,
    climate: climate.value,
    budget: budget.value,
    theme: theme.value,
    continent: continent.value,
    rating: 0,
    vibe: vibe.value,
    image: image.value
  }



  adminDestinations.value.push(newDestination)
  allDestinations.value.push(newDestination)

  localStorage.setItem(
    'adminDestinations',
    JSON.stringify(adminDestinations.value)
  )

  name.value = ''
  country.value = ''
  budget.value = 0
  theme.value = ''
  vibe.value = ''
  image.value = ''
  imageError.value = ''
  formError.value = ''
}

function updateDestination() {
  if (!validateDestinationForm()) return

  if (editingDestinationId.value === null) return

  const updatedDestination: Destination = {
    id: editingDestinationId.value,
    name: name.value,
    country: country.value,
    climate: climate.value,
    budget: budget.value,
    theme: theme.value,
    continent: continent.value,
    rating: 0,
    vibe: vibe.value,
    image: image.value
  }

  saveEditedDestination(updatedDestination)

  allDestinations.value = getAvailableDestinations()

  cancelEdit()
}

function cancelEdit() {
  editingDestinationId.value = null

  name.value = ''
  country.value = ''
  climate.value = 'hot'
  budget.value = 0
  theme.value = ''
  continent.value = 'asia'
  vibe.value = ''
  image.value = ''

  formError.value = ''
  imageError.value = ''
}

function deleteDestination(id: number) {
  const confirmed = confirm('Are you sure you want to delete this destination?')

  if (!confirmed) return

  deletedDestinationIds.value.push(id)

  adminDestinations.value = adminDestinations.value.filter(
    destination => destination.id !== id
  )

  allDestinations.value = allDestinations.value.filter(
    destination => destination.id !== id
  )

  localStorage.setItem(
    'adminDestinations',
    JSON.stringify(adminDestinations.value)
  )

  localStorage.setItem(
    'deletedDestinationIds',
    JSON.stringify(deletedDestinationIds.value)
  )
}

</script>

<template>
  <Navbar />

  <section
  class="admin-hero"
  :style="{ backgroundImage: `url(${worldImage})` }"
>
  <div class="admin-overlay"></div>

  <div class="admin-hero-text">
    <h1>ADMIN PAGE</h1>

    <p>
      Manage and customize Rahal destinations.
    </p>
  </div>
</section>

  <div class="admin-page">
    <h1>Admin Destination Management</h1>

    <div class="admin-form">
      <h2>Add New Destination</h2>

      <form @submit.prevent="isEditing ? updateDestination() : addDestination()">
        <input v-model="name" type="text" placeholder="Destination name" required />
        <input v-model="country" type="text" placeholder="Country" required />

        <select v-model="climate">
          <option value="hot">Hot</option>
          <option value="cold">Cold</option>
          <option value="tropical">Tropical</option>
          <option value="temperate">Temperate</option>
        </select>

        <input v-model.number="budget" type="number" placeholder="Budget" required />
        <select v-model="theme" required>
          <option value="" disabled>Select Theme</option>
          <option value="beaches">Beaches</option>
          <option value="nature">Nature</option>
          <option value="shopping">Shopping</option>
          <option value="romance">Romance</option>
          <option value="adventure">Adventure</option>
          <option value="culture">Culture</option>
          <option value="luxury">Luxury</option>
      </select>

        <select v-model="continent">
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="africa">Africa</option>
          <option value="americas">Americas</option>
          <option value="oceania">Oceania</option>
        </select>

        <select v-model="vibe" required>
          <option value="" disabled>Select Vibe</option>
          <option value="relaxed">Relaxed</option>
          <option value="modern">Modern</option>
          <option value="luxury">Luxury</option>
          <option value="peaceful">Peaceful</option>
          <option value="adventurous">Adventurous</option>
          <option value="romantic">Romantic</option>
          <option value="family-friendly">Family-Friendly</option>
        </select>

        <div class="image-upload-section">
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            @change="handleImageUpload"
          />

          <p v-if="imageError" class="image-error">
            {{ imageError }}
          </p>

          <img
            v-if="image"
            :src="image"
            class="preview-image"
            alt="Preview"
          />

          <button
            v-if="image"
            type="button"
            class="remove-image-btn"
            @click="removeSelectedImage"
          >
            Remove Image
          </button>

        </div>


        <p v-if="formError" class="form-error">
          {{ formError }}
        </p>


        <button type="submit">
          {{ isEditing ? 'Update Destination' : 'Add Destination' }}
        </button>
      </form>

      <button
        v-if="isEditing"
        type="button"
        class="cancel-btn"
        @click="cancelEdit"
      >
        Cancel Edit
      </button>

    </div>

    <div class="admin-list">
      <h2>All Destinations</h2>

      <div
        v-for="destination in allDestinations"
        :key="destination.id"
        class="admin-destination"
      >
        <img :src="destination.image" :alt="destination.name" />

        <div>
          <h3>{{ destination.name }}, {{ destination.country }}</h3>
          <p>{{ destination.climate }} | ${{ destination.budget }} | {{ destination.continent }}</p>
        </div>

        <div class="admin-actions">
          <button
            class="edit-btn"
            @click="loadDestinationForEdit(destination)"
          >
            Edit
          </button>

          <button
            class="delete-btn"
            @click="deleteDestination(destination.id)"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  </div>
</template>