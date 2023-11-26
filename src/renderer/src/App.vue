<script setup lang="ts">
import ClientView from './components/ClientView.vue'
import ServerView from './components/ServerView.vue'

const Role = import.meta.env.RENDERER_VITE_ROLE
</script>

<template>
  <div>
    <ServerView v-if="Role === 'SERVER'" />
    <ClientView v-else />
  </div>
</template>
