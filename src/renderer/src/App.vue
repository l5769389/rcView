<script setup lang="ts">
import ClientView from '@renderer/components/ClientView.vue'
import ServerView from '@renderer/components/ServerView.vue'
import { ref } from 'vue'
import { setConfig, getConfig } from '../../config/config'
const Config = JSON.parse(window['api'].readConfig())
setConfig(Config)
const config = getConfig()
console.log(config['IS_SERVER'])
const isServerRef = ref<boolean>(config['IS_SERVER'])
</script>

<template>
  <ServerView v-if="isServerRef" />
  <ClientView v-else />
</template>
