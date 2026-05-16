<script setup lang="ts">
import { computed, ref } from 'vue'
import type { User } from '../types/User'
import { getAvailableDestinations } from '../utils/destinationStorage'
import DestinationCard from '../components/DestinationCard.vue'
import auroraImage from '../assets/aurora.jpg'
import Navbar from '../components/Navbar.vue'
import type { Destination } from '../types/Destination'


const availableDestinations = getAvailableDestinations()
const currentUser: User | null = JSON.parse(
  localStorage.getItem('currentUser') || 'null'
)

const selectedDestination = ref<Destination | null>(null)

function closeModal() {
  selectedDestination.value = null
}

const wishlistDestinations = computed(() => {
  if (!currentUser) return []

  return availableDestinations.filter(destination =>
    currentUser.wishlist.includes(destination.id)
  )
})
</script>

<template>

  <Navbar />
  <section
    class="wishlist-hero"
    :style="{ backgroundImage: `url(${auroraImage})` }"
  >
    <div class="wishlist-overlay"></div>

    <div class="wishlist-hero-text">
      <h1>WISHLIST</h1>
      <p>Your saved dream destinations.</p>
    </div>
  </section>

  <div class="wishlist-page">
    <h1>Your Wishlist</h1>

    <div
      v-if="wishlistDestinations.length > 0"
      class="destinations-grid"
    >
      <DestinationCard
        v-for="destination in wishlistDestinations"
        :key="destination.id"
        :destination="destination"
        @select="selectedDestination = $event"
      />
    </div>

    <p
      v-else
      class="empty-text"
    >
      No destinations saved yet.
    </p>
  </div>


  <div
  v-if="selectedDestination"
  class="modal-overlay"
  @click="closeModal"
>
  <div class="modal-card" @click.stop>
    <button class="close-btn" @click="closeModal">
      ×
    </button>

    <img
      :src="selectedDestination.image"
      :alt="selectedDestination.name"
    />

    <h2>
      {{ selectedDestination.name }},
      {{ selectedDestination.country }}
    </h2>

    <p>
      <strong>Climate:</strong>
      {{ selectedDestination.climate }}
    </p>

    <p>
      <strong>Budget:</strong>
      ${{ selectedDestination.budget }}
    </p>

    <p>
      <strong>Theme:</strong>
      {{ selectedDestination.theme }}
    </p>

    <p>
      <strong>Continent:</strong>
      {{ selectedDestination.continent }}
    </p>

    <p>
      <strong>Vibe:</strong>
      {{ selectedDestination.vibe }}
    </p>
  </div>
</div>

</template>