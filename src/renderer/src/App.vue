<script setup lang="ts">
import ClientView from '@renderer/components/ClientView.vue'
import ServerView from '@renderer/components/ServerView.vue'
import Config from '@config/config'
import { ref } from 'vue'

const Role = Config.ROLE
const isServerRef = ref<boolean>(Role === Config.SERVER)
</script>

<template>
  <ServerView v-if="isServerRef" />
  <ClientView v-else />
</template>
