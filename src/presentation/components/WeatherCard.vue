<template>
  <div class="p-4 rounded shadow-md border">
    <h3>
      <strong>{{ formattedDate }}</strong>
    </h3>
    <p class="text-gray-700">Temperature: <strong>{{ weather.temperature }}°C</strong></p>
    <p class="text-gray-700">Wind Speed: <strong>{{ weather.windSpeed }} km/h</strong></p>
    <p class="text-gray-700">Condition: <strong>{{ weather.description }}</strong></p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatDate } from "@/utils/dateUtils";

import type { WeatherProps } from "./WeatherCard.types";

const props = defineProps<WeatherProps>();

const formattedDate = computed(() => formatDate(props.weather.date));
</script>
