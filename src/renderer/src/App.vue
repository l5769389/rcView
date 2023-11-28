<script setup lang="ts">
import ClientView from '@renderer/components/ClientView.vue'
import ServerView from '@renderer/components/ServerView.vue'
import Config from '@config/config'

const Role = Config.ROLE
</script>

<template>
  <ServerView v-if="Role === 'SERVER'" />
  <ClientView v-else />
</template>
