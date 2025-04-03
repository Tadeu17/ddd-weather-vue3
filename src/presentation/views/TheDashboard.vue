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

    <div v-if="weatherRange && weatherRange.length > 0" class="flex flex-wrap gap-3">
      <WeatherCard v-for="weather in weatherRange" :key="weather.date.toString()" :weather="weather" class="grow-0 w-40"
        :class="isToday(weather.date) ? 'bg-blue-200' : 'bg-gray-50'">
      </WeatherCard>
    </div>
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
import { get7daysBeforeAndAfterWeather } from "@/application/services/WeatherService"; // Import repository

// highlight today's date
const today = new Date();
today.setHours(0, 0, 0, 0);

const isToday = (date: Date): boolean => {
  const givenDate = new Date(date);
  givenDate.setHours(0, 0, 0, 0); // Remove time part
  return givenDate.getTime() === today.getTime();
};


// location
const locations = ref<Location[]>([]);
const selectedLocation = ref<Location | null>(null);

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


// weather
const weatherRange = ref<Weather[] | null>(null)
const isLoading = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

const fetchWeather = async () => {
  weatherRange.value = null

  if (!selectedLocation.value) {
    errorMessage.value = "No location selected.";
    return;
  }

  isLoading.value = true;

  try {
    const result = await get7daysBeforeAndAfterWeather(selectedLocation.value);

    if (!result) {
      errorMessage.value = "No weather data available for this location.";
      return;
    }

    weatherRange.value = result;
  } catch (err) {
    console.error("Error fetching weather:", err);
    errorMessage.value = "An unexpected error occurred while fetching weather.";
  } finally {
    isLoading.value = false;
  }
};


onBeforeMount(fetchLocations);
</script>
