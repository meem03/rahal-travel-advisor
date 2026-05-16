<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Destination } from '../types/Destination'
import Navbar from '../components/Navbar.vue'


import alpsImage from '../assets/alps.jpg'
import DestinationCard from '../components/DestinationCard.vue'
import { getAvailableDestinations } from '../utils/destinationStorage'

const searchText = ref('')
const selectedClimate = ref('any')
const selectedContinent = ref('any')
const maxBudget = ref<number | null>(null)
const availableDestinations = getAvailableDestinations()



const filteredDestinations = computed(() => {
  return availableDestinations.filter((destination) => {
    const matchesSearch =
      destination.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
      destination.country.toLowerCase().includes(searchText.value.toLowerCase())

    const matchesClimate =
      selectedClimate.value === 'any' ||
      destination.climate === selectedClimate.value

    const matchesContinent =
      selectedContinent.value === 'any' ||
      destination.continent === selectedContinent.value

    const matchesBudget =
      !maxBudget.value ||
      destination.budget <= maxBudget.value

    return matchesSearch && matchesClimate && matchesContinent && matchesBudget
  })
})

const recommendedDestinations = computed(() => {
  if (!currentUser.value) return []

  const preferences = currentUser.value.preferences

  return [...availableDestinations]
    .map(destination => {
      let score = 0

      if (
        preferences.climate !== 'any' &&
        destination.climate === preferences.climate
      ) {
        score += 2
      }

      if (
        preferences.continent !== 'any' &&
        destination.continent === preferences.continent
      ) {
        score += 2
      }

      if (
        preferences.maxBudget > 0 &&
        destination.budget <= preferences.maxBudget
      ) {
        score += 2
      }

      if (
        preferences.theme.length > 0 &&
        preferences.theme.some(theme =>
          destination.theme
            .toLowerCase()
            .includes(theme.toLowerCase())
        )
      ) {
        score += 2
      }

    if (
      preferences.vibe.length > 0 &&
      preferences.vibe.some(vibe =>
        destination.vibe
          .toLowerCase()
          .includes(vibe.toLowerCase())
      )
    ) {
      score += 2
    }

      return {
        ...destination,
        recommendationScore: score
      }
    })

    .sort((a, b) => b.recommendationScore - a.recommendationScore)

    .slice(0, 3)
})


const selectedDestination = ref<Destination | null>(null)

function closeModal() {
  selectedDestination.value = null
}

import type { User } from '../types/User'

const currentUser = ref<User | null>(
  JSON.parse(localStorage.getItem('currentUser') || 'null')
)

function toggleWishlist() {
  if (!currentUser.value || !selectedDestination.value) return

  const wishlist = currentUser.value.wishlist

  const exists = wishlist.includes(selectedDestination.value.id)

  if (exists) {
    currentUser.value.wishlist =
      wishlist.filter(id => id !== selectedDestination.value?.id)
  } else {
    wishlist.push(selectedDestination.value.id)
  }

  localStorage.setItem(
    'currentUser',
    JSON.stringify(currentUser.value)
  )

  const users: User[] = JSON.parse(
    localStorage.getItem('users') || '[]'
  )

  const updatedUsers = users.map(user =>
    user.id === currentUser.value?.id
      ? currentUser.value!
      : user
  )

  localStorage.setItem(
    'users',
    JSON.stringify(updatedUsers)
  )
}

function isWishlisted(destinationId: number) {
  if (!currentUser.value) return false

  return currentUser.value.wishlist.includes(destinationId)
}

const destinationRatings = ref<Record<number, Record<number, number>>>(
  JSON.parse(localStorage.getItem('destinationRatings') || '{}')
)

function rateDestination(rating: number) {
  if (!selectedDestination.value || !currentUser.value) return

  const destinationId = selectedDestination.value.id
  const userId = currentUser.value.id

  if (!destinationRatings.value[destinationId]) {
    destinationRatings.value[destinationId] = {}
  }

  destinationRatings.value[destinationId][userId] = rating

  localStorage.setItem(
    'destinationRatings',
    JSON.stringify(destinationRatings.value)
  )
}

function getUserRating(destinationId: number) {
  if (!currentUser.value) return 0

  return destinationRatings.value[destinationId]?.[currentUser.value.id] || 0
}

function getAverageRating(destinationId: number) {
  const ratingsObject = destinationRatings.value[destinationId]

  if (!ratingsObject) return 'No ratings'

  const ratings = Object.values(ratingsObject)

  if (ratings.length === 0) return 'No ratings'

  const total = ratings.reduce((sum, rating) => sum + rating, 0)

  return (total / ratings.length).toFixed(1)
}

function getReviewCount(destinationId: number) {
  const ratingsObject = destinationRatings.value[destinationId]

  if (!ratingsObject) return 0

  return Object.values(ratingsObject).length
}

function deleteMyRating() {
  if (!selectedDestination.value || !currentUser.value) return

  const destinationId = selectedDestination.value.id
  const userId = currentUser.value.id

  if (destinationRatings.value[destinationId]) {
    delete destinationRatings.value[destinationId][userId]

    localStorage.setItem(
      'destinationRatings',
      JSON.stringify(destinationRatings.value)
    )
  }
}

</script>

<template>

  <div class="app">
    <Navbar />
    <section class="hero" :style="{ backgroundImage: `url(${alpsImage})` }">
      <div class="overlay"></div>

      <div class="hero-text">
        <h1>RAHAL</h1>
        <p>Smart Travel Destination Advisor</p>
      </div>
    </section>

    <section class="features-section">
      <h2>Explore Rahal Features</h2>

      <div class="main-features-grid">
        <a href="#destination-search" class="feature-card clickable-feature">
          <h3>Destination Search</h3>
          <p>
            Search for destinations by name or country and quickly discover places that match your interest.
          </p>
        </a>

        <a href="#destination-search" class="feature-card clickable-feature">
          <h3>Travel Filters</h3>
          <p>
            Filter destinations by climate, continent, and budget to narrow down your travel options.
          </p>
        </a>
      </div>

      <div class="secondary-features-grid">
        <router-link
          :to="currentUser ? '/preferences' : '/login'"
          class="feature-card locked-feature"
        >
          <h3>Smart Recommendations</h3>
          <p>
            {{
              currentUser
                ? 'View personalized destination recommendations based on your preferences.'
                : 'Login to receive destination suggestions based on your saved travel preferences.'
            }}
          </p>
        </router-link>

        <router-link
          :to="currentUser ? '/wishlist' : '/login'"
          class="feature-card locked-feature"
        >
          <h3>Wishlist</h3>
          <p>
            {{
              currentUser
                ? 'Access and manage your saved favorite destinations.'
                : 'Login to save your favorite destinations and access them later from your wishlist.'
            }}
          </p>
        </router-link>

        <a
          href="#destination-search"
          class="feature-card locked-feature"
        >
          <h3>Ratings</h3>
          <p>
            {{
              currentUser
                ? 'Rate destinations and help update the overall rating for each place.'
                : 'Login to rate destinations and help update the overall rating for each place.'
            }}
          </p>
        </a>
      </div>
    </section>

    <section
        v-if="currentUser"
        class="recommendations-section"
        >
        <h2>Recommended For You</h2>

        <div class="destinations-grid">
            <DestinationCard
            v-for="destination in recommendedDestinations"
            :key="destination.id"
            :destination="destination"
            :average-rating="getAverageRating(destination.id)"
            @select="selectedDestination = $event"
            />
        </div>
    </section>

    <section id="destination-search" class="destinations-section">
      <h2>Find Your Destination</h2>

      <div class="filters-box">
        <input
          v-model="searchText"
          type="text"
          placeholder="Search by destination or country..."
        />

        <select v-model="selectedClimate">
          <option value="any">Any Climate</option>
          <option value="tropical">Tropical</option>
          <option value="temperate">Temperate</option>
          <option value="hot">Hot</option>
          <option value="cold">Cold</option>
        </select>

        <select v-model="selectedContinent">
          <option value="any">Any Continent</option>
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="africa">Africa</option>
          <option value="americas">Americas</option>
          <option value="oceania">Oceania</option>
        </select>

        <input
          v-model.number="maxBudget"
          type="number"
          placeholder="Max budget"
        />
      </div>

      <p class="results-count">
        {{ filteredDestinations.length }} destination(s) found
      </p>

      <div class="destinations-grid">
        <DestinationCard
          v-for="destination in filteredDestinations"
          :key="destination.id"
          :destination="destination"
          :average-rating="getAverageRating(destination.id)"
          @select="selectedDestination = $event"
        />
      </div>
    </section>

    <div v-if="selectedDestination" class="modal-overlay" @click="closeModal">
      <div class="modal-card" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>

        <img :src="selectedDestination.image" :alt="selectedDestination.name" />

        <h2>{{ selectedDestination.name }}, {{ selectedDestination.country }}</h2>

        <p><strong>Climate:</strong> {{ selectedDestination.climate }}</p>
        <p><strong>Budget:</strong> ${{ selectedDestination.budget }}</p>
        <p><strong>Theme:</strong> {{ selectedDestination.theme }}</p>
        <p><strong>Continent:</strong> {{ selectedDestination.continent }}</p>
        <p><strong>Vibe:</strong> {{ selectedDestination.vibe }}</p>
        <button
            v-if="currentUser"
            class="wishlist-btn"
            @click="toggleWishlist"
            >
            <span v-if="selectedDestination &&
                isWishlisted(selectedDestination.id)">
                ❤️ Saved
            </span>

            <span v-else>
                🤍 Add to Wishlist
            </span>
        </button>

        <div v-if="currentUser && selectedDestination" class="rating-section">
            <h3>Rate this destination</h3>

            <div class="star-rating">
                <button
                v-for="star in 5"
                :key="star"
                @click="rateDestination(star)"
                class="star-btn"
                >
                {{ star <= getUserRating(selectedDestination.id) ? '★' : '☆' }}
                </button>
            </div>

            <p class="average-rating">
                Average Rating:
                {{ getAverageRating(selectedDestination.id) }}
                ({{ getReviewCount(selectedDestination.id) }} review(s))
            </p>

            <button
                v-if="selectedDestination && getUserRating(selectedDestination.id) > 0"
                class="delete-rating-btn"
                @click="deleteMyRating"
                >
                Delete My Rating
            </button>
        </div>

      </div>
    </div>

  </div>
</template>