<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ServerPeer } from '@renderer/PeerHelper/ServerPeer'
import { MediaConnection } from 'peerjs'

const connectState = ref({
  connect2Server: false,
  connect2Peer: false,
  callMap: new Map<number, MediaConnection>()
})

const countRef = ref(0)
const clients = ref<number[]>([])
let server: ServerPeer

onMounted(() => {
  connect2peer()
})

const connect2peer = () => {
  server = new ServerPeer((state) => {
    Object.assign(connectState.value, state)
    countRef.value = connectState.value.callMap.size
    clients.value = Array.from(connectState.value.callMap.keys())
  })
}

const disconnect = (key: number) => {
  server.disconnect2PeerCall(key)
}
</script>

<template>
  <div class="p-[10px] text-[25px] flex">
    <div>
      <span class="mr-[10px]">信令服务器连接状态：</span>
      <n-switch v-model:value="connectState.connect2Server" size="large" disabled />
      <n-button v-if="!connectState.connect2Server" @click="connect2peer">连接信令服务器</n-button>
    </div>
    <div v-if="clients.length > 0">
      <span>断开连接：</span>
      <n-button
        v-for="(item, index) in clients"
        :key="item"
        type="warning"
        style="margin-right: 10px"
        @click="disconnect(item)"
        >客户端{{ index + 1 }}
      </n-button>
    </div>
  </div>
</template>

<style scoped></style>
