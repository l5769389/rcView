<script setup lang="ts">
import ClientView from './components/ClientView.vue'
import ServerView from './components/ServerView.vue'
const isServer = import.meta.env.RENDERER_VITE_ROLE
</script>

<template>
  <div>
    <ServerView v-if="isServer"/>
    <ClientView v-else />
  </div>
</template>
