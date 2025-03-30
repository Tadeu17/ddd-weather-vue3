<template>
  <div class="bg-white shadow-lg rounded-lg p-6">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Weather Dashboard</h2>

    <label for="location-select" class="sr-only">Select a location</label>
    <div class="h-16 flex gap-2 mb-4">
      <select id="location-select" v-model="selectedLocation"
        class="p-2 border rounded w-full focus:ring-2 focus:ring-blue-500" aria-labelledby="location-label">
        <option v-for="location in locations" :key="location.id" :value="location">
          {{ location.name }} ({{ location.country }})
        </option>
      </select>

      <button @click="fetchWeather"
        class="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="isLoading" aria-label="Fetch weather data" aria-busy="true" aria-live="polite">
        {{ isLoading ? 'Fetching...' : 'Get Weather' }}
      </button>
    </div>

    <div v-if="errorMessage" role="alert" class="text-red-600">
      {{ errorMessage }}
    </div>

    <WeatherCard v-if="weather" :weather="weather" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";

// types
import type { Weather } from "@/domain/entities/Weather";
import type { Location } from "@/domain/entities/Location";

// components
import WeatherCard from "@/presentation/components/WeatherCard.vue";

// logic
import { getLocations } from "@/application/services/LocationService"; // Import repository
import { getCurrentWeather } from "@/application/services/WeatherService"; // Import repository

const locations = ref<Location[]>([]);
const selectedLocation = ref<Location | null>(null);
const weather = ref<Weather | null>(null);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

const fetchLocations = async () => {
  try {
    const result = await getLocations();

    if (result) {
      locations.value = result;
      selectedLocation.value = result[0] || null; // Default to the first location if available
    } else {
      throw Error('No locations were found')
    }
  } catch (err) {
    console.error("Error fetching locations:", err);
    errorMessage.value = "Failed to load locations. Please try again later.";
  }
};

const fetchWeather = async () => {
  weather.value = null;

  if (!selectedLocation.value) {
    errorMessage.value = "No location selected.";
    return;
  }

  isLoading.value = true;

  try {
    const result = await getCurrentWeather(selectedLocation.value);

    if (!result) {
      errorMessage.value = "No weather data available for this location.";
      return;
    }

    weather.value = result;
  } catch (err) {
    console.error("Error fetching weather:", err);
    errorMessage.value = "An unexpected error occurred while fetching weather.";
  } finally {
    isLoading.value = false;
  }
};


onBeforeMount(fetchLocations);
</script>
