<script setup lang="ts">
import type { Destination } from '../types/Destination'

defineProps<{
  destination: Destination
  averageRating?: string
}>()

defineEmits<{
  select: [destination: Destination]
}>()
</script>

<template>
  <div class="destination-card" @click="$emit('select', destination)">
    <img :src="destination.image" :alt="destination.name" />

    <div class="destination-info">
      <h3>{{ destination.name }}</h3>
      <p>{{ destination.country }}</p>

      <div class="details">
        <span>⭐ {{ averageRating }}</span>
        <span>💰 ${{ destination.budget }}</span>
      </div>

      <p class="vibe">{{ destination.vibe }}</p>
    </div>
  </div>
</template>