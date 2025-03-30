<template>
  <div class="bg-gray-50 p-4 rounded shadow-md border">
    <h3 class="text-xl font-bold text-gray-900">
      <span>{{ weather.location.name }}, {{ weather.location.country }}</span>
    </h3>
    <p class="text-gray-700">Temperature: <strong>{{ weather.temperature }}°C</strong></p>
    <p class="text-gray-700">Humidity: <strong>{{ weather.humidity }}%</strong></p>
    <p class="text-gray-700">Wind Speed: <strong>{{ weather.windSpeed }} km/h</strong></p>
    <p class="text-gray-700">Condition: <strong>{{ weather.description }}</strong></p>
    <p class="text-gray-600 text-sm">Date: {{ formattedDate }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatDate } from "@/utils/dateUtils";

import type { WeatherProps } from "./WeatherCard.types";

const props = defineProps<WeatherProps>();

const formattedDate = computed(() => formatDate(props.weather.date));
</script>
