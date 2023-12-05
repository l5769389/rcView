<script setup lang="ts">
import ClientView from '@renderer/components/ClientView.vue'
import ServerView from '@renderer/components/ServerView.vue'
import { ref } from 'vue'
import { config, setConfig } from '../../config/config'

const Config = JSON.parse(window['api'].readConfig())
setConfig(Config)

const isServerRef = ref<boolean>(config['IS_SERVER'])
</script>

<template>
  <ServerView v-if="isServerRef" />
  <ClientView v-else />
</template>
