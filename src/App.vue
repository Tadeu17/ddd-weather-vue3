<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-100 p-6">
    <header class="mb-6 text-center">
      <h1 class="text-3xl font-bold text-gray-800">Weather App</h1>
    </header>
    <main class="w-full max-w-4xl">
      <TheDashboard />
    </main>
  </div>
</template>

<script setup lang="ts">
import TheDashboard from "@/presentation/views/TheDashboard.vue";
</script>
