<script setup lang="ts">
import { ref } from 'vue'
import { ServerPeer } from '../PeerHelper/ServerPeer'

const countRef = ref(0)
const connectState = ref({
  connect2Server: false,
  connect2Peer: false,
  callMap: new Map()
})
new ServerPeer((state) => {
  Object.assign(connectState.value, state)
})
</script>

<template>
  <div>
    <p>连接客户端数量：{{ countRef }}</p>
    <button v-for="item in connectState.callMap.keys()" :key="item">断开连接：{{ item }}</button>
  </div>
</template>

<style scoped></style>
