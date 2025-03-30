<template>
  <div class="bg-white shadow-lg rounded-lg p-6">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Weather Dashboard</h2>

    <label for="location-select" class="sr-only">Select a location</label>
    <div class="flex gap-2 mb-4">
      <select id="location-select" v-model="selectedLocation"
        class="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500" aria-labelledby="location-label">
        <option v-for="location in HARDCODED_LOCATIONS" :key="location.id" :value="location">
          {{ location.name }} ({{ location.country }})
        </option>
      </select>

      <button @click="fetchWeather"
        class="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="isLoading" aria-label="Fetch weather data" aria-busy="true" aria-live="polite">
        {{ isLoading ? 'Fetching...' : 'Get Weather' }}
      </button>
    </div>

    <div v-if="error" role="alert" class="text-red-600">
      {{ error.message }}
    </div>

    <WeatherCard v-if="weather" :weather="weather" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import WeatherCard from "@/presentation/components/WeatherCard.vue";
import { HARDCODED_LOCATIONS, type Location } from "@/domain/entities/Location";
import type { Weather } from "@/domain/entities/Weather";

const selectedLocation = ref<Location | null>(HARDCODED_LOCATIONS[0]);
const weather = ref<Weather | null>(null);
const isLoading = ref<boolean>(false)
const error = ref<Error | null>(null)

const fetchWeather = () => {
  if (!selectedLocation.value) {
    error.value = new Error('No location selected');
    return;
  }

  isLoading.value = true

  weather.value = {
    location: selectedLocation.value,
    temperature: Math.floor(Math.random() * 30),
    humidity: Math.floor(Math.random() * 100),
    windSpeed: Number((Math.random() * 10).toFixed(1)),
    description: "Partly Cloudy",
    date: new Date(),
  };

  isLoading.value = false
};
</script>
