<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ServerPeer } from '../PeerHelper/ServerPeer'


const connectState = ref({
  connect2Server: false,
  connect2Peer: false,
  callMap: new Map()
})

const countRef = ref(0)
const clients = ref([])

const server = new ServerPeer((state) => {
  console.log('cb', state)
  Object.assign(connectState.value, state)
  countRef.value = connectState.value.callMap.size
  clients.value = Array.from(connectState.value.callMap.keys())
})

const disconnect = (key: number) => {
  server.disconnect2PeerCall(key)
}
</script>

<template>
  <div>
    <p>信令服务器连接状态:{{ connectState.connect2Server }}</p>
    <p>连接客户端数量：{{ countRef }}</p>
    <button v-for="item in clients" :key="item" @click="disconnect(item)">断开连接：{{ item }}</button>
  </div>
</template>

<style scoped></style>
